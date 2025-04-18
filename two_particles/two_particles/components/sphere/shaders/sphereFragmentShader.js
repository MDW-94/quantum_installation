export const sphereFragmentShader = (colourArg) => `
        uniform float u_time;
        uniform float ${
          (colourArg == "blue" && "u_bFactor") ||
          (colourArg == "red" && "u_rFactor")
        };
        uniform float u_pcurveHandle;
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
  
        float pcurve(float x, float a, float b) {
          float k = pow(a, b);
          return pow(x, k) / (pow(x, k) + pow(1.0 - x, k));
        }
  
  
      void main() {
        vec2 res = voronoi(v_pos * 0.4, u_time*3.0);
  
        vec3 mycolor = vec3(pow(res.x, 1.5));
  
        ${
          (colourArg == "blue" && "float blue = mycolor.b * u_bFactor;") ||
          (colourArg == "red" && "float red = mycolor.r * u_rFactor;")
        };

        ${
          (colourArg == "blue" &&
            "mycolor.b = blue*(1.0 - smoothstep(0.9,1.0,res.x));") ||
          (colourArg == "red" &&
            "mycolor.r = red*(1.0 - smoothstep(0.9,1.0,res.x));")
        };

        ${
          (colourArg == "blue" &&
            "mycolor.r = pcurve(mycolor.r, 4.0, u_pcurveHandle);") ||
          (colourArg == "red" &&
            "mycolor.b = pcurve(mycolor.b, 4.0, u_pcurveHandle);")
        };
  
        mycolor.g = pcurve(mycolor.g, 4.0, u_pcurveHandle);
  
        float alpha = 1.0 - smoothstep(0.9, 1.7, res.x);
  
        gl_FragColor = vec4(mycolor, alpha);
      }
    `;
