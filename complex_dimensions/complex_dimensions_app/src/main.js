import { DirectionalLight, Clock, AmbientLight } from "three";
import { Camera, Renderer, myScene } from "./utils/config";
import { Width, Height, Canvas } from "./utils/global";
import { createSphere } from "./components/objects/sphereObject";

// ---- Mesh/Objs:
const spheres = [];
for (let i = 0; i < 750; i++) {
  spheres[i] = createSphere();
}

// ---- Light:
// const directionalLight = new DirectionalLight(0xffffff, 3);
const directionalLight = new DirectionalLight(0xcc5500, 2);
const ambientLight = new AmbientLight(0xffffff, 0.2);

// ---- Config:
Renderer.setSize(Width, Height);
Camera.position.set(0, 0, 300);
Camera.lookAt(20, 0, 0);
myScene.add(directionalLight, ambientLight);
document.body.appendChild(Renderer.domElement);

spheres.forEach((item) => {
  myScene.add(item.mesh);
});

const clock = new Clock();

// let sphereCounters = [];
let renderStartPos = -200;
let renderEndPos = 250;
const sphereCounters = [];
const initialPositon = [];
for (let i = 0; i < spheres.length; i++) {
  sphereCounters.push(
    renderStartPos - (i * (renderEndPos - renderStartPos)) / 144
  );
  initialPositon.push(
    renderStartPos - (i * (renderEndPos - renderStartPos)) / 144
  );
}

window.addEventListener("resize", () => {
  let width = window.innerWidth;
  let height = window.innerHeight;

  Camera.aspect = width / height;
  Camera.updateProjectionMatrix();

  Renderer.setSize(width, height);
  Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    Canvas.requestFullscreen();
    console.log("Fullscreen open");
  } else {
    document.exitFullscreen();
    console.log("Fullscreen closed");
  }
});

// ---- Animiate:
function animate(time) {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  spheres.forEach((item, index) => {
    item.material.color.setRGB(
      Math.abs(Math.sin(elapsed * 0.5)),
      Math.abs(Math.sin(elapsed * 0.2)),
      Math.abs(Math.sin(elapsed * 0.2))
    );
    const yOffset = 60 + Math.cos(sphereCounters[index] * 0.02) * 160;
    item.material.color.setHSL((elapsed * 0.1) % 1, 0.8, 0.8);
    if (sphereCounters[index] < renderEndPos) {
      sphereCounters[index] += delta * 10;
      item.mesh.position.set(
        sphereCounters[index] * 1.959,
        Math.sin(sphereCounters[index] * 0.102) *
          (yOffset * Math.sin(Math.sin(2) * Math.sin(0.6))),
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

  const t = (Math.sin(elapsed * 0.6) + 1) / 2;

  const r = (1 - t) * 1.0 + t * (1.0 - 0.1 * Math.sin(elapsed * 0.9));
  const g = (1 - t) * 0.39 + t * (1.0 - 0.1 * Math.sin(elapsed * 0.5));
  const b = (1 - t) * 1.0 + t * (0.94 - 0.1 * Math.sin(elapsed * 0.2));

  // directionalLight.color.setRGB(
  //   (255 - Math.sin(elapsed * 0.4) * 30) / 255,
  //   (255 - Math.sin(elapsed * 0.4) * 150) / 255,
  //   (255 - Math.sin(elapsed * 0.4) * 200) / 255
  // );
  directionalLight.color.setRGB(r, g, b);
  directionalLight.position.setZ(25);
  directionalLight.position.setX(Math.sin(elapsed * 0.4) * 200);

  Renderer.render(myScene, Camera);
}

Renderer.setAnimationLoop(animate);

// Object pooling/ object recycling

// add fullscreen and screem resize
