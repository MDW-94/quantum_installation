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

function oscillate(time, range) {
  return Math.sin(time * Math.PI * 0.5) * (range / 2);
}

function animate(time) {
  // Sphere1 XYZ:
  sphere1XYZ.x = oscillate((time * 0.79) / 2750, width / 15);
  sphere1XYZ.y = oscillate((time * 1) / 2750, height / 17.5);
  sphere1XYZ.z = oscillate((time * 1.19) / 2750, depth / 12.5);

  // Sphere2 XYZ:
  sphere2XYZ.x = oscillate((time * 1.39) / 2750, width / 17.5) * -1;
  sphere2XYZ.y = oscillate((time * 0.8) / 2750, height / 15) * -1;
  sphere2XYZ.z = oscillate((time * 0.99) / 2750, depth / 12.5) * -1;

  for (let i = 0; i < lineNodes.length; i++) {
    // First point:
    if (i < 3) {
      switch (i % 3) {
        case 0:
          lineNodes[i] = sphere1XYZ.x;
          break;
        case 1:
          lineNodes[i] = sphere1XYZ.y;
          break;
        case 2:
          lineNodes[i] = sphere1XYZ.z;
          break;
      }
    }

    if (i > 3 && i < lineNodes.length - 4) {
      switch (i % 3) {
        case 0:
          lineNodes[i] = oscillate(
            time * 0.009,
            oscillate(time * 0.0005, sphere1XYZ.x + sphere2XYZ.x)
          );
          break;
        case 1:
          lineNodes[i] = oscillate(
            time * 0.009,
            oscillate(time * 0.0009, sphere1XYZ.y + sphere2XYZ.y)
          );
          break;
        case 2:
          lineNodes[i] = oscillate(
            time * 0.009,
            oscillate(time * 0.0005, sphere1XYZ.z + sphere2XYZ.z)
          );
          break;
      }
    }

    // End point:
    if (i > lineNodes.length - 4) {
      switch (i % 3) {
        case 0:
          lineNodes[i] = sphere2XYZ.x;
          break;
        case 1:
          lineNodes[i] = sphere2XYZ.y;
          break;
        case 2:
          lineNodes[i] = sphere2XYZ.z;
          break;
      }
    }
  }

  linePos.needsUpdate = true; // important for line geom to appear in motion

  // Sphere 1: Grey Sphere: set to beginning of curve
  greySphere.position.set(sphere2XYZ.x, sphere2XYZ.y, sphere2XYZ.z);

  // greySphere.rotation.x = time / 5000;
  // greySphere.rotation.y = time / 10000;

  // Sphere 2: Red Sphere: set to end point of curve
  redSphere.position.set(sphere1XYZ.x, sphere1XYZ.y, sphere1XYZ.z);

  // redSphere.rotation.x = time / 5000;
  // redSphere.rotation.y = time / 10000;

  // Light
  // directionalLight.position.setX(Math.sin(time / 1500));
  // directionalLight.position.setY(Math.sin((time / 1000)));

  // camera.position.setY(Math.sin(time / 20000) * 10);
  // camera.position.setX(Math.sin(time / 20000) * 10);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
