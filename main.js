import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

// Setup
const widthMap = 100;
const heightMap = 100;
let terrainMesh;
let start1;
let stop1;
let waterHeight=-49.5;
let stop2;
let soft;
let noiseScale;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(
  (window.innerWidth * 75) / 100,
  (window.innerHeight * 80) / 100
);
camera.position.setZ(30);
camera.position.setX(-3);
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


// Create a SimplexNoise object
const Noise = new SimplexNoise();
function createTerrain() {
  if (terrainMesh) {
    scene.remove(terrainMesh);
  }
  // Create the terrain
  const terrainGeometry = new THREE.PlaneGeometry(
    widthMap,
    heightMap,
    start1,
    stop1
  );
  // Create the terrain material
  const terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    color: 0x554124,
    wireframe: false,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  });
  // Create the colors array
  const colors = new Uint8Array(
    terrainGeometry.attributes.position.array.length * 3
  );
  // Loop through the terrain and set the height
  for (
    let i = 0;
    i < terrainGeometry.attributes.position.array.length;
    i += 3
  ) {
    // Get the x and y position
    const x = terrainGeometry.attributes.position.array[i];
    const y = terrainGeometry.attributes.position.array[i + 1];
    // Map the x and y position to a value between 0 and 1
    const nx = x/widthMap - 0.5; 
    const ny = y/heightMap - 0.5;
    let noise = 0;

    // Calculate the noise value
    const e =
      1 * Noise.noise(1 * nx, 1 * ny) +
      0.5 * Noise.noise(2 * nx, 2 * ny) +
      0.25 * Noise.noise(4 * nx, 4 * ny);
    const e2 = e / (1 + 0.5 + 0.25);
    noise = Math.pow(e2, soft);
  
    if (!isNaN(noise)) {
      terrainGeometry.attributes.position.array[i + 2] = noise * noiseScale;
    }

    // Calculate the color based on the height
    const biomeColor = biome(noise);
    colors[i] = (biomeColor >> 16) & 255;
    colors[i + 1] = (biomeColor >> 8) & 255;
    colors[i + 2] = biomeColor & 255;
    terrainGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }
  // Calculate the normals
  terrainGeometry.computeVertexNormals();
  // Create the terrain mesh
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2; // Rotate for a flat terrain
  terrain.position.y = -50; // Adjust height
  // Add the terrain to the scene
  scene.add(terrain);
  terrainMesh = terrain;
}

// Biome Colors
const WATER = 0x0000ff;
const BEACH = 0xffff00;
const FOREST = 0x228b22;
const JUNGLE = 0x2e8b57;
const SAVANNAH = 0x9acd32;
const DESERT = 0xf4a460;
const SNOW = 0xffffff;
function biome(e) {
  // these thresholds will need tuning to match your generator
  if (e < 0.1) return BEACH;
  else if (e < 0.2) return FOREST;
  else if (e < 0.4) return JUNGLE;
  else if (e < 0.8) return SAVANNAH;
  else if (e < 0.9) return DESERT;
  else return SNOW;
}

// Create the terrain
createTerrain();
// Refresh the terrain
const terrainRefreshInterval = 200;
setInterval(createTerrain, terrainRefreshInterval);


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
