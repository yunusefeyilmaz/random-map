import { createHouse } from "../Models/House";

export const HouseController = (widthMap,
    heightMap,
    mountainHeight,
    chunkSize,
    { position }) => {
    // Create the house mesh
    let houseT = [];

    for (let i = 0; i < 100; i++) {
        let xA = position.x - widthMap * (chunkSize - 0.5);
        let zA = position.z - heightMap * (chunkSize - 0.5);
        let xB = position.x + widthMap * (chunkSize - 0.5);
        let zB = position.z + heightMap * (chunkSize - 0.5);
        let start = [xA, zA];
        let end = [xB, zB];
        let xAreaPos = Math.random() * (end[0] - start[0]) + start[0];
        let zAreaPos = Math.random() * (end[1] - start[1]) + start[1];
        let [house, roof] = createHouse(xAreaPos, mountainHeight / 4, zAreaPos);
        houseT.push(house, roof);
    }
    return [houseT];
};