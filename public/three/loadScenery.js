// /three/loadScenery.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadScenery(scene, clickableObjects, obstacles, sceneryData) {
  const loader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  sceneryData.forEach(item => {
    if (item.type === 'image') {
      textureLoader.load(item.path, (texture) => {
        const imageGeometry = new THREE.PlaneGeometry(1, 1);
        const imageMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });

        item.positions.forEach(pos => {
          const imagePlane = new THREE.Mesh(imageGeometry, imageMaterial);
          imagePlane.scale.set(item.scale, item.scale, 1);
          imagePlane.position.set(pos.x, pos.y, pos.z);

          if (item.link) {
            imagePlane.userData.link = item.link;
            clickableObjects.push(imagePlane);
          }

          scene.add(imagePlane);
        });
      });
    } else {
      loader.load(item.path, (gltf) => {
        const baseModel = gltf.scene;
        item.positions.forEach(pos => {
          const clone = baseModel.clone();
          clone.position.set(pos.x, pos.y, pos.z);
          clone.scale.set(item.scale, item.scale, item.scale);

          if (item.link) {
            clone.userData.link = item.link;
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
