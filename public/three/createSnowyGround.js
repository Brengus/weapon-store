// /three/createSnowyGround.js
import * as THREE from 'three';

export function createSnowyGround(scena) {
  const groundGeometry = new THREE.PlaneGeometry(500, 500, 256, 256);
  const textureLoader = new THREE.TextureLoader();

  const snowColor = textureLoader.load('/textures/snow/snow_albedo.jpg');
  const snowNormal = textureLoader.load('/textures/snow/snow_normal.jpg');
  const snowRoughness = textureLoader.load('/textures/snow/snow_roughness.jpg');
  const snowHeight = textureLoader.load('/textures/snow/snow_height.jpg');

  [snowColor, snowNormal, snowRoughness, snowHeight].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 20);
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

  scena.add(ground);
  return ground;
}
