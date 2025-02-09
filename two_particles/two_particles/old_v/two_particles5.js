import * as THREE from "three";

// Setup -----------
const width = window.innerWidth,
  height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 500);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Sphere 1 ---------
const sphere = new THREE.SphereGeometry(4, 30, 30);
const greyBlue = new THREE.MeshLambertMaterial({ color: 0x4b99e9 });

const mesh = new THREE.Mesh(sphere, greyBlue);

// Sphere 2 ---------
const sphere2 = new THREE.SphereGeometry(4, 30, 30, 0.7);
const red = new THREE.MeshLambertMaterial({ color: 0xd74776 });

const mesh2 = new THREE.Mesh(sphere2, red);

// Line -----------
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf5f5f5 });

const points = [];
for (let i = 0; i < 30; i += 10) {
  points.push(new THREE.Vector3(-20 + i, i * 0.5, i * 0));
}

const geometry2 = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry2, lineMaterial);

// ----------
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

scene.add(mesh, mesh2, line, directionalLight);

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

  const linePos = geometry2.attributes.position;

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

  // Sphere 1
  mesh.position.set(linePos.array[0], linePos.array[1], linePos.array[2]);

  mesh.rotation.x = time / 5000;
  mesh.rotation.y = time / 10000;

  // Sphere 2
  mesh2.position.set(linePos.array[6], linePos.array[7], linePos.array[8]);

  // Light
  directionalLight.position.setX(Math.sin(time / 1500));

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
