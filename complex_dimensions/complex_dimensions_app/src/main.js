import * as THREE from "three";
console.log("Script running...");

const width = window.innerWidth,
  height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 500);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

const box = new THREE.BoxGeometry(4, 4, 4);

const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const mesh = new THREE.Mesh(box, greenMaterial);

camera.position.set(0, 0, 25);

camera.lookAt(0, 0, 0);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

scene.add(mesh, directionalLight);

function animate(time) {
  mesh.rotation.x = time / 5000;
  mesh.rotation.y = time / 10000;

  directionalLight.position.setY(time / 0.5);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
