# Quantum Incubator

To run the projects:

```bash
npm vite
```

or

```bash
# npm run to check all available scripts
npm run start
```

This will start a local server which you can then use to view your three.js scene.

## Music

For two particles think Spaceline, Joel Vandroogenbroeck (or Minor, or Industrial Retrospective, or Sherzo Rustico)

## Mapping a Line Point to a Sphere's

The coordinate systems used between spheres (meshs) and lines are the same but the way the positions are stored and used in Three.js differs between them.

Key Differences in Coordinates:

1. Line Coordinates (BufferGeometry)
   - Lines are made up of vertices stored in a position attribute array
   - Each vertex is defined as (x,y,z) and directly modified in the array
   - Example of accessing/modifying the second point's Y coordinate:

```javascript
const position = line.geometry.attributes.position;
position.array[4] = newY; // Modifies the Y value of the second vertex
position.needsUpdate = true;
```

2. Sphere (Mesh) Coordinates (Mesh.position)
   - Spheres (or any Mesh) are objects in the scene
   - Their position is controlled by mesh.position.set(x,y,z), affecting the whole object
   - Example of moving a sphere:

```javascript
sphere.position.y = newY;
```

If you animate a sphere, you update its position (object-level transformation)

If you animate a point in a line, you update its vertex position inside geometry buffer.

So if you're trying to match a sphere's movement to a line point, you'll need to update

```javascript
sphere.position.set(
    line.geomtry.attributes.position.array[3]; // X of second point
    line.geomtry.attributes.position.array[4]; // Y of second point
    line.geomtry.attributes.position.array[5]; // Z of second point
)
```

### Animating Multiple Points in a Line Geometry

You can animate multiple poitns by modifying different indices in the position.array. Each point consists of three values (X, Y ,Z) and their indices follow:

```psql
Index 0 → X (point 1)
Index 1 → Y (point 1)
Index 2 → Z (point 1)

Index 3 → X (point 2)
Index 4 → Y (point 2)
Index 5 → Z (point 2)

Index 6 → X (point 3)
Index 7 → Y (point 3)
Index 8 → Z (point 3)
```

So, if you want to animate the third point (index 2) =, you modify position.array[6], position.array[7], position.array[8].

## Using Bezier Curves:

### 2D vs 3D Bezier Curve

Defining a new curve with Vector2 will render a 2D curve:

```javascript
const curve = new THREE.CubicBezierCurve(
  new THREE.Vector2(-20, 0),
  new THREE.Vector2(-10, 15),
  new THREE.Vector2(10, 15),
  new THREE.Vector2(20, 0)
);
```

Note: There will be no Z value in the attributes of these vectors as it is 2D

Defining a new curve with Vector3 will render a 3D curve:

```javascript
const curve3D = new THREE.CubicBezierCurve3(
  new THREE.Vector3(-20, 0, 0),
  new THREE.Vector3(-10, 15, 10),
  new THREE.Vector3(10, 15, -10),
  new THREE.Vector3(20, 0, 0)
);

const point3D = curve3D.getPoint(0.5);
console.log(point3D); // Vector3 { x: ..., y: ..., z: ... }
```

### .getPoints()

```javascript
const points = curve.getPoints(50); // Generates 51 points (including start & end)
```

Difference between .getPoints(t) vs .getPoints(n)

```javascript
// .getPoint(t) : between 0 and 1 (float)
//
const midpoint = curve.getPoint(0.5);

// .getPoints(n) : number
// returns an array of n + 1 points that are evenly distributed along the curve
const points = curve.getPoints(50);
console.log(points.length); // 51 ( 0 to 50)
console.log(points[25]); // Roughly the midpoint of the curve
```

![alt text](<Screenshot 2025-02-15 at 17.51.04.png>)

Here the points of the bezier curve are defined but the the animation function alters the final points of the curve, attaching them to the spheres:
![alt text](<Screenshot 2025-02-15 at 18.03.40.png>)

![alt text](<Screenshot 2025-02-15 at 18.04.37.png>)

![alt text](<Screenshot 2025-02-15 at 18.04.49.png>)

So the curve still remain intact and unmoved in the center but there are stretch points between that curve and where the sphere start

### Archimedes Spiral

```javascript
// Spiral:
// const a = 0;
// const b = 0.5;
// const numPoints = 500;
// const maxTheta = 10 * Math.PI;

// const somePoints = [];
// for (let i = 0; i < numPoints; i++) {
//   let theta = (i / numPoints) * maxTheta;
//   let x = (a + b * theta) * Math.cos(theta);
//   let y = (a + b * theta) * Math.sin(theta);

//   switch (i % 2) {
//     case 0:
//       somePoints.push(x);
//       break;
//     case 1:
//       somePoints.push(y);
//       break;
//   }
// }
```

