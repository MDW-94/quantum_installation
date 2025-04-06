import { createSphere } from "./components/sphere";
import { createLine } from "./components/line";
import * as THREE from "three";
import { deltaTime } from "three/tsl";

// Setup -----------
const width = window.innerWidth,
  height = window.innerHeight,
  depth = 500;
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 500);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Sphere 1 --------
const greySphere = createSphere("blue", 30, 4);

// Sphere 2 ---------
const redSphere = createSphere("red", 30, 4);

// Line -----------
const line = createLine("0.5");
const line2 = createLine("1.5");
const line3 = createLine("2.5");

// ----------
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 5, 10);

// Add texture to the scene
// const loader = new THREE.TextureLoader();
// const texture = loader.load("../texture2.jpg", () => {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
// });

// scene.environment = texture;
// scene.background = texture;

// Shader background?
const bggeom = new THREE.PlaneGeometry(2, 2);
const bgmat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: `
    void main(){
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    void main(){
      vec2 uv = gl_FragCoord.xy / vec2(200.0, 10000.0);
      float gradient = 0.02 + 0.9 * sin(uTime + uv.y * 10.0);
      gl_FragColor = vec4(vec3(gradient, uv.y, 1.0 - uv.y), 1.0);
    }
  `,
  depthWrite: false,
});

const bgScene = new THREE.Scene();
const meshx = new THREE.Mesh(bggeom, bgmat);
const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

bgScene.add(meshx);

// Original Scene:
scene.add(
  greySphere.sphere,
  redSphere.sphere,
  line.line,
  line2.line,
  line3.line,
  directionalLight
);

renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 75);
camera.lookAt(0, 0, 0);

// Variables:
const linePos = line.line.geometry.attributes.position;
const linePos2 = line2.line.geometry.attributes.position;
const linePos3 = line3.line.geometry.attributes.position;
const lineNodes = linePos.array;
const lineNodes2 = linePos2.array;
const lineNodes3 = linePos3.array;
const sphere1XYZ = {
  x: 0,
  y: 0,
  z: 0,
};

const sphere2XYZ = {
  x: 0,
  y: 0,
  z: 0,
};

function oscillate(time, range) {
  return Math.sin(time * Math.PI * 0.5) * (range / 2);
}

function oscillate2(time, range) {
  return Math.cos(time * Math.PI * 0.5) * (range / 2);
}

let r = Math.PI * 2;

const clock = new THREE.Clock();

function animate(time) {
  // BG
  bgmat.uniforms.uTime.value += 0.01;

  // Sphere1 XYZ:
  sphere1XYZ.x = oscillate((time * 0.79) / 2750, width / 17.4);
  sphere1XYZ.y = oscillate((time * 1) / 2750, height / 17.5);
  sphere1XYZ.z = oscillate((time * 1.19) / 2750, depth / 12.5);

  // Sphere2 XYZ:
  sphere2XYZ.x = oscillate2((time * 0.8) / 2749, width / 17.5) * -1;
  sphere2XYZ.y = oscillate2((time * 0.9) / 2751, height / 16) * -1;
  sphere2XYZ.z = oscillate2((time * 1.09) / 2751, depth / 12.4) * -1;

  for (let i = 0; i < lineNodes.length; i += 3) {
    let t = i / lineNodes.length; // Normalized position (0 to 1)

    lineNodes[i] = THREE.MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes[i + 1] = THREE.MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes[i + 2] = THREE.MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);

    lineNodes2[i] = THREE.MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes2[i + 1] = THREE.MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes2[i + 2] = THREE.MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);

    lineNodes3[i] = THREE.MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
    lineNodes3[i + 1] = THREE.MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
    lineNodes3[i + 2] = THREE.MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);
  }

  linePos.needsUpdate = true; // important for line geom to appear in motion

  linePos2.needsUpdate = true;
  linePos3.needsUpdate = true;

  // Sphere 1: Grey Sphere: set to beginning of curve
  greySphere.sphere.position.set(sphere2XYZ.x, sphere2XYZ.y, sphere2XYZ.z);

  // Sphere 2: Red Sphere: set to end point of curve
  redSphere.sphere.position.set(sphere1XYZ.x, sphere1XYZ.y, sphere1XYZ.z);

  greySphere.sphere.rotation.x = time / 2000;
  redSphere.sphere.rotation.x = time / 2001;
  greySphere.sphere.rotation.y = time / 2999;
  redSphere.sphere.rotation.y = time / 1999;
  greySphere.sphere.rotation.z = time / 1998;
  redSphere.sphere.rotation.z = time / 2999;

  const delta = clock.getDelta();

  greySphere.uniforms.u_time.value += delta;

  redSphere.uniforms.u_time.value += delta;

  line.uniform.u_time.value += delta;
  line2.uniform.u_time.value += delta;
  line3.uniform.u_time.value += delta;

  directionalLight.position.set(Math.cos(r) * 10, 2, Math.sin(r) * 10);

  const index = 1;

  let orbitRadius = width / 1000;

  let angle = time / 1000;

  camera.position.setY(Math.sin(time / 20000) * 10);
  camera.position.setX(Math.sin(time / 20000) * 10);

  renderer.autoClear = false;
  renderer.clear();
  renderer.render(bgScene, bgCam);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
