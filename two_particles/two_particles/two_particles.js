import { MathUtils } from "three";
import { perspectiveCamera } from "./config/camera/perspectiveCamera";
import { bgScene, newScene } from "./config/scene/scene";
import { renderer } from "./config/renderer";
import { bgCam } from "./components/background/bgCamera/bgCamera";
import { bgMat, bgMesh } from "./components/background/bgMesh/bgMesh";
import { directionalLight } from "./config/light/directionalLight";
import { Height, Width, R, newClock, Depth, Canvas } from "./config/global";
import {
  greySphere,
  redSphere,
  line,
  line2,
  line3,
  line4,
  line5,
  linePos,
  linePos2,
  linePos3,
  linePos4,
  linePos5,
  lineNodes,
  lineNodes2,
  lineNodes3,
  lineNodes4,
  lineNodes5,
  sphere1XYZ,
  sphere2XYZ,
} from "./components";
import * as Tone from "tone";

const socket2 = new WebSocket("ws://localhost:8085");

let gamepadIndex = null;
let controllerState = [
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
];

// const synthA = new Tone.FMSynth().toDestination();
// const synthB = new Tone.AMSynth().toDestination();
// const player = new Tone.Player("./audio/sample1.mp3").toDestination();
// const now = Tone.now();

// async function playSample1() {
//   await Tone.start();
//   player.start();
// }

window.addEventListener("gamepadconnected", (e) => {
  gamepadIndex = e.gamepad.index;
  console.log("Gamepad connected:", e.gamepad.id);
  requestAnimationFrame(readGamepad);
});

function readGamepad() {
  const gamepads = navigator.getGamepads();

  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i];
    if (!gp) continue;

    sphereNotControlled = false;
    controllerState[i].x = gp.axes[0];
    controllerState[i].y = gp.axes[1];
    controllerState[i].z = gp.axes[3];

    // console.log(gp.axes[3]);
    // if (Math.round(gp.axes[3]) > 0 || Math.round(gp.axes[3]) < 0) {
    //   console.log("trigger");
    //   // synthA.triggerAttackRelease("C2");
    //   playSample1();
    // } else {
    //   // synthA.triggerRelease();
    // }
    // Buttons
    gp.buttons.forEach((b, index) => {
      if (b.pressed) console.log(`Gamepad ${i} button ${index} pressed`);
    });
  }

  requestAnimationFrame(readGamepad);
}
// Adaption: two usb controllers, log data from them then update normXYZ objs to receive input based on controller input

socket2.onopen = () => {
  console.log("WebSocket connection established");
};

if (socket2.readyState === WebSocket.OPEN) {
  socket2.send("Hello, server!");
} else {
  console.warn("WebSocket is not open. ReadyState is:", socket2.readyState);
}

document.addEventListener("keydown", async function (event) {
  // await Tone.start();

  console.log("audio is ready");

  console.log(event);
  // moveObj = event;
  sphereNotControlled = false;
  switch (event.key) {
    case "a":
      console.log("1: move left");
      // samplerA.triggerAttack("C4", now);
      controllerState[0].x = -1;
      break;
    case "d":
      console.log("1: move right");
      controllerState[0].x = 1;
      break;
    case "w":
      console.log("1: move up");
      controllerState[0].y = 1;
      break;
    case "x":
      console.log("1: move down");
      controllerState[0].y = -1;
      break;
    case "q":
      console.log("1: move back");
      controllerState[0].z = -1;
      break;
    case "e":
      console.log("1: move forward");
      controllerState[0].z = 1;
      break;
    case "j":
      console.log("2:move left");
      controllerState[1].x = -1;
      break;
    case "l":
      console.log("2:move right");
      controllerState[1].x = 1;
      break;
    case "i":
      console.log("2:move up");
      controllerState[1].y = 1;
      break;
    case "m":
      console.log("2:move down");
      controllerState[1].y = -1;
      break;
    case "u":
      console.log("2:move back");
      controllerState[1].z = -1;
      break;
    case "o":
      console.log("2:move forward");
      controllerState[1].z = 1;
      break;
  }
  clearTimeout(timeoutId);
  resetTimeout();
  clearTimeout(timeoutId2);
  resetFlight();
});

document.addEventListener("keyup", function (event) {
  console.log("release key");
  controllerState[0].x = 0;
  controllerState[0].y = 0;
  controllerState[0].z = 0;
  controllerState[1].x = 0;
  controllerState[1].y = 0;
  controllerState[1].z = 0;
  // samplerA.triggerRelease("C4");
});

if (!socket2.onmessage || moveObj != null) {
  socket2.onmessage = function (event) {
    const json = JSON.parse(event.data);
    sphereNotControlled = false;
    // console.log(json);
    const { x: rawX, y: rawY, z: rawZ, a, b, c } = json;
    controllerState[0].x = Math.round(rawX, 0);
    controllerState[0].y = Math.round(rawY, 0);
    controllerState[0].z = Math.round(rawZ, 0);
    controllerState[1].x = Math.round(a, 0);
    controllerState[1].y = Math.round(b, 0);
    controllerState[1].z = Math.round(c, 0);

    clearTimeout(timeoutId);
    resetTimeout();
    clearTimeout(timeoutId2);
    resetFlight();
  };
}

socket2.onclose = () => {
  console.log("WebSocket connection closed");
};

// ----------
directionalLight.position.set(0, 5, 10);

bgScene.add(bgMesh);

// Original Scene:
newScene.add(
  greySphere.sphere,
  redSphere.sphere,
  line.line,
  line2.line,
  line3.line,
  line4.line,
  line5.line,
  directionalLight
);

