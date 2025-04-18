export const backgroundFragmentShader = () => `
    uniform float uTime;
    void main(){
      vec2 uv = gl_FragCoord.xy / vec2(10.0, 10000.0);
      float gradient = 0.005 + 6.5 * sin(uTime + uv.y * 15.0);
      gl_FragColor = vec4(vec3(gradient*0.1, gradient*0.1, gradient*0.1), 1.0);
    }
  `;
