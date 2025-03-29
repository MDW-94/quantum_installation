import { createSphere } from "./components/sphere";
import { createLine } from "./components/line";
import * as THREE from "three";

// Setup -----------
const width = window.innerWidth,
  height = window.innerHeight,
  depth = 500;
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 500);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Sphere 1 --------
const greySphere = createSphere(0x4b99e9, 30, 4);

// Sphere 2 ---------
const redSphere = createSphere(0xd74776, 30, 4);

// Sphere 3 ---------
const tinySphere = createSphere(0xd74776, 10, 2);

// Line -----------
const line = createLine(0xf5f5f5);

// ----------
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 5, 10);

scene.add(greySphere, redSphere, tinySphere, line, directionalLight);

renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 75);
camera.lookAt(0, 0, 0);

// Variables:
const linePos = line.geometry.attributes.position;
const lineNodes = linePos.array;
const sphere1XYZ = {
  x: 0,
  y: 0,
  z: 0,
};

const sphere2XYZ = {
  x: 0,
  y: 0,
  z: 0,
};

const tinySphereXYZ = {
  x: 0,
  y: 0,
  z: 0,
};

function oscillate(time, range) {
  return Math.sin(time * Math.PI * 0.5) * (range / 2);
}

function oscillate2(time, range) {
  return Math.cos(time * Math.PI * 0.5) * (range / 2);
}

function animate(time) {
  // Sphere1 XYZ:
  sphere1XYZ.x = oscillate((time * 0.79) / 2750, width / 17.4);
  sphere1XYZ.y = oscillate((time * 1) / 2750, height / 17.5);
  sphere1XYZ.z = oscillate((time * 1.19) / 2750, depth / 12.5);

  // Sphere2 XYZ:
  sphere2XYZ.x = oscillate2((time * 0.8) / 2749, width / 17.5) * -1;
  sphere2XYZ.y = oscillate2((time * 0.9) / 2751, height / 16) * -1;
  sphere2XYZ.z = oscillate2((time * 1.09) / 2751, depth / 12.4) * -1;

  for (let i = 0; i < lineNodes.length; i += 3) {
    let t = i / lineNodes.length; // Normalized position (0 to 1)

    lineNodes[i] = THREE.MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes[i + 1] = THREE.MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes[i + 2] = THREE.MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);
  }

  linePos.needsUpdate = true; // important for line geom to appear in motion

  // Sphere 1: Grey Sphere: set to beginning of curve
  greySphere.position.set(sphere2XYZ.x, sphere2XYZ.y, sphere2XYZ.z);

  // Sphere 2: Red Sphere: set to end point of curve
  redSphere.position.set(sphere1XYZ.x, sphere1XYZ.y, sphere1XYZ.z);

  const index = 1;

  let orbitRadius = width / 1000;

  let angle = time / 1000;

  tinySphere.position.set(
    lineNodes[index] + Math.sin(angle) * orbitRadius,
    lineNodes[index + 1] + Math.sin(angle) * orbitRadius,
    lineNodes[index + 2] + Math.sin(angle) * orbitRadius
  );

  // Light
  // directionalLight.position.setX(Math.sin(time / 1500));
  // directionalLight.position.setY(Math.sin((time / 1000)));

  // camera.position.setY(Math.sin(time / 20000) * 10);
  // camera.position.setX(Math.sin(time / 20000) * 10);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