renderer.setSize(Width, Height);
document.body.appendChild(renderer.domElement);
perspectiveCamera.position.set(0, 0, 100);
perspectiveCamera.lookAt(0, 0, 0);

function oscillate(time, range) {
  return Math.sin(time * Math.PI * 0.5) * (range / 2);
}

function oscillate2(time, range) {
  return Math.cos(time * Math.PI * 0.5) * (range / 2);
}

// Timeout variables
let timeoutId;
const timeoutDuration = 5000; // Timeout duration in milliseconds (e.g., 2 seconds)
let defaultPosition = {
  x: 0,
  y: 0,
  z: 0,
};

// // Function to reset the timeout
function resetTimeout() {
  timeoutId = setTimeout(() => {
    console.log("No joystick input detected, returning to 0,0,0.");
    sphere1XYZ.x = defaultPosition.x + Width / 50;
    sphere1XYZ.y = defaultPosition.y;
    sphere1XYZ.z = defaultPosition.z;
    sphere2XYZ.x = defaultPosition.x - Width / 50;
    sphere2XYZ.y = defaultPosition.y;
    sphere2XYZ.z = defaultPosition.z;
  }, timeoutDuration);
}

let timeoutId2;
const timeoutDuration2 = 10000;

const minPos = {
  x: -Width / 14,
  y: -Height / 14,
  z: -Depth + 100,
  dynamicX: 0,
};

const maxPos = {
  x: Width / 12.5,
  y: Height / 14,
  z: Depth / 7,
  dynamicX: 0,
};

sphere1XYZ.x += Width / 50;
sphere2XYZ.x -= Width / 50;

let sphereNotControlled = true;

function resetFlight() {
  timeoutId2 = setTimeout(() => {
    console.log("returning to default flight pattern.");
    sphereNotControlled = true;
  }, timeoutDuration2);
}

window.addEventListener("resize", () => {
  let width = window.innerWidth;
  let height = window.innerHeight;

  perspectiveCamera.aspect = width / height;
  perspectiveCamera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

function animate(time) {
  // BG
  bgMat.uniforms.uTime.value += 0.01;

  if (sphereNotControlled) {
    sphere1XYZ.x = oscillate((time * 0.79) / 2750, Width / 17.4);
    sphere1XYZ.y = oscillate((time * 1) / 2750, Height / 17.5);
    sphere1XYZ.z = oscillate((time * 1.19) / 2750, Depth / 12.5);

    // Sphere2 XYZ:
    sphere2XYZ.x = oscillate2((time * 0.8) / 2749, Width / 17.5) * -1;
    sphere2XYZ.y = oscillate2((time * 0.9) / 2751, Height / 16) * -1;
    sphere2XYZ.z = oscillate2((time * 1.09) / 2751, Depth / 12.4) * -1;
  } else {
    sphere1XYZ.z = MathUtils.clamp(
      sphere1XYZ.z + controllerState[0].z * 0.8,
      minPos.z,
      maxPos.z
    );

    sphere1XYZ.x += controllerState[0].x * 0.8;
    sphere1XYZ.y += controllerState[0].y * 0.8;

    sphere2XYZ.z = MathUtils.clamp(
      sphere2XYZ.z + controllerState[1].x * 0.8,
      minPos.z,
      maxPos.z
    );

    sphere2XYZ.x += controllerState[1].y * 0.8;
    sphere2XYZ.y += controllerState[1].z * 0.8;
  }

  for (let i = 0; i < lineNodes.length; i += 3) {
    let t = i / lineNodes.length; // Normalized position (0 to 1)

    lineNodes[i] = MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes[i + 1] = MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes[i + 2] = MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);

    lineNodes2[i] = MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes2[i + 1] = MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes2[i + 2] = MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);

    lineNodes3[i] = MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes3[i + 1] = MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes3[i + 2] = MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);

    lineNodes4[i] = MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes4[i + 1] = MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes4[i + 2] = MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);

    lineNodes5[i] = MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes5[i + 1] = MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes5[i + 2] = MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);
  }

  linePos.needsUpdate = true; // important for line geom to appear in motion
  linePos2.needsUpdate = true;
  linePos3.needsUpdate = true;
  linePos4.needsUpdate = true;
  linePos5.needsUpdate = true;

  // Sphere 1: Grey Sphere: set to beginning of line
  greySphere.sphere.position.set(sphere2XYZ.x, sphere2XYZ.y, sphere2XYZ.z);

  // Sphere 2: Red Sphere: set to end point of line
  redSphere.sphere.position.set(sphere1XYZ.x, sphere1XYZ.y, sphere1XYZ.z);

  greySphere.sphere.rotation.x = time / 2000;
  redSphere.sphere.rotation.x = time / 2001;
  greySphere.sphere.rotation.y = time / 2999;
  redSphere.sphere.rotation.y = time / 1999;
  greySphere.sphere.rotation.z = time / 1998;
  redSphere.sphere.rotation.z = time / 2999;

  const delta = newClock.getDelta();

  greySphere.uniforms.u_time.value += delta;

  redSphere.uniforms.u_time.value += delta;

  line.uniform.u_time.value += delta;
  line2.uniform.u_time.value += delta;
  line3.uniform.u_time.value += delta;
  line4.uniform.u_time.value += delta;
  line5.uniform.u_time.value += delta;

  directionalLight.position.set(Math.cos(R) * 10, 2, Math.sin(R) * 10);

  perspectiveCamera.position.setY(Math.sin(time / 20000) * 10);
  perspectiveCamera.position.setX(Math.sin(time / 20000) * 10);

  renderer.autoClear = false;
  renderer.clear();
  renderer.render(bgScene, bgCam);
  renderer.render(newScene, perspectiveCamera);
}

renderer.setAnimationLoop(animate);
