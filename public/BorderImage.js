// BorderedImage.js
import * as THREE from 'three';

export default class BorderedImage {
  constructor(textureUrl, width = 2, height = 2, borderColor = 0xff0000) {
    this.textureUrl = textureUrl;
    this.width = width;
    this.height = height;
    this.borderColor = borderColor;

    this.group = new THREE.Group();
    this.createPlanes();
  }

  createPlanes() {
    // Border plane (slightly larger)
    const borderGeometry = new THREE.PlaneGeometry(this.width * 1.05, this.height * 1.05);
    const borderMaterial = new THREE.MeshBasicMaterial({ color: this.borderColor });
    this.borderPlane = new THREE.Mesh(borderGeometry, borderMaterial);
    this.group.add(this.borderPlane);

    // Image plane
    const texture = new THREE.TextureLoader().load(this.textureUrl);
    const imageGeometry = new THREE.PlaneGeometry(this.width, this.height);
    const imageMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    this.imagePlane = new THREE.Mesh(imageGeometry, imageMaterial);
    this.group.add(this.imagePlane);
  }

  // Call this in your render loop if you want animation
  update() {
    const t = performance.now() * 0.002;
    this.borderPlane.scale.setScalar(1 + 0.02 * Math.sin(t)); // subtle pulsating effect
  }

  getObject3D() {
    return this.group;
  }
}
