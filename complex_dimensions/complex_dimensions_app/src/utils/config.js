import * as THREE from "three";
import { Width, Height } from "./global";
console.log("Config running...");

export const Camera = new THREE.PerspectiveCamera(
  70,
  Width / Height,
  0.01,
  500
);
export const Scene = new THREE.Scene();
export const Renderer = new THREE.WebGLRenderer({ antialias: true });
