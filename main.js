import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Chart from 'chart.js/auto';
// Terrain import edilmiyor, doğrudan THREE.Terrain kullanılıyor

// Setup
const widthMap = 500;
const heightMap = 500;
let mappedValues = [];

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
renderer.setSize((window.innerWidth *75)/100, window.innerHeight*80/100);
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

// Terrain
// Import SimplexNoise from Three.js
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

let terrainMesh;
let start1;
let stop1;
let start2;
let stop2;
let soft;
let noiseScale;
function controlValues() {
  start1 = document.getElementById("start1").value;
  stop1 = document.getElementById("stop1").value;
  start2 = document.getElementById("start2").value;
  stop2 = document.getElementById("stop2").value;
  soft = document.getElementById("soft").value;
  noiseScale = document.getElementById("noiseScale").value;
}

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function createWater() {
  const waterGeometry = new THREE.PlaneGeometry(widthMap, heightMap, 1, 1);
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false,
    side: THREE.DoubleSide,
  });

  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.rotation.x = -Math.PI / 2; // Rotate for a flat terrain
  water.position.y = -55; // Adjust height

  scene.add(water);
}
createWater();
function createTerrain() {
  if (terrainMesh) {
    scene.remove(terrainMesh);
  }
  const terrainGeometry = new THREE.PlaneGeometry(
    widthMap,
    heightMap,
    30,
    30
  );
  const terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true, 
    color: 0x554124,
    wireframe: false,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  });
  // Create a SimplexNoise object
  const simplexNoise = new SimplexNoise();
  const colors = new Float32Array(terrainGeometry.attributes.position.array.length * 3); // Array for vertex colors

  for (
    let i = 0;
    i < terrainGeometry.attributes.position.array.length;
    i += 3
  ) {
    const x = terrainGeometry.attributes.position.array[i];
    const y = terrainGeometry.attributes.position.array[i + 1];
    let noise = 0;
    noise = simplexNoise.noise(x / soft, y / soft) * noiseScale; // Daha yüksek gürültü özellikleri\
    const mapped = map(noise, start1,stop1,start2, stop2); // Yükseklik haritasına yeniden eşleme

    terrainGeometry.attributes.position.array[i + 2] = mapped;
    mappedValues.push(mapped);
    // Calculate the color based on the height
    const color = Math.max(3, 2-noise); // Lower noise -> lighter color (scale 0-1)
    colors[i] = color; // Set red component
    colors[i + 1] = color; // Set green component
    colors[i + 2] = color; // Set blue component
    terrainGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    
  }
  terrainGeometry.computeVertexNormals();
  
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2; // Rotate for a flat terrain
  terrain.position.y = -50; // Adjust height

  scene.add(terrain);
  terrainMesh = terrain;
}

// Terrain ekleyin
createTerrain();
// Terrain'i belirli aralıklarla yeniden oluşturun (2 saniyede bir)
const terrainRefreshInterval = 2000;
setInterval(createTerrain, terrainRefreshInterval);
//createCharts();
// Scroll Animation

function createCharts(){
  let chart = new Chart(document.getElementById('myChart'), {
    type: 'line',
    data: {
        labels: Array.from({length: mappedValues.length}, (_, i) => i + 1),
        datasets: [{
            label: 'Mapped Values',
            data: mappedValues,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}


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
