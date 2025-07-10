import {
  SphereGeometry,
  ShaderMaterial,
  Mesh,
  Color,
  Vector2,
  MeshPhongMaterial,
} from "three";
import { Height, Width } from "../../utils/global";

export function createSphere() {
  const colour = new Color().setRGB(
    (40 / 255) * Math.sin(20),
    200 / 255,
    40 / 255
  );
  const box = new SphereGeometry(5, 40, 40); // 4 radius, 40 widthSegments, 40 heightSegments
  // const uniforms = {
  //   iTime: { value: 0 },
  //   iResolution: { value: new Vector2(Width, Height) },
  // };
  // const material = new ShaderMaterial({
  //   uniforms: uniforms,
  //   vertexShader: `
  //       varying vec3 v_pos;

  //       void main() {
  //         v_pos = position;
  //         vec4 modelViewPosition = modelViewMatrix * vec4(position,1.0);
  //         gl_Position = projectionMatrix * modelViewPosition;
  //       }
  //     `,
  //   fragmentShader: `
  //     uniform float iTime;
  //     uniform vec2 iResolution;

  //     void main(){
  //       vec2 uv = gl_FragCoord.xy / iResolution.xy;
  //       vec3 col = 0.5 + 0.5 * cos(iTime + vec3(uv.x, uv.y, uv.x) + vec3(0.0, 2.0, 4.0));

  //       gl_FragColor = vec4(col, 1.0);
  //     }
  //     `,
  // });
  const material = new MeshPhongMaterial({
    color: 0xdb063d, // Base color
    // emissive: 0xdb7c02, // Glow color
    emissive: 0x16f29b, // Glow color
    emissiveIntensity: 1, // Glow strength
    shininess: 75, // Optional: add specular highlights
  });
  const mesh = new Mesh(box, material);
  return { mesh, material };
}

// https://www.color-hex.com/color-palette/1032994
