import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setups 
const widthMap = 1000;
const heightMap = 1000;
let cameraX = -30;
let cameraZ = 200;
let cameraY = 300;
let start1;
let stop1;
let waterHeight=-49.5;
let stop2;
let soft;
let noiseScale;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
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
renderer.render(scene, camera);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

// Background
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

// Control Values
function controlValues() {
  start1 = document.getElementById("start1").value;
  stop1 = document.getElementById("stop1").value;
  waterHeight = document.getElementById("start2").value;
  stop2 = document.getElementById("stop2").value;
  soft = document.getElementById("soft").value;
  noiseScale = document.getElementById("noiseScale").value;
}
// Water Terrain
import { createWater } from "./WaterTerrain.js";
let mesh;
function water(){ 
  // Remove the previous mesh
  if(mesh){
    scene.remove(mesh);
  }
  // Create the water mesh
  const wmesh=createWater(widthMap, heightMap,waterHeight);
  scene.add(wmesh);
  mesh=wmesh;
};
// Create the water
water(mesh);
// Refresh the water
const waterRefresh = 100;
setInterval(water, waterRefresh);

// Earth Terrain
import { createTerrain } from "./EarthTerrain.js";
let earthMesh;
function earth(){
  // Remove the previous mesh
  if(earthMesh){
    scene.remove(earthMesh);
  }
  // Create the earth mesh
  const emesh=createTerrain(widthMap, heightMap, start1, stop1, soft, noiseScale);
  scene.add(emesh);
  earthMesh=emesh;
}
// Create the earth
earth(earthMesh);
// Refresh the earth
const earthRefresh =2000;
setInterval(earth, earthRefresh);

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.2;
  camera.position.x = t * -0.0022;
  camera.rotation.y = t * -0.0022;
}
document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  controlValues();
}

animate();
