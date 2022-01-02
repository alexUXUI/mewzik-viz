import * as THREE from "three";

// CREATE CUBE
function createCube() {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });

  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

export const cube = createCube();

// ATTRIBUTES
const count = cube.geometry.attributes.position.count;

const position = JSON.parse(
  JSON.stringify(cube.geometry.attributes.position.array)
);

const normals = JSON.parse(
  JSON.stringify(cube.geometry.attributes.normal.array)
);

const damping = 0.2;

// ANIMATE CUBE
export function animateCube() {
  const {
    geometry: { attributes },
  } = cube;

  const now = Date.now() / 300;
  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;

    // use uvs to calculate wave
    const uX = attributes.uv.getX(i) * Math.PI * 6;
    const uY = attributes.uv.getY(i) * Math.PI * 6;

    // calculate current vertex wave height
    const xangle = uX + now;
    const xsin = Math.sin(xangle) * damping;

    const yangle = uY + now;
    const ycos = Math.cos(yangle) * damping;

    // set new position
    attributes.position.setX(i, position[ix] + normals[ix] * (xsin + ycos));
    attributes.position.setY(i, position[iy] + normals[iy] * (xsin + ycos));
    attributes.position.setZ(i, position[iz] + normals[iz] * (xsin + ycos));
  }

  cube.geometry.computeVertexNormals();
  attributes.position.needsUpdate = true;
}
