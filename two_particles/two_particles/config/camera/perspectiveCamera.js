import { PerspectiveCamera } from "three";
import { Depth, Height, Width } from "../global";

export const perspectiveCamera = new PerspectiveCamera(
  70,
  Width / Height,
  0.01,
  Depth
);
