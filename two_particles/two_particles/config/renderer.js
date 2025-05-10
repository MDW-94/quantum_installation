import { WebGLRenderer } from "three";
import { Canvas } from "./global";

export const renderer = new WebGLRenderer({ 
    canvas: Canvas,
    antialias: true
 });
