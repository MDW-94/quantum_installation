import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Width, Height, Canvas } from "./global";

export const Camera = new PerspectiveCamera(70, Width / Height, 0.01, 500);
export const myScene = new Scene();
export const Renderer = new WebGLRenderer({ canvas: Canvas, antialias: true });
