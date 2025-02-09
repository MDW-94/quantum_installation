import { SphereGeometry, MeshLambertMaterial, Mesh } from "three";

export function createSphere(colorArg) {
  const geometry = new SphereGeometry(4, 30, 30);
  const greyBlue = new MeshLambertMaterial({ color: colorArg });
  const sphere = new Mesh(geometry, greyBlue);

  return sphere;
}
