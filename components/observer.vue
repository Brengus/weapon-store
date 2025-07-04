<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const sceneContainer = ref(null);

onMounted(() => {
  // --- A. ALL VARIABLES AND STATE ARE DECLARED HERE ---
  let scene, renderer, camera, floor, orbitControls;
  let group, followGroup, model, skeleton, mixer, clock;
  let actions = {};
  let panel;
  const PI90 = Math.PI / 2;
  let isFalling = false;
  let fallTimer = 0;
  const controls = {
    key: [0, 0, 0],
    ease: new THREE.Vector3(),
    position: new THREE.Vector3(),
    up: new THREE.Vector3(0, 1, 0),
    rotate: new THREE.Quaternion(),
    current: 'Idle',
    fadeDuration: 0.5,
    runVelocity: 5,
    walkVelocity: 20,
    rotateSpeed: 0.1,
    floorDecale: 0,
  };

  // --- B. ALL HELPER FUNCTIONS ARE DEFINED HERE ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const clickableObjects = [];

  const sceneryData = [
    {
      path: '/models/gltf/one_tree.glb',
      scale: 1,
      positions: [
        { x: -20, y: 0, z: -30 },
        { x: 30, y: 0, z: -40 },
        { x: -35, y: 0, z: 20 },
        { x: -75, y: 0, z: 50 },
        { x: -95, y: 0, z: 20 },
        { x: 95, y: 0, z: 20 },
      ]
    },
    {
      path: '/models/gltf/rocks.glb',
      scale: 1,
      positions: [
        { x: 15, y: 0, z: 25 },
        { x: -10, y: 0, z: 40 },
        { x: -100, y: 0, z: 40 },
        { x: 50, y: 0, z: 40 },
      ]
    },
    {
      path: '/models/gltf/sign.glb',
      scale: 2,
      link: '/about',
      positions: [
        { x: 40, y: 0, z: 10 },
      ]
    },
    {
      path: '/models/gltf/mountain.glb',
      scale: 0.1,
      positions: [
        { x: 10, y: -10, z: 10 },
      ]
    },
    {
        type:'image',
        path:'projects.png',
        link:'/projects',
        scale:2,
        color: '#FFD700',
        positions: [
            { x: 40, y: 4, z: 10.3 },
        ]
    }
  ];
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
    const intersects = raycaster.intersectObjects(clickableObjects, true); // `true` checks descendants
    if (intersects.length > 0) {
      let clickedObject = intersects[0].object;
      while (clickedObject && !clickedObject.userData.link) {
        clickedObject = clickedObject.parent;
      }
      
      if (clickedObject && clickedObject.userData.link) {
        console.log(`Navigating to: ${clickedObject.userData.link}`);
        window.location.href = clickedObject.userData.link;
      }
    }
  }

  function createSnowyGround() {
    const groundSize = 500; // How big the terrain is
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
    const textureLoader = new THREE.TextureLoader();
    const displacementMap = textureLoader.load('/textures/heatmap.avif');
    displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;
    const snowColorMap = textureLoader.load('/textures/floors/FloorsCheckerboard_S_Diffuse.jpg');
    snowColorMap.wrapS = snowColorMap.wrapT = THREE.RepeatWrapping;
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map:snowColorMap,
      displacementMap: displacementMap,
      displacementScale:0,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    floor = ground; // Assign to the scoped 'floor' variable
    scene.add(ground);
  }

  function loadModel() {
    const loader = new GLTFLoader();
    loader.load('/models/gltf/snowboarder.glb', function (gltf) {
      model = gltf.scene;
      model.scale.set(100, 100, 100);
      group.add(model);
      model.rotation.y = 270;
      group.rotation.y = PI90;

      model.traverse(function (object) {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      
      skeleton = new THREE.SkeletonHelper(model);
      skeleton.visible = false;
      scene.add(skeleton);

      const animations = gltf.animations;
      mixer = new THREE.AnimationMixer(model);
      actions = {
        Idle: mixer.clipAction(animations[2]),
        Slide: mixer.clipAction(animations[4]),
        Waving: mixer.clipAction(animations[3]),
        Left: mixer.clipAction(animations[6]),
        Right: mixer.clipAction(animations[7]),
        Backflip: mixer.clipAction(animations[8])
      };
      
      for (const name in actions) {
        if (actions[name]) {
          actions[name].setEffectiveWeight(0);
          actions[name].play();
        }
      }
      if (actions.Idle) {
        actions.Idle.setEffectiveWeight(1);
      }
      controls.current = 'Idle';
    });
  }
    function getAnimationState(keyState) {
        if (keyState[0] === -1) return 'Slide';
        if(keyState[0] === 1) return 'Slide';
        if (keyState[1] === -1) return 'Left';
        if (keyState[1] === 1) return 'Right';
        return 'Idle';
    }

    function unwrapRad(r) { return Math.atan2(Math.sin(r), Math.cos(r)); }
    function updateCharacter(delta) {
        if (!orbitControls || !actions.Idle || !floor) {
        if (mixer) mixer.update(delta);
        if (orbitControls) orbitControls.update();
        return;
        }

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
        }
        if (mixer) mixer.update(delta);
        orbitControls.update();
        return;
        }
        
        const fade = controls.fadeDuration;
        const key = controls.key;
        const position = controls.position;
        const azimuth = orbitControls.getAzimuthalAngle();

        const play = getAnimationState(key);

        if (controls.current !== play) {
        const currentAction = actions[play];
        const oldAction = actions[controls.current];
        controls.current = play;

        if (currentAction && oldAction) {
            oldAction.fadeOut(fade);
            currentAction.reset().setEffectiveWeight(1).fadeIn(fade).play();
        }
        }

        if (play !== 'Idle') {
        const velocity = controls.walkVelocity;
        const ease = controls.ease.set(key[1], 0, key[0]).normalize().multiplyScalar(velocity * delta);
        const angle = unwrapRad(Math.atan2(ease.x, ease.z) + azimuth);
        const rotate = controls.rotate.setFromAxisAngle(controls.up, angle);

        snowBoarderBB.setFromObject(group);

        let hasCollision = false;
        for (let i = 0; i < obstacles.length; i++) {
        if (snowBoarderBB.intersectsBox(obstacles[i])) {
            hasCollision = true;
            break;
            }
        }

        const newPosition = position.clone().add(ease.clone().applyAxisAngle(controls.up, azimuth));
        group.position.copy(newPosition);
        group.quaternion.rotateTowards(rotate, controls.rotateSpeed);
        snowBoarderBB.setFromObject(group);

        for (let i = 0; i < obstacles.length; i++) {
        if (snowBoarderBB.intersectsBox(obstacles[i])) {
            hasCollision = true;
            break;
        }
        }

        if (!hasCollision) {
            if(isFalling) return;
        position.copy(newPosition); // Only update position if no collision

        // Maintain a fixed offset behind and above the snowboarder
        const cameraOffset = new THREE.Vector3(0, 20, 35); // Y = up, Z = back
        const offsetRotated = cameraOffset.clone().applyAxisAngle(controls.up, azimuth); // rotate with character
        camera.position.copy(position.clone().add(offsetRotated));

        orbitControls.target.copy(position).add(new THREE.Vector3(0, 1, 0));
        followGroup.position.copy(position);

        const dx = (position.x - floor.position.x);
        const dz = (position.z - floor.position.z);
        if (Math.abs(dx) > controls.floorDecale) floor.position.x += dx;
        if (Math.abs(dz) > controls.floorDecale) floor.position.z += dz;
        }
        else {
        group.position.copy(position); // Revert group position
        if(!isFalling) {
            isFalling = true;
            fallTimer = 1.2;
            const fallAction = actions.Backflip;
            const oldAction = actions[controls.current];
            controls.current = 'Backflip';

            if(fallAction && oldAction){
                oldAction.fadeOut(0.3);
                fallAction.reset().setEffectiveWeight(1).fadeIn(0.3).play();
            }
            group.position.y -= 1;
        }
        }

// 
        const dx = (position.x - floor.position.x);
        const dz = (position.z - floor.position.z);
        if (Math.abs(dx) > controls.floorDecale) floor.position.x += dx;
        if (Math.abs(dz) > controls.floorDecale) floor.position.z += dz;
        }
        if (mixer) mixer.update(delta);
        orbitControls.update();
    }



    function onKeyDown(event) {
        const key = controls.key;
        switch (event.code) {
        case 'ArrowUp': case 'KeyW': key[0] = -1; break;
        case 'ArrowDown': case 'KeyS': key[0] = 1; break;
        case 'ArrowLeft': case 'KeyA': key[1] = -1; break;
        case 'ArrowRight': case 'KeyD': key[1] = 1; break;
        case 'ShiftLeft': case 'ShiftRight': key[2] = 1; break;
        }
    }

    function onKeyUp(event) {
        const key = controls.key;
        switch (event.code) {
        case 'ArrowUp': case 'KeyW': key[0] = 0; break;
        case 'ArrowDown': case 'KeyS': key[0] = 0; break;
        case 'ArrowLeft': case 'KeyA': key[1] = 0; break;
        case 'ArrowRight': case 'KeyD': key[1] = 0; break;
        case 'ShiftLeft': case 'ShiftRight': key[2] = 0; break;
        }
    }

    function onWindowResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        if(!renderer || !scene || !camera) return;
        const delta = clock.getDelta();
        updateCharacter(delta);
        
        renderer.render(scene, camera);
    }

  // --- C. INITIALIZATION ---
  const container = sceneContainer.value;
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 20, 35);
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0c0d0);
  scene.fog = new THREE.Fog(0xa0c0d0, 20, 100);
  group = new THREE.Group();
  scene.add(group);
  followGroup = new THREE.Group();
  scene.add(followGroup);
  
  const dirLight = new THREE.DirectionalLight(0xffffff, 5);
  dirLight.position.set(-5, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 10;
  dirLight.shadow.camera.bottom = -10;
  dirLight.shadow.camera.left = -10;
  dirLight.shadow.camera.right = 10;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  scene.add(dirLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

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
  
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  
  new RGBELoader()
    .setPath('/textures/equirectangular/')
    .load('lobe.hdr', function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.8;
      loadModel();
      loadScenery();
      createSnowyGround();
    });

  // --- D. CLEANUP ---
  onUnmounted(() => {
    console.log("Cleaning up Three.js scene and listeners...");
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    if (renderer && renderer.domElement) {
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    }
    if (panel) panel.destroy();
    if (renderer) {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      if (renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    }
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
    top:0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}
.scene-container {
  width: 100%;
  height: 100%;
}
#info {
  position: absolute;
  top: 10px;
  width: 100%;
  text-align: center;
  z-index: 100;
  display: block;
  color: white;
  font-family: monospace;
}
#info a {
  color: #ff5555;
  font-weight: bold;
}
</style>