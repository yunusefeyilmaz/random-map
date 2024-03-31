import * as THREE from "three";

export const createTree = (x, y, z) => {
  let waterHeight = document.getElementById("waterHeight").value;
  if (y < waterHeight) {
    return [null, null];
  }
  const treeGeometry = new THREE.CylinderGeometry(0.1, 0.2, 2);
  const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
  const tree = new THREE.Mesh(treeGeometry, treeMaterial);
  // Yapraklar oluşturma
  var leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 });
  var leavesGeometry = new THREE.ConeGeometry(1, 3, 8);
  var leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(x, y + 1.5, z);
  tree.position.set(x, y, z);

  return [tree, leaves];
};
