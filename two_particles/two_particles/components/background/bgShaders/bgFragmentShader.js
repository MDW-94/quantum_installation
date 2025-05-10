export const backgroundFragmentShader = () => `
    uniform float uTime;
    void main(){
      vec2 uv = gl_FragCoord.xy / vec2(5.0, 10000.0);
      float gradient = 0.005 + 8.5 * sin(uTime*0.75 + uv.y * 2.0);
      gl_FragColor = vec4(vec3(gradient*0.09, gradient*0.09, gradient*0.09), 1.0);
    }
  `;
