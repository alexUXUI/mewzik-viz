import * as THREE from "three";
import * as TWEEN from "tween";

const originalScales = [];

export function prepareCubes() {
  const cubes = [];

  let SEPARATION = 5;

  let i = 0;
  let j = 0;

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      const geometry = new THREE.BoxGeometry(5, 5, 5);
      const material = new THREE.MeshBasicMaterial({
        // generate a new HSL color for each cube in the color of a rainbow
        color: new THREE.Color(`hsl(${(x / 16) * 360}, 100%, ${y * 4}%)`),
      });
      const cube = new THREE.Mesh(geometry, material);
      // position the cube in a grid, using the x & y loop variables

      cube.position.x = x * SEPARATION - (16 * SEPARATION) / 2; // x
      cube.position.y = 40; // y
      cube.position.z = y * SEPARATION - (16 * SEPARATION) / 2; // z

      originalScales.push([cube.scale.x, cube.scale.y, cube.scale.z]);

      cubes.push(cube);

      i += 3;
      j++;
    }
  }

  return cubes;
}

export const cubes = prepareCubes();

export function animateCubes(frequencyData) {
  for (let i = 0; i < 256; i++) {
    const cube = cubes[i];
    const originalScale = originalScales[i];
    scaleY(cube, frequencyData[i] / 30);
  }
}

function scaleY(mesh, scale) {
  mesh.scale.y = scale;
  if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
  var height =
    mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;
  //height is here the native height of the geometry
  //that does not change with scaling.
  //So we need to multiply with scale again
  mesh.position.y = (height * scale) / 2;
}
