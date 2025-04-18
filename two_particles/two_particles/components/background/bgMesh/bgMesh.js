import { backgroundFragmentShader } from "../bgShaders/bgFragmentShader";
import { backgroundVertexShader } from "../bgShaders/bgVertexShader";
import { PlaneGeometry, ShaderMaterial, Mesh } from "three";

export const bgGeom = new PlaneGeometry(2, 2);
export const bgMat = new ShaderMaterial({
  uniforms: {
    uTime: { value: 0.1 },
  },
  vertexShader: backgroundVertexShader(),
  fragmentShader: backgroundFragmentShader(),
  depthWrite: false,
});

export const bgMesh = new Mesh(bgGeom, bgMat);
