import { createWater } from "./WaterTerrain.js";
import { createTerrain } from "./EarthTerrain.js";
import { createCloud } from "./Cloud.js";
export const generateTerrain = (
  widthSegment,
  heightSegment,
  waterHeight,
  terrainSharpness,
  stop2,
  soft,
  mountainHeight,
  autoGenerate,
  widthMap = 100,
  heightMap = 100,
  chunkSize = 3,
  camera
) => {
    const xDist = 0;
    const zDist = 0;
    // Create the water mesh
    const waterMesh = createWater(
      (widthMap * chunkSize * chunkSize) / 1.5,
      (heightMap * chunkSize * chunkSize) / 1.5,
      waterHeight,
      camera,
      xDist,
      zDist
    );
    let earthT = [];
    let treeT = [];
    let houseT = [];
    // Create the earth mesh
    for (let k = -1; k <= 1; k += 2) {// render the terrain in a grid
        for (let j = -1; j <= 1; j += 2) {// render the terrain in a grid
          for (let i = 0; i < chunkSize * chunkSize; i++) { // chunkSize is the number of chunks in the grid
            // Calculate the distance between the chunks
            let xDist = (i % chunkSize) * widthMap * k;
            let zDist = Math.floor(i / chunkSize) * heightMap * j;
            // Create the terrain mesh
            // The createTerrain function returns the terrain mesh and the tree and house meshes
            let [e,t,h] = createTerrain(
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
            );
            earthT.push(e);
            treeT.push(t);
            houseT.push(h);
          }
        }
      }
    // Create the cloud mesh
    let cloudT = [];
    for(let i=0;i<10;i++){
      if(Math.random()>0.3){
        let xA = camera.position.x - widthMap*(chunkSize-0.5);
        let zA= camera.position.z - heightMap*(chunkSize-0.5);
        let xB = camera.position.x + widthMap*(chunkSize-0.5);
        let zB = camera.position.z + heightMap*(chunkSize-0.5);
        let start = [xA,zA];
        let end = [xB,zB];
        let xAreaPos = Math.random() * (end[0] - start[0]) + start[0];
        let zAreaPos = Math.random() * (end[1] - start[1]) + start[1];
        let [cloud] = createCloud(xAreaPos, mountainHeight/4,zAreaPos);
        cloudT.push(cloud);
      }
    }
    // Add the terrain to the scene
    return [waterMesh, earthT, treeT, houseT, cloudT];
};