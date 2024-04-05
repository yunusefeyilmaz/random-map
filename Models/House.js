import * as THREE from "three";

export const createHouse = (x, y, z) => {
  // Create the house geometry
  const houseGeometry = new THREE.BoxGeometry(1, 1, 1);
  const houseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const house = new THREE.Mesh(houseGeometry, houseMaterial);
  // Create the roof geometry
  const roofGeometry = new THREE.ConeGeometry(0.8, 1, 4);
  const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x818321 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  // Set the position of the roof
  roof.rotation.y = Math.PI / 4;
  roof.position.set(x, y + 1.5, z);
  // Set the position of the house
  house.position.set(x, y + 0.5, z);
  let waterHeight = document.getElementById("waterHeight").value;
  if (y < waterHeight) {
    return [null, null];
  }
  return [house, roof];
};
