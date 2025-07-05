<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import pos from 'public/locations/positions.json';

const sceneContainer = ref(null);

onMounted(() => {
    let scene, renderer, camera, floor, orbitControls;
    let group, followGroup, model, skeleton, mixer, clock;
    let actions = {};
    let isFalling = false;
    let fallTimer = 0;
    let collisionSoundBuffer;
    let collisionSound;
    const controls = {
        key: [0, 0, 0],
        ease: new THREE.Vector3(),
        position: new THREE.Vector3(),
        up: new THREE.Vector3(0, 1, 0),
        rotate: new THREE.Quaternion(),
        current: 'Idle',
        fadeDuration: 0.5,
        walkVelocity: 40,
        rotateSpeed: 0.3,
        floorDecale: 0,
    };
    const sceneryData = pos;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const clickableObjects = [];
    const obstacles = [];
    const snowBoarderBB = new THREE.Box3();

    function loadScenery() {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();
        sceneryData.forEach(item => {
            if (item.type === 'image'){
                textureLoader.load(item.path,(texture)=>{
                    const imageGeometry = new THREE.PlaneGeometry(1,1);
                    const imageMaterial = new THREE.MeshStandardMaterial({
                        map: texture,
                        transparent: true,
                        side: THREE.DoubleSide // Render both sides of the plane
                    });
                    item.positions.forEach(pos => {
                        const imagePlane = new THREE.Mesh(imageGeometry, imageMaterial);

                        imagePlane.scale.set(item.scale, item.scale, 1);
                        imagePlane.position.set(pos.x, pos.y, pos.z);
                        if(item.ground){
                            imagePlane.rotation.x = -Math.PI/2;
                        }
                        if (item.link) {
                            imagePlane.userData.link = item.link; // Store the link on the object
                            clickableObjects.push(imagePlane);
                        }
                        
                        scene.add(imagePlane);
                })
                });
        
            }else{
                loader.load(item.path, (gltf) => {
                    const baseModel = gltf.scene;
                    item.positions.forEach(pos => {
                        const clone = baseModel.clone();

                        clone.position.set(pos.x, pos.y, pos.z);
                        clone.scale.set(item.scale, item.scale, item.scale);
                        if (item.link) {
                                clone.userData.link = item.link; // Store the link on the object
                                clickableObjects.push(clone);
                            }
                        clone.traverse(child => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        const obstacleBB = new THREE.Box3().setFromObject(clone);
                        obstacles.push(obstacleBB);
                        scene.add(clone);
                    });
                });
            }    
        });
    }

    function onPointerDown(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableObjects, true);
        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;
            while (clickedObject && !clickedObject.userData.link) {
                clickedObject = clickedObject.parent;
            }
            if (clickedObject?.userData.link) {
                const link = clickedObject.userData.link;
                const isExternal = link.startsWith('http://') || link.startsWith('https://');
                if(isExternal){
                    window.open(link,'_blank')
                }else{
                    window.location.href = link;
                }
            }
        }
    }

    function createSnowyGround() {
        const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 256, 256); // More segments for displacement
        const textureLoader = new THREE.TextureLoader();

        const snowColor = textureLoader.load('/textures/snow/snow_albedo.jpg');
        const snowNormal = textureLoader.load('/textures/snow/snow_normal.jpg');
        const snowRoughness = textureLoader.load('/textures/snow/snow_roughness.jpg');
        const snowHeight = textureLoader.load('/textures/snow/snow_height.jpg');
        [snowColor, snowNormal, snowRoughness, snowHeight].forEach(tex => {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(20, 20); // scale the tiling
        });
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: snowColor,
            normalMap: snowNormal,
            roughnessMap: snowRoughness,
            displacementMap: snowHeight,
            displacementScale: 0.2,
            roughness: 1,
            metalness: 0
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;

        floor = ground;
        scene.add(ground);
    }
    function loadModel() {
        const loader = new GLTFLoader();
        loader.load('/models/gltf/snowboarder.glb', gltf => {
            model = gltf.scene;
            model.scale.set(100, 100, 100);
            group.add(model);
            group.rotation.y = -Math.PI/2;
            model.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });
            skeleton = new THREE.SkeletonHelper(model);
            skeleton.visible = false;
            scene.add(skeleton);
            mixer = new THREE.AnimationMixer(model);
            const animations = gltf.animations;
            actions = {
                Idle: mixer.clipAction(animations[2]),
                Slide: mixer.clipAction(animations[4]),
                Left: mixer.clipAction(animations[6]),
                Right: mixer.clipAction(animations[7]),
                Backflip: mixer.clipAction(animations[8])
            };
            Object.values(actions).forEach(action => {
                if (action) {
                action.setEffectiveWeight(0);
                action.play();
                }
            });
            actions.Idle?.setEffectiveWeight(1);
            controls.current = 'Idle';
        });
    }
    function unwrapRad(r) { return Math.atan2(Math.sin(r), Math.cos(r)); }
    function updateCharacter(delta) {
        if (!orbitControls || !actions.Idle || !floor) return;

        if (isFalling) {
            fallTimer -= delta;
            if (fallTimer <= 0) {
                isFalling = false;
                const fallAction = actions.Backflip;
                const idleAction = actions.Idle;
                controls.current = 'Idle';
                if (fallAction && idleAction) {
                    fallAction.fadeOut(0.3);
                    idleAction.reset().setEffectiveWeight(1).fadeIn(0.3).play();
                }
                group.position.y = 0;

                if (collisionSoundBuffer) {
                    collisionSound = new THREE.Audio(audioListener);
                    collisionSound.setBuffer(collisionSoundBuffer);
                    collisionSound.setVolume(0.6); // adjust volume as needed
                    collisionSound.play();
                }
            }
            mixer?.update(delta);
            orbitControls.update();
            return;
        }

        const key = controls.key;
        const position = controls.position;
        const azimuth = orbitControls.getAzimuthalAngle();
        const play = key[0] || key[1] ? (key[1] === -1 ? 'Left' : key[1] === 1 ? 'Right' : 'Slide') : 'Idle';
        if (play !== 'Idle') {
            if (!snowSound.isPlaying) snowSound.play();
        } else {
            if (snowSound.isPlaying) snowSound.stop();
        }

        if (controls.current !== play) {
            const current = actions[play];
            const old = actions[controls.current];
            controls.current = play;
            if (current && old) {
                old.fadeOut(controls.fadeDuration);
                current.reset().setEffectiveWeight(1).fadeIn(controls.fadeDuration).play();
            }
        }

        if (play !== 'Idle') {
            const ease = controls.ease.set(key[1], 0, key[0]).normalize().multiplyScalar(controls.walkVelocity * delta);
            const angle = unwrapRad(Math.atan2(ease.x, ease.z) + azimuth);
            const rotate = controls.rotate.setFromAxisAngle(controls.up, angle);
            const newPosition = position.clone().add(ease.clone().applyAxisAngle(controls.up, azimuth));
            group.position.copy(newPosition);
            group.quaternion.rotateTowards(rotate, controls.rotateSpeed);
            snowBoarderBB.setFromObject(group);

            let hasCollision = obstacles.some(ob => snowBoarderBB.intersectsBox(ob));

            if (!hasCollision) {
                position.copy(newPosition);
                const offset = new THREE.Vector3(0, 15, 55).applyAxisAngle(controls.up, azimuth);
                const targetCamPos = position.clone().add(offset);
                targetCamPos.y = Math.max(targetCamPos.y, 15); // Enforce min Y here
                camera.position.lerp(targetCamPos, 0.1);
                orbitControls.target.copy(position).add(new THREE.Vector3(0, 1, 0));
                followGroup.position.copy(position);
            } else {
                group.position.copy(position);
                if (!isFalling) {
                    isFalling = true;
                    fallTimer = 1.2;
                    const fall = actions.Backflip;
                    const old = actions[controls.current];
                    controls.current = 'Backflip';
                    if (fall && old) {
                        old.fadeOut(0.3);
                        fall.reset().setEffectiveWeight(1).fadeIn(0.3).play();
                    }
                    group.position.y -= 1;
                }
            }
        
        }
        mixer?.update(delta);
        orbitControls.update();
    }

    function onKeyDown(e) {
        const k = controls.key;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') k[0] = -1;
        if (e.code === 'ArrowDown' || e.code === 'KeyS') k[0] = 1;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') k[1] = -1;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') k[1] = 1;
    }

    function onKeyUp(e) {
        const k = controls.key;
        if (e.code === 'ArrowUp' || e.code === 'KeyW') k[0] = 0;
        if (e.code === 'ArrowDown' || e.code === 'KeyS') k[0] = 0;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') k[1] = 0;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') k[1] = 0;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        const delta = clock.getDelta();
        updateCharacter(delta);
        renderer.render(scene, camera);
    }

    const container = sceneContainer.value;
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 35);
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const snowSound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('/sounds/snowboarding.mp3', function(buffer){
        snowSound.setBuffer(buffer);
        snowSound.setLoop(true);
        snowSound.setVolume(0.5);
    })
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    group = new THREE.Group();
    scene.add(group);
    followGroup = new THREE.Group();
    scene.add(followGroup);
    scene.fog = new THREE.Fog(0x87CEEB,30,800);

    const dirLight = new THREE.DirectionalLight(0xffffff, 5);
    dirLight.position.set(-50, 50, 50);
    dirLight.castShadow = true;
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const audioListener = new THREE.AudioListener();

    audioLoader.load('/sounds/fall.mp3', buffer => {
    collisionSoundBuffer = buffer;
    });
  

    const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd99 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(200, 50, -500); // Position it in the sky, far away
    scene.add(sun);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 1, 0);
    orbitControls.enableDamping = true;
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2.2

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    new RGBELoader()
        .setPath('/textures/equirectangular/')
        .load('lobe.hdr', texture => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environmentIntensity = 0.8;
        loadModel();
        loadScenery();
        createSnowyGround();
        });

    onUnmounted(() => {
        window.removeEventListener('resize', onWindowResize);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        if (renderer?.domElement) {
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        container.removeChild(renderer.domElement);
        }
        renderer?.setAnimationLoop(null);
        renderer?.dispose();
    });
});
</script>
<template>
  <div class="scene-wrapper">
    <div ref="sceneContainer" class="scene-container"></div>
  </div>
</template>
<style scoped>
.scene-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.scene-container {
  width: 100%;
  height: 100%;
}
</style>