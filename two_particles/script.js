import * as THREE from "three";
console.log("Script running...");
// https://threejs.org/docs/#manual/en/introduction/Drawing-lines

const width = window.innerWidth,
  height = window.innerHeight;
// capture height and width of the window

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 500);
// PerspectiveCamera(

// field of view (FOV) - value: degrees | extent of the scene that is seen on the display,

// aspect ratio - always set the same, width/height or you'll get a squished image,

// near and far clipping pane - objects further or closer than near or far wont be rendered - mainly to due with performance and what is rendered

//)

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(width, height);

// append html with renderer:
document.body.appendChild(renderer.domElement);
//WebGlRenderer(

// needs to create instance of and set size

// good idea to use the width and height of the area we want to fill with our app

//)

const geometry = new THREE.BoxGeometry(4, 4, 4);
// To create a cube we need a box geometry
// Contains all the points(vertices) and fill(faces) of the cube

const sphere = new THREE.SphereGeometry(4, 30, 30);

const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const greyBlue = new THREE.MeshLambertMaterial({ color: 0x4b99e9 });
// Colours the geometry
// Supports hex colours

const mesh = new THREE.Mesh(sphere, greyBlue);
// A mesh is an obect that takes a geomtry,
// and applies a material to it, which we then
// can insert to our scene, and move freely around

// scene.add(mesh);
// by default, when we all scene.add()
// the thing will be added to the coordinates (0,0,0)
// this would cause both the camera and the cube to be inside each other. To avoid this, we simply move the camera out a bit:

// camera.position.z = 1;
// This is the same as:
// camera.position.set(0, 0, 1);

camera.position.set(0, 0, 25);

// ??
camera.lookAt(0, 0, 0);

// ADDING LINES

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xe82b6d });

const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, -10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry2 = new THREE.BufferGeometry().setFromPoints(points);

// Note that lines are drawn between each consecutive pair of vertices, but not between he first and last (the line is not closed)

// Now that we have points for two lines and a material, we can put them together to form a line:

const line = new THREE.Line(geometry2, lineMaterial);

// const light = new THREE.AmbientLight(0x404040); // soft white light - cannot be used to cast shadows as it has no direction

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

scene.add(line, mesh, directionalLight);

//

function animate(time) {
  mesh.rotation.x = time / 5000;
  mesh.rotation.y = time / 10000;

  line.rotation.x = time / 2000;

  directionalLight.position.setY(time / 0.5);

  renderer.render(scene, camera);
}
// In order to see something we need to create what's called a render or animation loop

// This will create a loop that causes the renderer to draw the scene every time the screen is refreshed (typical screen: 60 times per second)

// anything you want to more or change while the app is running has to go through the animation loop

renderer.setAnimationLoop(animate);
