import { createCloud } from "../Models/Cloud";

export const CloudController = (
  widthMap,
  heightMap,
  mountainHeight,
  chunkSize,
  { position }
) => {
  // Create the cloud mesh
  let cloudT = [];
  for (let i = 0; i < 10; i++) {
    if (Math.random() > 0.3) {
      let xA = position.x - widthMap * (chunkSize - 0.5);
      let zA = position.z - heightMap * (chunkSize - 0.5);
      let xB = position.x + widthMap * (chunkSize - 0.5);
      let zB = position.z + heightMap * (chunkSize - 0.5);
      let start = [xA, zA];
      let end = [xB, zB];
      let xAreaPos = Math.random() * (end[0] - start[0]) + start[0];
      let zAreaPos = Math.random() * (end[1] - start[1]) + start[1];
      let [cloud] = createCloud(xAreaPos, mountainHeight / 4, zAreaPos);
      cloudT.push(cloud);
    }
  }
  return [cloudT];
};
