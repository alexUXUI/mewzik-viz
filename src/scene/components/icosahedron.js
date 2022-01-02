import * as THREE from "three";
import { gui } from "../dat.gui.js";
import { scene } from "../../index.js";
import { camera } from "../camera.js";

// Icosahedron Default Configs
const config = {
  xAngleFunction: "sin",
  yAngleFunction: "cos",
  size: 10,
  detail: 10,
  geometry: ["IcosahedronBufferGeometry", "DodecahedronBufferGeometry"],
  selectedGeometry: 0,
  damping: 1,
  waveCoefficient: 3,
  timeCoefficient: 300,
};

const { geometry: cGeometry, selectedGeometry, size, detail } = config;

// Geometry
const geometry = new THREE[cGeometry[selectedGeometry]](size, detail);

// Material https://medium.com/geekculture/threejs-tutorial-comparing-the-most-common-materials-424eef8942a4
var pinkMat = new THREE.MeshPhongMaterial({
  color: new THREE.Color("rgb(100,100,100)"),
  emissive: new THREE.Color("rgb(10,10,10)"),
  transparent: 1,
  opacity: 1,
  shininess: 100,
});

// Icosahedron Object (Mesh = Geometry + Material)
export const icosahedron = new THREE.Mesh(geometry, pinkMat);

/**
 * ICOSAHEDRON ATTRIBUTES
 * Used to get / organize the data associated with the icosahedron
 * This data includes the vertices, and normals of the icosahedron
 */
const count = icosahedron.geometry.attributes.position.count;

/**
 * Normals: The values in this attribute are used to find out what the direction
 * is of each point of each triangle in an instance of buffer geometry
 * https://dustinpfister.github.io/2021/06/08/threejs-buffer-geometry-attributes-normals/
 */
const position = JSON.parse(
  JSON.stringify(icosahedron.geometry.attributes.position.array)
);

/**
 * Postions: it is an array that holds all the values of each point in space
 * https://dustinpfister.github.io/2021/06/07/threejs-buffer-geometry-attributes-position/
 **/
const normals = JSON.parse(
  JSON.stringify(icosahedron.geometry.attributes.normal.array)
);

// Animate
export function animateIcosahedron(avgFrequency, frequencyData) {
  const {
    waveCoefficient,
    damping,
    xAngleFunction,
    yAngleFunction,
    timeCoefficient,
  } = config;

  const {
    geometry: { attributes },
  } = icosahedron;

  // console.log(avgFrequency);

  const now = Date.now() / timeCoefficient;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;

    // use uvs to calculate wave
    const uX =
      (attributes.uv.getX(i) * Math.PI * avgFrequency) / waveCoefficient;
    const uY =
      (attributes.uv.getY(i) * Math.PI * avgFrequency) / waveCoefficient;

    // calculate current vertex wave height
    const xangle = uX + now;
    const xsin = Math[xAngleFunction](xangle) * damping;

    const yangle = uY + now;
    const ycos = Math[yAngleFunction](yangle) * damping;

    // set new position
    attributes.position.setX(i, position[ix] + normals[ix] * (xsin + ycos));
    attributes.position.setY(i, position[iy] + normals[iy] * (xsin + ycos));
    attributes.position.setZ(i, position[iz] + normals[iz] * (xsin + ycos));
  }

  icosahedron.geometry.computeVertexNormals();
  attributes.position.needsUpdate = true;
}

icosahedron.position.set(0, 0, 0);

// Dat GUI config
const icosahedronFolder = gui.addFolder("Icosahedron");
// Function to update the vertice positions
const angleOptions = {
  sin: "sin",
  cos: "cos",
  tanh: "tanh",
  tan: "tan",
};

icosahedronFolder.add(config, "xAngleFunction", angleOptions);
icosahedronFolder.add(config, "yAngleFunction", angleOptions);
icosahedronFolder.add(config, "damping").min(0).max(10).step(0.1);
icosahedronFolder.add(config, "waveCoefficient").min(0).max(10).step(0.1);