### Relationship Between the Two Spheres:

Imagine you have two circles:

(A)

(B)

Now draw a line between them:

(A)--------(B)

Now draw eight nodes within that line

(A)-()-()-()-()-()-()-()-()-(B)

So Node A and Node B are 100% of the values of the two spheres (which are dynamically oscillating on XYZ axis)

So each node that is further away from one Sphere is less of that sphere and more of the other - for example:

(A)-(n1)-(n2)-(n3)-(n4)-(n5)-(n6)-(n7)-(n8)-(B)

n0 = A (100% A)
n1 = 0.9A, 0.1B
n2 = 0.8A, 0.2B
n3 =
n4 =
n5 =
n6 =
n7 =
n8 =
n9 = B (100% B)

To get the resultant vector you must add the two vectors together:

90% of A + 10% of B

```javascript
linePos.array[i] = sphere1XYZ.x * 0.9 + sphere2XYZ.x * 0.1;
```

    You must multiply sphere1 X by the lineNode length and times it by the length minus the number node it is currently at within the iteration of the line. This must be done for all XYZs - you must then add it to the sphere2 X divided by the lineNode length and times it by number node it is (to get 90% sphere1 and 10% sphere2)

### Introducing lerp()

```javascript
for (let i = 0; i < lineNodes.length; i += 3) {
  let t = i / lineNodes.length; // Normalized position (0 to 1)

  lineNodes[i] = THREE.MathUtils.lerp(sphere1XYZ.x, sphere2XYZ.x, t);
  lineNodes[i + 1] = THREE.MathUtils.lerp(sphere1XYZ.y, sphere2XYZ.y, t);
  lineNodes[i + 2] = THREE.MathUtils.lerp(sphere1XYZ.z, sphere2XYZ.z, t);
}
```

lerp() stands for Linear Interpolation. It is a mathematical function that smoothly transitions between two values based on a weight t, which is typically between 0 and 1.

Equation:
Lerp(A,B,t)=A+(B−A)×t

Where:

A = start value (here: sphere1XYZ)
B = end value (here: sphere2XYZ)
t = interpolation factor (ranges from 0 to 1)
As t goes from 0 → 1, the result moves from A → B smoothly.

How it works here:
Loop Through lineNodes[]

i increases by 3 each time to update x, y, z coordinates.
This means each loop iteration creates one 3D point.
Calculate t (Position Along the Line)

t = i / lineNodes.length smoothly scales from 0 (start) to 1 (end).
At the beginning (i = 0), t = 0 → the point is at sphere1XYZ.
At the end (i = lineNodes.length), t = 1 → the point is at sphere2XYZ.
Interpolate Each Coordinate Separately

lerp(sphere1XYZ.x, sphere2XYZ.x, t) moves x between the two spheres.
Same for y and z.

Why Does This Create a "String" Between the Two Spheres?

Each iteration calculates a new point between the two spheres.
The points are evenly spaced because t is increasing linearly.
When plotted in 3D, these points form a straight line from sphere1XYZ to sphere2XYZ.
When used in Three.js' BufferGeometry, this list of points creates a smooth interpolated line between the two spheres.

### Custom Shader

```javascript
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
```

This code defines a custom shader in Three.js using GLSL (OpenGL Shading Language). Shaders are special programs that run directly on the GPU and control how objects are drawn on the screen.

It consists of two main parts:

Vertex Shader – Controls the position of each point (vertex) of an object.

Fragment Shader – Controls the color of each pixel of the object.

[ln 264]()

<hr/>

What is this code doing?
This code defines a custom shader in Three.js using GLSL (OpenGL Shading Language). Shaders are special programs that run directly on the GPU and control how objects are drawn on the screen.

It consists of two main parts:

Vertex Shader – Controls the position of each point (vertex) of an object.

Fragment Shader – Controls the color of each pixel of the object.

Breaking it Down
Step 1: Creating a Shader Material

```javascript
const material = new ShaderMaterial({});
```

This tells Three.js that we're creating a custom material that will use our own shaders instead of the built-in ones.
`
Step 2: Defining Uniforms

```javascript
uniforms: {
u_time: { value: 0.0 },
}
```

A uniform is a variable that stays the same for the entire object during a single frame.

u_time is a float (number) that represents time and will be updated in Three.js.

This allows us to create animations based on time.

<hr/>

Vertex Shader (Controls Position of Each Point)

```javascript
vertexShader: `
varying vec3 v_pos;
varying vec3 v_pos;
```

