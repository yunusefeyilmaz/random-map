import { createCloud } from "../Models/Cloud";

export const CloudController = (
  widthMap,
  heightMap,
  mountainHeight,
  chunkSize,
  { position }
) => {
  const numClouds = document.getElementById("cloudCount").value;
  const xA = position.x - widthMap * (chunkSize - 0.5);
  const zA = position.z - heightMap * (chunkSize - 0.5);
  const xB = position.x + widthMap * (chunkSize - 0.5);
  const zB = position.z + heightMap * (chunkSize - 0.5);
  const start = [xA, zA];
  const end = [xB, zB];
  const cloudT = [];

  for (let i = 0; i < numClouds; i++) {
    if (Math.random() > 0.3) {
      const xAreaPos = Math.random() * (end[0] - start[0]) + start[0];
      const zAreaPos = Math.random() * (end[1] - start[1]) + start[1];
      const cloud = createCloud(xAreaPos, mountainHeight / 4, zAreaPos);
      cloudT.push(cloud);
    }
  }

  return cloudT;
};
