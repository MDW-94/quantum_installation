import { LineBasicMaterial, Vector3, BufferGeometry, Line } from "three";

export function createLine(colour) {
  const lineMaterial = new LineBasicMaterial({ color: colour });

  const points = [];
  for (let i = 0; i < 30; i += 10) {
    points.push(new Vector3(-20 + i, i * 0.5, i * 0));
  }

  const geometry2 = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry2, lineMaterial);

  return line;
}
