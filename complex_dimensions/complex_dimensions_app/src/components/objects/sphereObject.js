import { SphereGeometry, MeshPhysicalMaterial, Mesh, Color } from "three";

export function createSphere() {
  const colour = new Color().setRGB(40 / 255, 200 / 255, 40 / 255);
  const box = new SphereGeometry(4, 40, 40); // 4 radius, 40 widthSegments, 40 heightSegments
  const greenMaterial = new MeshPhysicalMaterial({ color: colour });
  const mesh = new Mesh(box, greenMaterial);
  return { mesh };
}
