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
