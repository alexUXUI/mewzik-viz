import * as THREE from "three";

const SEPARATION = 10,
  AMOUNTX = 16,
  AMOUNTY = 16;

let particles = 0;
let count = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const numParticles = AMOUNTX * AMOUNTY;

const positions = new Float32Array(numParticles * 3);
const scales = new Float32Array(numParticles);

let i = 0;
let j = 0;

for (let ix = 0; ix < AMOUNTX; ix++) {
  for (let iy = 0; iy < AMOUNTY; iy++) {
    positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
    positions[i + 1] = -140; // y
    positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

    scales[j] = 1;

    i += 3;
    j++;
  }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

const material = new THREE.PointsMaterial({
  size: 1,
  // map: shinyStar,
  transparent: true,
  color: "white",
  sizeAttenuation: true,
});

export const pointPlane = new THREE.Points(geometry, material);

const pointPostionCount = pointPlane.geometry.attributes.position.count;

const pointPositions = JSON.parse(
  JSON.stringify(pointPlane.geometry.attributes.position.array)
);

export function animatePointPlane(averageFrequency, frequencyData) {
  for (let i = 0; i < pointPostionCount; i++) {
    const iy = i * 3 + 1;

    // const xsin = averageFrequency / 40;
    // const ycos = averageFrequency / 40;

    // set new positions
    // positions[ix] = pointPositions[ix];
    positions[iy] = pointPositions[iy] + frequencyData[i] / 10;
    // positions[iz] = pointPositions[iz];
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // pointPlane.material.size = averageFrequency / particleConfig.sizeCoefficient;
  //   pointPlane.material.size = averageFrequency / 3;
  pointPlane.material.needsUpdate = true;
}
