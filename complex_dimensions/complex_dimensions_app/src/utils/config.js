import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Width, Height } from "./global";
console.log("Config running...");

export const Camera = new PerspectiveCamera(70, Width / Height, 0.01, 500);
export const myScene = new Scene();
export const Renderer = new WebGLRenderer({ antialias: true });
