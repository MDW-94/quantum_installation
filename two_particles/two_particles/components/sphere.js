import { SphereGeometry, Mesh, ShaderMaterial } from "three";

export function createSphere(colorArg, size, radius) {
  const geometry = new SphereGeometry(radius, size, size);
  const material = new ShaderMaterial({
    uniforms: {
      u_time: { value: 0.0 },
    },
    vertexShader: `
    varying vec3 v_pos;

    void main() {
      v_pos = position;
      vec4 modelViewPosition = modelViewMatrix * vec4(position,1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,
    fragmentShader: `
      uniform float u_time;
      varying vec3 v_pos;

      vec3 hash3d(vec3 p){
        p = fract(p * vec3(443.897, 441.423, 437.195));
        p += dot(p, p.yxz + 19.19);
        return fract(vec3(p.x*p.y, p.y*p.z, p.z*p.x));
      }

      vec2 voronoi(in vec3 x, in float time){
        vec3 n = floor(x);
        vec3 f = fract(x);
        vec4 m = vec4(8.0);

        for(int k=-1;k<=1;k++){
          for(int j=-1; j<=1;j++){
            for(int i=-1; i<=1; i++){
              vec3 g = vec3(float(i),float(j),float(k));
              vec3 o = hash3d(n + g);
              vec3 r = g + (0.5+0.5*sin(vec3(time)+6.2831*o)) - f;
              float d = dot(r,r);

              if(d<m.x){
                m = vec4(d,o);
              }
            }
          }
        }
        return vec2(m.x, m.y + m.z + m.w);
      }

    void main() {
      vec2 res = voronoi(v_pos * 3.0, u_time*0.3);
      gl_FragColor = vec4(vec3(res.x), 1.0);
    }
  `,
  });
  const sphere = new Mesh(geometry, material);

  return sphere;
}

// https://medium.com/geekculture/make-a-cool-plasma-ball-using-voronoi-effect-in-three-js-8a0477e3b745

// https://blog.cjgammon.com/threejs-custom-shader-material/
