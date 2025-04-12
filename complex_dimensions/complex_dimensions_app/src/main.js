import * as THREE from "three";
console.log("Script running...");
import { Camera, Renderer, Scene } from "./utils/config";
import { Width, Height } from "./utils/global";

// ---- Mesh/Objs:
const box = new THREE.BoxGeometry(4, 4, 4);
const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(box, greenMaterial);

// ---- Light:
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

// ---- Config:
Renderer.setSize(Width, Height);
Camera.position.set(0, 0, 25);
Camera.lookAt(0, 0, 0);
Scene.add(mesh, directionalLight);
document.body.appendChild(Renderer.domElement);

// ---- Animiate:
function animate(time) {
  mesh.rotation.x = time / 5000;
  mesh.rotation.y = time / 10000;

  directionalLight.position.setY(time / 0.5);

  Renderer.render(Scene, Camera);
}

Renderer.setAnimationLoop(animate);
