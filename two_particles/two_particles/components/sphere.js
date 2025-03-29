import { SphereGeometry, MeshLambertMaterial, Mesh } from "three";

export function createSphere(colorArg, size, radius) {
  const geometry = new SphereGeometry(radius, size, size);
  const greyBlue = new MeshLambertMaterial({ color: colorArg });
  const sphere = new Mesh(geometry, greyBlue);

  return sphere;
}

// https://medium.com/geekculture/make-a-cool-plasma-ball-using-voronoi-effect-in-three-js-8a0477e3b745
