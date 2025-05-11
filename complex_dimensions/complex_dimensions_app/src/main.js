import { DirectionalLight, Clock } from "three";
import { Camera, Renderer, myScene } from "./utils/config";
import { Width, Height } from "./utils/global";
import { createSphere } from "./components/objects/sphereObject";
import { sphere1XYZ } from "../../../two_particles/two_particles/components";
console.log("Script running...");

// ---- Mesh/Objs:
const spheres = [];
for (let i = 0; i < 500; i++) {
  spheres[i] = createSphere();
}

// ---- Light:
const directionalLight = new DirectionalLight(0xffffff, 1);

// ---- Config:
Renderer.setSize(Width, Height);
Camera.position.set(0, 0, 200);
Camera.lookAt(0, 0, 0);
myScene.add(directionalLight);
document.body.appendChild(Renderer.domElement);

spheres.forEach((item) => {
  myScene.add(item.mesh);
});

const clock = new Clock();

// let sphereCounters = [];
let renderStartPos = -150;
let renderEndPos = 300;
const sphereCounters = [];
const initialPositon = [];
for (let i = 0; i < spheres.length; i++) {
  sphereCounters.push(
    renderStartPos - (i * (renderEndPos - renderStartPos)) / 64
  );
  initialPositon.push(
    renderStartPos - (i * (renderEndPos - renderStartPos)) / 64
  );
}

// ---- Animiate:
function animate(time) {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  spheres.forEach((item, index) => {
    item.material.color.setRGB(
      Math.abs(Math.sin(elapsed * 0.125)),
      Math.abs(Math.sin(elapsed * 0.25)),
      Math.abs(Math.sin(elapsed * 0.5))
    );
    item.material.color.setHSL((elapsed * 0.1) % 1, 1.0, 0.5);
    if (sphereCounters[index] < renderEndPos) {
      sphereCounters[index] += delta * 20;
      item.mesh.position.set(
        sphereCounters[index],
        Math.sin(sphereCounters[index] * 0.1) *
          (60 * Math.sin(Math.sin(0.8) * Math.sin(0.5))),
        // Math.sin(sphereCounters[index] * 0.1) * 30,
        Math.cos(sphereCounters[index] * 0.1) * 40
      );
    } else {
      sphereCounters[index] = initialPositon[index];
    }

    // item.mesh.material.uniforms.iTime.value = elapsed;
  });

  // directionalLight.position.setX(5 * Math.sin((elapsed * 2) / 3));
  // directionalLight.position.setZ(8 * Math.cos((elapsed * 8) / 12));
  // directionalLight.position.setY(8 * Math.cos((elapsed * 8) / 6));

  directionalLight.position.setZ(20);
  directionalLight.position.setX(30);

  Renderer.render(myScene, Camera);
}

Renderer.setAnimationLoop(animate);

// Object pooling/ object recycling
