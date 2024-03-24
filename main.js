
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setups 
let widthSegment, heightSegment, waterHeight, stop2, soft, mountainHeight, autoGenerate;
const widthMap = 100.0;
const heightMap = 100.0;
let chunkSize = 3;
let cameraY = 59.04;
let cameraX = -74.23;
let cameraZ = 72.13;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  120,
  window.innerWidth / window.innerHeight,
  0.4,
  10000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(
  (window.innerWidth * 75) / 100,
  (window.innerHeight * 80) / 100
);
camera.position.setY(cameraY);
camera.position.setZ(cameraZ);
camera.position.setX(cameraX);
camera.rotateX(-0.79);
camera.rotateY(-0.60);
camera.rotateZ(-0.52);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 1000, 10);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

// Background
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;



// Water Terrain
import { createWater } from "./WaterTerrain.js";
let mesh;
const water=()=>{ 
  // Remove the previous mesh
  if(mesh){
    scene.remove(mesh);
  }
  const xDist = widthMap;
  const zDist = heightMap;
  // Create the water mesh
  const wmesh=createWater(widthMap*chunkSize, heightMap*chunkSize,waterHeight,camera,xDist,zDist);
  scene.add(wmesh);
  mesh=wmesh;
};
// Earth Terrain
import { createTerrain } from "./EarthTerrain.js";
let earthMesh = [];
const earth=()=> {
  // Remove the previous mesh
  earthMesh.forEach((mesh) => scene.remove(mesh));
  // Create the earth mesh
  for (let i = 0; i < chunkSize * chunkSize; i++) {
    const xDist = (i % chunkSize) * widthMap;
    const zDist = Math.floor(i / chunkSize) * heightMap;
    const emesh = createTerrain(widthMap, heightMap, widthSegment, heightSegment, soft, mountainHeight, autoGenerate, camera, xDist, zDist);
    scene.add(emesh);
    earthMesh.push(emesh);
  }
}
const generate=()=>{
  earth();
  water();
}
generate();
// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.2;
  camera.position.x = t * -0.0022;
  camera.rotation.y = t * -0.0022;
}
document.body.onscroll = moveCamera;
moveCamera();

function controlValues() {
  widthSegment = document.getElementById("widthSegment").value;
  heightSegment = document.getElementById("heightSegment").value;
  waterHeight = document.getElementById("waterHeight").value;
  stop2 = document.getElementById("stop2").value;
  soft = document.getElementById("soft").value;
  mountainHeight = document.getElementById("mountainHeight").value;
  autoGenerate = document.getElementById("autoGenerate").checked;
  generate();
}
// Call controlValues once to initialize the values
controlValues();

// Add event listeners to update the values when they change
document.getElementById("widthSegment").addEventListener('change', controlValues);
document.getElementById("heightSegment").addEventListener('change', controlValues);
document.getElementById("waterHeight").addEventListener('change', controlValues);
document.getElementById("stop2").addEventListener('change', controlValues);
document.getElementById("soft").addEventListener('change', controlValues);
document.getElementById("mountainHeight").addEventListener('change', controlValues);
document.getElementById("autoGenerate").addEventListener('change', controlValues);

addEventListener('mousemove', (event) => {
  document.getElementById("cameraX").innerText
  = "Camera X: "+camera.position.x;
  document.getElementById("cameraY").innerText
  = "Camera Y: "+camera.position.y;
  document.getElementById("cameraZ").innerText
  = "Camera Z: "+camera.position.z;
  document.getElementById("cameraRotationX").innerText
  = "Camera Rotation X: "+camera.rotation.x;
  document.getElementById("cameraRotationY").innerText
  = "Camera Rotation Y: "+camera.rotation.y;
  document.getElementById("cameraRotationZ").innerText
  = "Camera Rotation Z: "+camera.rotation.z;
  generate();
});

// Animation Loop
function animate(timestamp) {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
