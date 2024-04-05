// Objective: Create a water mesh
import * as THREE from "three";

export const createWater = (
  widthMap,
  heightMap,
  waterHeight,
  position
) => {
  // Create the water geometry
  const waterGeometry = new THREE.PlaneGeometry(widthMap, heightMap, 1, 1);
  // Create the water material
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false,
    side: THREE.DoubleSide,
  });
  // Create the water mesh
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.rotation.x = -Math.PI / 2; // Rotate for a flat terrain
  water.position.y = waterHeight; // Adjust height
  water.position.x = position.x; // Adjust position
  water.position.z = position.z ; // Adjust position
  return water;
};
