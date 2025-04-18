export const sphereVertexShader = () =>
  `varying vec3 v_pos;
    void main() {
      v_pos = position;
      vec4 modelViewPosition = modelViewMatrix * vec4(position,1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `;
