// Purpose: Generate the terrain mesh and the tree and house meshes
import { createTerrain } from "../Models/Earth.js";

export const generateTerrain = (
  widthSegment,
  heightSegment,
  terrainSharpness,
  soft,
  mountainHeight,
  autoGenerate,
  widthMap = 100,
  heightMap = 100,
  chunkSize = 3,
  camera
) => {
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
    // Add the terrain to the scene
    return [earthT, treeT, houseT];
};