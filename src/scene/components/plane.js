import * as THREE from "three";

const SEPARATION = 100,
  AMOUNTX = 50,
  AMOUNTY = 50;

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
    positions[i + 1] = 0; // y
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

export function animatePointPlane() {
  const positions = particles.geometry.attributes.position.array;
  const scales = particles.geometry.attributes.scale.array;

  let i = 0;
  let j = 0;

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions[i + 1] =
        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;

      scales[j] =
        (Math.sin((ix + count) * 0.3) + 1) * 20 +
        (Math.sin((iy + count) * 0.5) + 1) * 20;

      i += 3;
      j++;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;
}
