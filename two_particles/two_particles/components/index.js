import { createLine } from "./line/line";
import { createSphere } from "./sphere/sphere";

// Sphere 1 --------
export const greySphere = createSphere("blue", 70, 6);

// Sphere 2 ---------
export const redSphere = createSphere("red", 70, 6);

// Line -----------
export const line = createLine("0.59", 0.0);
export const line2 = createLine("1.59", 0.01);
export const line3 = createLine("2.58", 0.02);
export const line4 = createLine("0.57", 0.03);
export const line5 = createLine("1.56", 0.04);

// Setup ----------

export const linePos = line.line.geometry.attributes.position;
export const linePos2 = line2.line.geometry.attributes.position;
export const linePos3 = line3.line.geometry.attributes.position;
export const linePos4 = line4.line.geometry.attributes.position;
export const linePos5 = line5.line.geometry.attributes.position;
export const lineNodes = linePos.array;
export const lineNodes2 = linePos2.array;
export const lineNodes3 = linePos3.array;
export const lineNodes4 = linePos4.array;
export const lineNodes5 = linePos5.array;
export const sphere1XYZ = {
  x: 0,
  y: 0,
  z: 0,
};

export const sphere2XYZ = {
  x: 0,
  y: 0,
  z: 0,
};
