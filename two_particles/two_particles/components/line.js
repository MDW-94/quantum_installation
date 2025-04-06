// import { LineBasicMaterial, Vector3, BufferGeometry, Line } from "three";
import { CubicBezierCurve3, BufferGeometry, Line, Vector3, Color } from "three";
import { uniform } from "three/tsl";
import { ShaderMaterial } from "three/webgpu";

export function createLine(curl) {
  // const lineMaterial = new LineBasicMaterial({ color: colour });

  // const points = [];
  // for (let i = 0; i < 30; i += 10) {
  //   points.push(new Vector3(-20 + i, i * 0.5, i * 0));
  // }

  // const geometry2 = new BufferGeometry().setFromPoints(points);
  // const line = new Line(geometry2, lineMaterial);

  // For Cubic Bezier curvers you need to explicitly define them, no for loops
  // Note
  const p0 = new Vector3(-20, 0);
  const p1 = new Vector3(-10, 20);

  const curve = new CubicBezierCurve3(p0, p1);

  // .getPoints, lower makes the curve low res
  // to access last point of curve w 50 points: 150-1=149, 149,148,147(XYZ)
  const points = curve.getSpacedPoints(200);
  const geometry = new BufferGeometry().setFromPoints(points);

  // const material = new LineBasicMaterial({ color: colour, linewidth: 5 });

  //Note: uniforms are not defined by convention, they're just variables that you pass in
  const uniform = {
    u_time: { value: 0.0 },
    u_color: { value: new Color(0, 50, 200) },
    u_glowIntensity: { value: 3.0 },
  };

  //Note: uniforms are what you pass in as JS objs, varying are what you pass between vertex to fragment shaders
  const material = new ShaderMaterial({
    uniforms: uniform,
    vertexShader: `
      uniform float u_time;
      varying vec3 v_color;

      void main(){
        float curlAmount = sin(u_time * ${curl});
        vec3 newPosition = position;

        newPosition.y += curlAmount * sin(position.x * 0.4 + u_time)*2.0;

        newPosition.x += curlAmount * cos(position.y * 0.3 + u_time)*2.0;

        newPosition.z += curlAmount * cos(position.z * 0.2 + u_time)*2.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 u_color;
      uniform float u_time;
      uniform float u_glowIntensity;

      void main(){
        float flicker = 0.4 + 01.5 * sin(u_time*(sin(u_time*0.8)*0.2));
        vec3 glowColor = u_color * flicker * u_glowIntensity;

        gl_FragColor = vec4(glowColor, 0.5);
      }
    `,
    transparent: true,
    depthTest: true,
  });

  const line = new Line(geometry, material);

  return { line, uniform };
}
