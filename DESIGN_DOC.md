# Quantum Incubator

Key Questions:

<i>What does the audience come away with?</i>

"I'm intrigued and want to know more".

- [Quantum Incubator](#quantum-incubator)
  - [Processing Sketches](#processing-sketches)
    - [References:](#references)
    - [Sketch 1: Connection](#sketch-1-connection)
      - [Colours:](#colours)
      - [Geometries](#geometries)
    - [Sketch 2: Touchdesigner](#sketch-2-touchdesigner)
      - [Colours](#colours-1)
    - [Sketch 3: Complex Dimensions](#sketch-3-complex-dimensions)
  - [Bugs along the way:](#bugs-along-the-way)
    - [Three.js](#threejs)

## Processing Sketches

### References:

![alt text](<Screenshot 2025-01-22 at 20.22.57.png>)

![alt text](<Screenshot 2025-01-22 at 20.20.04.png>)

![alt text](<Screenshot 2025-01-22 at 20.19.08.png>)

<hr/>

### Sketch 1: Connection

<i>
"Two particles intertwined.
Born together. 
Perfectly correlated.

No matter how far apart you move them, they will stay connected."</i>

![alt text](<Screenshot 2025-01-22 at 20.19.08.png>)

#### Colours:

Light-blue: #a4e8ff
Blue: #4b99e9
Ice-blue: #3ee1f0

Purple: #aa34f1

Red: #e82b6d
Cherry: #cf1757

Green: #8ed63d

White: #effbff
Black: #1f1f1f

#### Geometries

[Atoms](https://threejs.org/docs/#api/en/geometries/SphereGeometry)

[Connection between particles](https://threejs.org/docs/#api/en/geometries/TubeGeometry)

</hr>

### Sketch 2: Touchdesigner

Hydrogen probability maps

![alt text](<Screenshot 2025-01-22 at 20.22.57.png>)

#### Colours

Note: the maps use a spectrum from black, to purple, to amber red, to orange, to yellow, to pale yellow, to yellow tinited white

Warm-Pale-Red: #d6483d

Mud-Orange: #df852c

Purple: #862cd5

Yellow: #edef17

Light-Yellow: #feffc7

Pale-Black: #1f1f1f

### Sketch 3: Complex Dimensions

<hr/>
<hr/>

## Bugs along the way:

### Three.js

![alt text](<Screenshot 2025-01-26 at 20.32.26.png>)

Resolution:

```javascript
<script type="module" src="script.js"></script>
```

The browser does not know that your Javascript file is using ES Modules. By default, browsers treat script files as regular scripts, which do not support import/export syntax unless explicitly told to do so.

Requires you tp sepcify in your script tag that the script is using ES Modules syntax, which allows the import/export.
