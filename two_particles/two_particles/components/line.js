// import { LineBasicMaterial, Vector3, BufferGeometry, Line } from "three";
import {
  CubicBezierCurve,
  CubicBezierCurve3,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  Vector3,
} from "three";

export function createLine(colour) {
  // const lineMaterial = new LineBasicMaterial({ color: colour });

  // const points = [];
  // for (let i = 0; i < 30; i += 10) {
  //   points.push(new Vector3(-20 + i, i * 0.5, i * 0));
  // }

  // const geometry2 = new BufferGeometry().setFromPoints(points);
  // const line = new Line(geometry2, lineMaterial);

  // For Cubic Bezier curvers you need to explicitly define them, no for loops
  // Note
  const p0 = new Vector3(-20, 0);
  const p1 = new Vector3(-10, 20);

  const curve = new CubicBezierCurve3(p0, p1);

  // .getPoints, lower makes the curve low res
  // to access last point of curve w 50 points: 150-1=149, 149,148,147(XYZ)
  const points = curve.getSpacedPoints(200);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({ color: colour, linewidth: 5 });

  const line = new Line(geometry, material);

  return line;
}
