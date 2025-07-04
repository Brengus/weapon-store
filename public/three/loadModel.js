// /three/loadModel.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModel({
  scene,
  group,
  actionsRef,
  controls,
  setSkeleton,
  setMixer
}) {
  const loader = new GLTFLoader();

  loader.load('/models/gltf/snowboarder.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(100, 100, 100);
    group.add(model);

    model.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    const skeleton = new THREE.SkeletonHelper(model);
    skeleton.visible = false;
    scene.add(skeleton);
    setSkeleton(skeleton);

    const mixer = new THREE.AnimationMixer(model);
    setMixer(mixer);

    const animations = gltf.animations;
    const actions = {
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
    actionsRef.value = actions;
  });
}