varying means this variable will be passed from the vertex shader to the fragment shader.

vec3 means it's a 3D vector (a set of three numbers).

v_pos will store the position of the vertex and send it to the fragment shader. Is v_pos just a name given or is it a convention?

```javascript
void main() {
v_pos = position;
```

<code>
void main() 
</code>→ The main function that runs for every single point (vertex) in the object.
<br/>
<br/>
<code>position</code> → A built-in variable that holds the position of the current vertex.
<br/>
<br/>
<code>v_pos = position;</code> → Store this position in v_pos so we can use it later in the fragment shader.

```javascript
vec4 modelViewPosition = modelViewMatrix \* vec4(position,1.0);
```

Converts the position of the vertex from local space (relative to the object) to camera space (relative to the viewer).

<code>modelViewMatrix</code> is a built-in matrix that transforms the position.

<code>vec4(position, 1.0)</code> converts the vec3 position into a vec4 (needed for matrix operations).

```javascript
gl_Position = projectionMatrix \* modelViewPosition;
}
```

<code>projectionMatrix</code> converts the camera-space position into screen space, so it knows where to draw on the screen.

<code>gl_Position</code> is a special built-in variable that tells OpenGL where to place the vertex on the screen.

Fragment Shader (Controls Pixel Colors)

```javascript
fragmentShader: `
uniform float u_time;
varying vec3 v_pos;
```

<code>uniform float u_time;</code>
→ We are receiving the time variable from Three.js.

<code>varying vec3 v_pos;</code> → We get the position from the vertex shader.

Hash Function

```javascript
vec3 hash3d(vec3 p){
p = fract(p * vec3(443.897, 441.423, 437.195));
p += dot(p, p.yxz + 19.19);
return fract(vec3(p.x*p.y, p.y*p.z, p.z*p.x));
}
```

This function generates a random-looking 3D value based on an input position <code>p</code>.

<code>fract()</code> keeps only the decimal part of a number (removes the integer part).

<code>dot()</code> calculates a single number based on the multiplication of two vectors.

This function is used later to create the Voronoi pattern.

Voronoi Noise Function

```javascript
vec2 voronoi(in vec3 x, in float time){
vec3 n = floor(x);
vec3 f = fract(x);
vec4 m = vec4(8.0);
```

This function creates a Voronoi noise pattern, which looks like a mosaic or cracked surface.

<code>n = floor(x);</code> → Gets the integer part of the position, treating space like a grid.

<code>f = fract(x);</code> → Gets the fractional part, which is the offset within each grid cell.

<code>vec4 m = vec4(8.0);</code> → A helper variable to store the closest Voronoi cell.

Loop Through Nearby Points

```javascript
for(int k=-1;k<=1;k++){
for(int j=-1; j<=1;j++){
for(int i=-1; i<=1; i++){
```

These loops check all neighboring grid cells (a 3×3×3 cube of cells around the current position).

This is necessary because Voronoi noise depends on which nearby cell is closest.

Calculate Distance to Randomized Grid Points

```javascript
vec3 g = vec3(float(i),float(j),float(k));
vec3 o = hash3d(n + g);
vec3 r = g + (0.5+0.5*sin(vec3(time)+6.2831*o)) - f;
float d = dot(r,r);
```

<code>g</code> is the current grid cell being checked.

<code>o = hash3d(n + g);</code> generates a random offset for each cell.

<code>r</code> calculates the distance from the current point to this random offset point.

<code>d = dot(r,r);</code> computes the squared distance.

Find the Closest Cell

```javascript
if (d < m.x) {
  m = vec4(d, o);
}
```

If this cell is closer than the previous closest one, store it.

Return Voronoi Noise Values

```javascript
return vec2(m.x, m.y + m.z + m.w);
}
```

<code>m.x</code> contains the distance to the nearest cell.

<code>m.y + m.z + m.w</code> provides extra randomization for shading.

Final Pixel Color Calculation

```javascript
void main() {
vec2 res = voronoi(v*pos * 3.0, u*time * 0.3);
gl_FragColor = vec4(vec3(res.x), 1.0);
}
```

<code>v_pos \* 3.0</code> scales up the Voronoi pattern.

<code>u_time \* 0.3</code> makes the pattern animate over time.

<code>gl_FragColor = vec4(vec3(res.x), 1.0);</code>

Uses the Voronoi distance value (res.x) to control brightness.

Converts it to grayscale and sets it as the final pixel color.

What Does This Shader Do?
It renders a Voronoi noise pattern on an object in Three.js.

The pattern animates over time, creating a dynamic effect.

It can be used for textures, procedural materials, or visual effects.
