import { createSphere } from "./components/sphere";
import { createLine } from "./components/line";
import * as THREE from "three";

// Setup -----------
const width = window.innerWidth,
  height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 500);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Sphere 1 --------
const greySphere = createSphere(0x4b99e9);

// Sphere 2 ---------
const redSphere = createSphere(0xd74776);

// Line -----------
const line = createLine(0xf5f5f5);

// ----------
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

scene.add(greySphere, redSphere, line, directionalLight);

renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 75);
camera.lookAt(0, 0, 0);

let meshTrackX, meshTrackY, meshTrackZ;
let meshTrackX2, meshTrackY2, meshTrackZ2;

function animate(time) {
  // Vector Seed 1
  meshTrackX = Math.sin(time / 1000) * 25;
  meshTrackY = Math.sin(time / 1500) * 25;
  meshTrackZ = Math.sin(time / 2000) * 25;

  // Vector Seed 2
  meshTrackX2 = Math.sin(time / 1000) * -5 - 25;
  meshTrackY2 = Math.sin(time / 1500) * -25;
  meshTrackZ2 = Math.sin(time / 2000) * -25;

  const linePos = line.geometry.attributes.position;

  // line vertex 1: XYZ
  linePos.array[0] = meshTrackX;
  linePos.array[1] = meshTrackY;
  linePos.array[2] = meshTrackZ;

  // middle point
  linePos.array[3] = 0;
  linePos.array[4] = 0;
  linePos.array[5] = 0;

  // line vertex 2: XYZ
  linePos.array[6] = meshTrackX2;
  linePos.array[7] = meshTrackY2;
  linePos.array[8] = meshTrackZ2;

  linePos.needsUpdate = true; // important for line geom to appear in motion

  // Sphere 1: Grey Sphere
  greySphere.position.set(linePos.array[0], linePos.array[1], linePos.array[2]);

  greySphere.rotation.x = time / 5000;
  greySphere.rotation.y = time / 10000;

  // Sphere 2: Red Sphere
  redSphere.position.set(linePos.array[6], linePos.array[7], linePos.array[8]);

  // Light
  directionalLight.position.setX(Math.sin(time / 1500));

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
