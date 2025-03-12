import { SphereGeometry, MeshLambertMaterial, Mesh } from "three";

export function createSphere(colorArg, size, radius) {
  const geometry = new SphereGeometry(radius, size, size);
  const greyBlue = new MeshLambertMaterial({ color: colorArg });
  const sphere = new Mesh(geometry, greyBlue);

  return sphere;
}
