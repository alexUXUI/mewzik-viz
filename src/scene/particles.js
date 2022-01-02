import * as THREE from "three";

// Make Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;

// x, y, z for all particles
const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

const pointsMaterial = new THREE.PointsMaterial({
  size: 0.1,
});

export const pointsMesh = new THREE.Points(particlesGeometry, pointsMaterial);

const particlePostionCount = pointsMesh.geometry.attributes.position.count;

const particlePositions = JSON.parse(
  JSON.stringify(pointsMesh.geometry.attributes.position.array)
);

export const animateParticles = (averageFrequency, frequencyData) => {
  const now = Date.now() / 300;

  const damping = 0.2;

  for (let i = 0; i < particlesCount * 3; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;
    positionArray[iy] = particlePositions[i] + averageFrequency * damping;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
};
