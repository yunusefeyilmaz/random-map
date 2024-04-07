import { createWater } from "../Models/Water";
export const WaterController = (widthMap, heightMap, chunkSize, { position }, waterHeight) => {
    // Create the water mesh
    const waterMesh = createWater(
        widthMap * chunkSize * chunkSize / 1.5,
        heightMap * chunkSize * chunkSize / 1.5,
        waterHeight,
        position
    );
    return [waterMesh];
};
