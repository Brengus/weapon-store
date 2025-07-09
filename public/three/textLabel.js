// utils/three/textLabel.js
import * as THREE from 'three';

/**
 * Creates a text label using a canvas and adds it to the scene.
 * @param {string} text - The text to display.
 * @param {THREE.Vector3} position - Position of the label in the scene.
 * @param {THREE.Scene} scene - The Three.js scene to add the label to.
 * @param {Object} [options] - Optional styling.
 * @param {string} [options.color='#ffffff'] - Text color.
 * @param {number} [options.fontSize=64] - Font size.
 * @param {string} [options.font='bold 64px sans-serif'] - CSS font string.
 * @param {number} [options.scale=1] - Scale multiplier for sprite size.
 */

export function createGroundTextLabel(text, position, scene, options = {}) {
  const {
    font = '48px Arial',
    color = '#000000',
    backgroundColor = 'transparent',
    maxWidth = 1100,
    padding = 20,
    skewX = 0, // degrees
    skewY = 0,
    rotation = { x: -Math.PI / 2, y: 0, z: 0 }, // default: laying flat on ground
    scale = 1,
  } = options;

  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  ctx.font = font;

  // Word wrap
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (let word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const lineHeight = parseInt(font, 10) + 10;
  canvas.width = maxWidth + padding * 2;
  canvas.height = lineHeight * lines.length + padding * 2;

  // Redraw with new size
  const context = canvas.getContext('2d');
  context.font = font;
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.textBaseline = 'top';

  // Apply skew transform (shear)
  const skewXRad = (skewX * Math.PI);
  const skewYRad = (skewY * Math.PI) / 180;
  context.setTransform(1, Math.tan(skewYRad), Math.tan(skewXRad), 1, 0, 0);

  lines.forEach((line, i) => {
    context.fillText(line, padding, padding + i * lineHeight);
  });

  // Texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  texture.encoding = THREE.sRGBEncoding;

  // Plane mesh (flat)
  const geometry = new THREE.PlaneGeometry(canvas.width * 0.01 * scale, canvas.height * 0.01 * scale);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.copy(position);
  mesh.rotation.set(rotation.x, 0, rotation.z); // orient on ground
  mesh.renderOrder = 1; // Make sure it renders above the ground

  scene.add(mesh);
  return mesh;
}
