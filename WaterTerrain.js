import * as THREE from "three";

export const createWater =(widthMap,heightMap,waterHeight)=>{
    const waterGeometry = new THREE.PlaneGeometry(widthMap, heightMap, 1, 1);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0000ff,
      wireframe: false,
      side: THREE.DoubleSide,
    });
  
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2; // Rotate for a flat terrain
    water.position.y = waterHeight; // Adjust height
  
    return water;
}
