import { DirectionalLight } from "three";
import { Camera, Renderer, myScene } from "./utils/config";
import { Width, Height } from "./utils/global";
import { createSphere } from "./components/objects/sphereObject";
console.log("Script running...");

// ---- Mesh/Objs:
const sphere1 = createSphere();

// ---- Light:
const directionalLight = new DirectionalLight(0xffffff, 1);

// ---- Config:
Renderer.setSize(Width, Height);
Camera.position.set(0, 0, 30);
Camera.lookAt(0, 0, 0);
myScene.add(sphere1.mesh, directionalLight);
document.body.appendChild(Renderer.domElement);

// ---- Animiate:
function animate(time) {
  sphere1.mesh.position.set(
    Math.sin((time * 0.1) / 50),
    Math.sin((time * 0.01) / 50),
    Math.sin((time * 0.12) / 50)
  );

  directionalLight.position.setX(Math.sin((time * 0.01) / 5));
  directionalLight.position.setZ(Math.sin((time * 0.01) / 5));

  Renderer.render(myScene, Camera);
}

Renderer.setAnimationLoop(animate);
