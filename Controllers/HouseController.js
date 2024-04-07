import { createHouse } from "../Models/House";

const HouseController = (widthMap, heightMap, mountainHeight, chunkSize, { position }) => {
    // Create the house mesh
    const houseT = Array.from({ length: 100 }, () => {
        const xA = position.x - widthMap * (chunkSize - 0.5);
        const zA = position.z - heightMap * (chunkSize - 0.5);
        const xB = position.x + widthMap * (chunkSize - 0.5);
        const zB = position.z + heightMap * (chunkSize - 0.5);
        const start = [xA, zA];
        const end = [xB, zB];
        const xAreaPos = Math.random() * (end[0] - start[0]) + start[0];
        const zAreaPos = Math.random() * (end[1] - start[1]) + start[1];
        const [house, roof] = createHouse(xAreaPos, mountainHeight / 4, zAreaPos);
        return [house, roof];
    });

    return [houseT];
};

export default HouseController;
