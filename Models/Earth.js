import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import seedrandom from "seedrandom";
import { createTree } from "./Tree";
import { createHouse } from "./House";

let rng = seedrandom(Math.random().toString()); // generate a random seed
let Noise = new createNoise2D(rng); // create a new 2D noise function

const scaledNoise = (nx, ny, scale) => {
  return Noise(nx * scale, ny * scale) / 4 + 0.5;
};

export const createTerrain = (
  widthMap,
  heightMap,
  widthSegment,
  heightSegment,
  soft,
  mountainHeight,
  autoGenerate,
  camera,
  xDist,
  zDist,
  terrainSharpness
) => {
  if (autoGenerate) {
    rng = seedrandom(Math.random().toString()); // generate a random seed
    Noise = new createNoise2D(rng);
  }
  // Create the terrain
  const terrainGeometry = new THREE.PlaneGeometry(
    widthMap,
    heightMap,
    widthSegment,
    heightSegment
  );
  // Create the terrain material
  const terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    wireframe: false,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  });
  // Create the colors array
  const colors = new Float32Array(
    terrainGeometry.attributes.position.array.length * 3
  );
  // Create the tree mesh
  let treeMesh = [];
  // Create the houses mesh
  let houseMesh = [];
  // Loop through the terrain and set the height
  for (
    let i = 0;
    i < terrainGeometry.attributes.position.array.length;
    i += 3
  ) {
    // Get the x and y position

    const x =
      camera.position.x + xDist + terrainGeometry.attributes.position.array[i];
    const y =
      camera.position.z -
      zDist -
      terrainGeometry.attributes.position.array[i + 1];
    // Map the x and y position to a value between 0 and 1
    const nx = x / widthMap;
    const ny = y / heightMap;
    // Calculate the noise value
    let choise = terrainSharpness;
    let e =
      scaledNoise(nx, ny, 1 * choise) +
      0.5 * scaledNoise(nx, ny, 2 * choise) +
      0.25 * scaledNoise(nx, ny, 4 * choise) +
      0.125 * scaledNoise(nx, ny, 8 * choise) +
      0.06 * scaledNoise(nx, ny, 16 * choise) +
      0.03 * scaledNoise(nx, ny, 32 * choise) +
      0.015 * scaledNoise(nx, ny, 64 * choise);
    e = e / (1.0 + 0.5);
    e = Math.round(e * soft) / soft;
    let m =
      scaledNoise(nx, ny, 1) +
      0.5 * scaledNoise(nx, ny, 2) +
      0.25 * scaledNoise(nx, ny, 4) +
      0.125 * scaledNoise(nx, ny, 8) +
      0.06 * scaledNoise(nx, ny, 16) +
      0.03 * scaledNoise(nx, ny, 32);
    m = m / (1 + 0.5 + 0.25 + 0.125 + 0.06 + 0.03);

    if (!isNaN(e)) {
      terrainGeometry.attributes.position.array[i + 2] = e * mountainHeight;
    }
    // Create the trees
    if (
      e * mountainHeight < (70 * mountainHeight) / 100 &&
      Math.random() < 0.03 &&
      e * mountainHeight > (55 * mountainHeight) / 100
    ) {
      let [tree, leaves] = createTree(
        x,
        e * mountainHeight - mountainHeight / 2 + mountainHeight / 8,
        y
      );
      treeMesh.push(tree, leaves);
    }
    //Create the houses
    if (
      e * mountainHeight < (50 * mountainHeight) / 100 &&
      Math.random() < 0.05 &&
      e * mountainHeight > (10 * mountainHeight) / 100
    ) {
      let [house, roof] = createHouse(
        x,
        e * mountainHeight - mountainHeight / 2 + mountainHeight / 8,
        y
      );
      houseMesh.push(house, roof);
    }

    // Calculate the color based on the height
    const biomeColor = biome(e, m);
    colors[i] = biomeColor.b;
    colors[i + 1] = biomeColor.g;
    colors[i + 2] = biomeColor.r;
    // Set the color
    terrainGeometry.attributes.color = new THREE.BufferAttribute(colors, 3);
  }
  // Calculate the normals

  terrainGeometry.computeVertexNormals();
  // Create the terrain mesh
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2; // Rotate for a flat terrain
  terrain.position.y = -mountainHeight / 2 + mountainHeight / 8; // Adjust height

  terrain.position.x = camera.position.x + xDist;
  terrain.position.z = camera.position.z - zDist;
  // Add the terrain to the scene
  return [terrain, treeMesh, houseMesh];
};

// Biome Colors

const TROPICAL_RAIN_FOREST = new THREE.Color(0x2d882d).convertSRGBToLinear(); // dark green
const TROPICAL_SEASONAL_FOREST = new THREE.Color(
  0x3d8e3d
).convertSRGBToLinear(); // green
const SUBTROPICAL_DESERT = new THREE.Color(0xc9cc8a).convertSRGBToLinear(); // light green
const OCEAN = new THREE.Color(0x0000ff).convertSRGBToLinear(); // blue
const BEACH = new THREE.Color(0xfdb813).convertSRGBToLinear(); // sandy color
const SCORCHED = new THREE.Color(0x333333).convertSRGBToLinear(); // dark gray
const BARE = new THREE.Color(0x888888).convertSRGBToLinear(); // light gray
const TUNDRA = new THREE.Color(0xaaaaaa).convertSRGBToLinear(); // gray
const TEMPERATE_DESERT = new THREE.Color(0xc9cc8a).convertSRGBToLinear(); // light yellow
const SHRUBLAND = new THREE.Color(0x8f9779).convertSRGBToLinear(); // brownish gray
const TAIGA = new THREE.Color(0x99aa77).convertSRGBToLinear(); // grayish green
const GRASSLAND = new THREE.Color(0x88aa55).convertSRGBToLinear(); // greenish gray
const TEMPERATE_DECIDUOUS_FOREST = new THREE.Color(
  0x679459
).convertSRGBToLinear(); // dark greenish gray
const TEMPERATE_RAIN_FOREST = new THREE.Color(0x448855).convertSRGBToLinear(); // dark green
const SNOW = new THREE.Color(0xffffff).convertSRGBToLinear(); // white

function biome(e, m) {
  // these thresholds will need tuning to match your generator
  if (e < 0.1) return OCEAN;
  if (e < 0.12) return BEACH;

  if (e > 0.8) {
    if (m < 0.1) return SCORCHED;
    if (m < 0.2) return BARE;
    if (m < 0.5) return TUNDRA;
    return SNOW;
  }

  if (e > 0.6) {
    if (m < 0.25) return TEMPERATE_DESERT;
    if (m < 0.5) return SHRUBLAND;
    return TAIGA;
  }

  if (e > 0.3) {
    if (m < 0.16) return TEMPERATE_DESERT;
    if (m < 0.5) return GRASSLAND;
    if (m < 0.83) return TEMPERATE_DECIDUOUS_FOREST;
    return TEMPERATE_RAIN_FOREST;
  }

  if (m < 0.16) return SUBTROPICAL_DESERT;
  if (m < 0.33) return GRASSLAND;
  if (m < 0.66) return TROPICAL_SEASONAL_FOREST;
  return TROPICAL_RAIN_FOREST;
}
