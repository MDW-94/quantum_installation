import { DirectionalLight, Clock } from "three";
import { Camera, Renderer, myScene } from "./utils/config";
import { Width, Height } from "./utils/global";
import { createSphere } from "./components/objects/sphereObject";
console.log("Script running...");

// ---- Mesh/Objs:
const spheres = [];
for (let i = 0; i < 100; i++) {
  spheres[i] = createSphere();
}
// const sphere1 = createSphere();

// ---- Light:
const directionalLight = new DirectionalLight(0xffffff, 1);

// ---- Config:
Renderer.setSize(Width, Height);
Camera.position.set(-200, 120, 120);
Camera.lookAt(0, 0, 0);
myScene.add(directionalLight);
document.body.appendChild(Renderer.domElement);

spheres.forEach((item) => {
  myScene.add(item.mesh);
});

const clock = new Clock();

let sphereCounters = [];
let xCounter = 0,
  yCounter = 0,
  zCounter = 0;
let orbitRadius = 100;

function orbit() {}

// ---- Animiate:
function animate(time) {
  spheres.forEach((item, index) => {
    // item.mesh.position.set(
    //   Math.sin((time * 0.1) / 50) - index * 20,
    //   Math.sin((time * 0.01) / 50),
    //   Math.sin((time * 0.1) / 50) - index * 15
    // );

    if (xCounter < 2000) {
      xCounter += time * 0.0001;
      yCounter += time * 0.0001;
      zCounter += time * 0.0001;
    } else {
      xCounter = 0;
      yCounter = 0;
      zCounter = 0;
    }

    item.mesh.position.set(
      xCounter - index * 10,
      yCounter - index * 10,
      zCounter - index * 10
    );

    item.mesh.material.uniforms.iTime.value = clock.getElapsedTime();
  });

  directionalLight.position.setX(Math.sin((time * 0.01) / 5));
  directionalLight.position.setZ(Math.sin((time * 0.01) / 5));

  Renderer.render(myScene, Camera);
}

Renderer.setAnimationLoop(animate);
