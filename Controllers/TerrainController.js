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

  const earthT = [];
  const treeT = [];
  const houseT = [];
  const xDistMultiplier = widthMap;
  const zDistMultiplier = heightMap;

  for (let k = -1; k <= 1; k += 2) {
    for (let j = -1; j <= 1; j += 2) {
      for (let i = 0; i < chunkSize * chunkSize; i++) {
        const xDist = (i % chunkSize) * xDistMultiplier * k;
        const zDist = Math.floor(i / chunkSize) * zDistMultiplier * j;
        // Create the terrain
        const [e, t, h] = createTerrain(
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

  return [earthT, treeT, houseT];
};
