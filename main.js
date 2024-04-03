import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setups
let widthSegment,
  heightSegment,
  waterHeight,
  terrainSharpness,
  stop2,
  soft,
  mountainHeight,
  autoGenerate,
  widthMap = 100,
  heightMap = 100,
  chunkSize = 3;

// Camera
let cameraY = 59.04;
let cameraX = -74.23;
let cameraZ = 72.13;

// Controller
import { Controller } from "./Controller.js";
// Controllers
const controllers = [
  new Controller("terrainSharpness", controlValues),
  new Controller("autoGenerate", controlValues),
  new Controller("chunkSize", controlValues),
  new Controller("width", controlValues),
  new Controller("height", controlValues),
  new Controller("widthSegment", controlValues),
  new Controller("heightSegment", controlValues),
  new Controller("waterHeight", controlValues),
  new Controller("stop2", controlValues),
  new Controller("soft", controlValues),
  new Controller("mountainHeight", controlValues),
];
// Add event listeners to the controllers
controllers.forEach((control) => control.addEventListener());

// Remove everything from the scene
function removeAll() {
  const objectsToRemove = scene.children.filter(
    (child) => !(child instanceof THREE.Color)
  );
  scene.remove(...objectsToRemove);
}

// Scene
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  0.4,
  10000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

// Renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(
  window.innerWidth ,
  window.innerHeight
);

// Camera
camera.position.setY(cameraY);
camera.position.setZ(cameraZ);
camera.position.setX(cameraX);
camera.rotateX(-0.79);
camera.rotateY(-0.6);
camera.rotateZ(-0.52);

// Lights
const controls = new OrbitControls(camera, renderer.domElement);
function addLight() {
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(10, 1000, 10);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  // Background
  const spaceTexture = new THREE.TextureLoader().load("space.jpg");
  scene.background = spaceTexture;
}
let currentPos = { x: cameraX, z: cameraZ };
let firstRender = true;
// Generate the terrain
import {generateTerrain} from "./TerrainController.js";
const generateAllTerrain = () => {
  let [waterT, earthT,treeT,houseT,cloudT]=generateTerrain(
    widthSegment,
    heightSegment,
    waterHeight,
    terrainSharpness,
    stop2,
    soft,
    mountainHeight,
    autoGenerate,
    widthMap,
    heightMap,
    chunkSize,
    camera);
  scene.add(waterT);
  earthT.forEach((e) => scene.add(e));
  treeT.forEach((t) => {
    t.forEach((tree) => scene.add(tree));
  });
  houseT.forEach((h) => {
    h.forEach((house) => {if(house!=null){scene.add(house)}});
  });
  cloudT.forEach((c) => {
    scene.add(c); 
  });
};

const generate = () => {
  if (firstRender) {
    removeAll();
    addLight();
    generateAllTerrain();
    firstRender = false;
  } else if (
    camera.position.x - currentPos.x >= widthMap ||
    camera.position.z - currentPos.z >= heightMap ||
    camera.position.x - currentPos.x <= -widthMap ||
    camera.position.z - currentPos.z <= -heightMap
  ) {
    removeAll();
    addLight();
    generateAllTerrain();
    currentPos.x = camera.position.x;
    currentPos.z = camera.position.z;
  } else if (autoGenerate) {
    setTimeout(() => {
      removeAll();
      addLight();
      generateAllTerrain();
    }, 2000);
  }
};
generate();
// Scroll Animation
const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.2;
  camera.position.x = t * -0.0022;
  camera.rotation.y = t * -0.0022;
};
document.body.onscroll = moveCamera;
moveCamera();

function controlValues() {
  terrainSharpness = document.getElementById("terrainSharpness").value;
  chunkSize = document.getElementById("chunkSize").value;
  widthMap = document.getElementById("width").value;
  heightMap = document.getElementById("height").value;
  widthSegment = document.getElementById("widthSegment").value;
  heightSegment = document.getElementById("heightSegment").value;
  waterHeight = document.getElementById("waterHeight").value;
  stop2 = document.getElementById("stop2").value;
  soft = document.getElementById("soft").value;
  mountainHeight = document.getElementById("mountainHeight").value;
  autoGenerate = document.getElementById("autoGenerate").checked;
  firstRender = true;
  generate();
}

// Call controlValues once to initialize the values
controlValues();

// Add event listeners to update the values when they change
addEventListener("mousemove", (event) => {
  document.getElementById("cameraX").innerText =
    "X: " + camera.position.x.toFixed(2);
  document.getElementById("cameraY").innerText =
    "Y: " + camera.position.y.toFixed(2);
  document.getElementById("cameraZ").innerText =
    "Z: " + camera.position.z.toFixed(2);
  generate();
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
