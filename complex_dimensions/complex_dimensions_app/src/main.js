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
Camera.position.set(0, 0, 200);
Camera.lookAt(0, 0, 0);
myScene.add(directionalLight);
document.body.appendChild(Renderer.domElement);

spheres.forEach((item) => {
  myScene.add(item.mesh);
});

const clock = new Clock();

let sphereCounters = [];
let xCounter = -500,
  yCounter = 0,
  zCounter = 0;
let orbitRadius = 100;

// function orbit() {}

// ---- Animiate:
function animate(time) {
  const slowTime = clock.getDelta(); // delta = speed since last frame
  spheres.forEach((item, index) => {
    sphereCounters.push(slowTime - index * 17.5);
    // item.mesh.position.set(
    //   Math.sin((time * 0.1) / 50) - index * 20,
    //   Math.sin((time * 0.01) / 50),
    //   Math.sin((time * 0.1) / 50) - index * 15
    // );

    if (sphereCounters[index] < 400) {
      // yCounter - index * 10,
      // zCounter - index * 10
      item.mesh.position.set((sphereCounters[index] += slowTime * 100), 0, 0);
    } else {
      sphereCounters[index] = -500;
      // yCounter = 0;
      // zCounter = 0;
    }

    item.mesh.material.uniforms.iTime.value = clock.getElapsedTime();
  });

  directionalLight.position.setX(Math.sin((time * 0.01) / 5));
  directionalLight.position.setZ(Math.sin((time * 0.01) / 5));

  Renderer.render(myScene, Camera);
}

Renderer.setAnimationLoop(animate);
