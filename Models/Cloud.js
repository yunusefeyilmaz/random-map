import * as THREE from "three";

export const createCloud = (x, y, z) => {
  const cloud = new THREE.Group();
  const cloudCount = 13;
  const cloudRadius = 29;
  const cloudSpacing = (Math.PI * 2) / cloudCount;
  for (let i = 0; i < cloudCount; i++) {
    const geometry = new THREE.SphereGeometry(10, 4, 4);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const sphere = new THREE.Mesh(geometry, material);
    const angle = cloudSpacing * i;
    sphere.position.set( Math.cos(angle) * cloudRadius, y, (Math.random() - 0.5) * 3);
    cloud.add(sphere);
  }
  cloud.scale.set(0.5, 0.5, 0.5);
  cloud.position.set(x, y, z);
  return [cloud];
};
