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
