import {
  CubicBezierCurve3,
  BufferGeometry,
  MeshPhysicalMaterial,
  Line,
  Vector3,
  Color,
} from "three";

export function createLine() {
  const p0 = new Vector3(-20, 60);
  const p1 = new Vector3(-50, 20);
  const colour = new Color().setRGB(40 / 255, 255 / 255, 255 / 255);
  const curve = new CubicBezierCurve3(p0, p1);
  const points = curve.getSpacedPoints(200);
  const geomtery = new BufferGeometry().setFromPoints(points);
  const material = new MeshPhysicalMaterial({ color: colour });
  const line = new Line(geomtery, material);
  return { line };
}
