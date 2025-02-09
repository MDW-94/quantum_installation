import * as THREE from "three";

// Setup
const width = window.innerWidth,
  height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 500);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Sphere 1
const sphere = new THREE.SphereGeometry(4, 30, 30);
const greyBlue = new THREE.MeshLambertMaterial({ color: 0x4b99e9 });

const mesh = new THREE.Mesh(sphere, greyBlue);

// Sphere 2
const sphere2 = new THREE.SphereGeometry(4, 30, 30, 0.7);
const red = new THREE.MeshLambertMaterial({ color: 0xd74776 });

const mesh2 = new THREE.Mesh(sphere2, red);

// Line
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xe82b6d });

const points = [];
for (let i = 0; i < 30; i += 10) {
  points.push(new THREE.Vector3(-20 + i, i * 0.5, i * 0));
}

const geometry2 = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry2, lineMaterial);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

scene.add(mesh, mesh2, directionalLight);

renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 25);
camera.lookAt(0, 0, 0);

mesh.position.x = 10;
mesh2.position.x = -10;

function animate(time) {
  //   mesh.rotation.x = time / 5000;
  //   mesh.rotation.y = time / 10000;

  mesh.position.x = Math.sin(time / 500) * 3 + 10;
  mesh2.position.x = Math.sin(time / 500) * 3 - 10;
  //   mesh2.position.x = Math.sin(-(time / 500)) * 3 - 10;
  //   Math.asin()??

  //   line.rotation.x = time / 2000;

  //   console.log(time);
  //   directionalLight.position.setX((time / 500) % 10);
  directionalLight.position.setX(Math.sin(time / 500));

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
