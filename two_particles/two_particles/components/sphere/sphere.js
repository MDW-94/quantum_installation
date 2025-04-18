import { SphereGeometry, Mesh, ShaderMaterial } from "three";
import { sphereVertexShader } from "./shaders/sphereVertexShader";
import { sphereFragmentShader } from "./shaders/sphereFragmentShader";

export function createSphere(colorArg, size, radius) {
  const geometry = new SphereGeometry(radius, size, size);
  const uniforms = {
    u_time: { value: 0.0 },
    u_bFactor: { value: 2.0 },
    u_rFactor: { value: 2.0 },
    u_pcurveHandle: { value: 1.5 },
  };

  let material;

  material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: sphereVertexShader(),
    fragmentShader: sphereFragmentShader(colorArg),
  });

  const sphere = new Mesh(geometry, material);

  return { sphere, uniforms };
}

// https://medium.com/geekculture/make-a-cool-plasma-ball-using-voronoi-effect-in-three-js-8a0477e3b745

// https://blog.cjgammon.com/threejs-custom-shader-material/
