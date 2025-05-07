export const lineVertexShader = (curl) => `
      uniform float u_time;
      varying vec3 v_color;

      void main(){
        float curlAmount = sin(u_time * ${curl});
        vec3 newPosition = position;

        newPosition.y += curlAmount * sin(position.x * 0.59 + u_time)*1.98;

        newPosition.x += curlAmount * cos(position.y * 0.58 + u_time)*1.9;

        newPosition.z += curlAmount * sin(position.z * 0.57 + u_time)*2.19;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;
