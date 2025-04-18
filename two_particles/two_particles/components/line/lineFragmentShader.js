export const lineFragmentShader = () => `
      uniform vec3 u_color;
      uniform float u_time;
      uniform float u_glowIntensity;

      void main(){
        float flicker = 0.4 + 0.0 * sin(u_time*(sin(u_time*0.5)*0.2));
        vec3 glowColor = u_color * flicker * u_glowIntensity;

        gl_FragColor = vec4(glowColor, 0.5);
      }
    `;
