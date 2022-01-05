import * as THREE from "three";
import { gui } from "./dat.gui.js";

const particleFolder = gui.addFolder("Particles");

// Particle Configs
const particleConfig = {
  size: 0.1,
  show: true,
  sizeCoefficient: 10,
  deriveColorFromSound: false,
};

// Make Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 300;

// x, y, z for all particles
const positionArray = new Float32Array(particlesCount * 3);

// draw the initial positions of the particles
// we'll animate them based on this initial state
function drawPosition() {
  var segment = particlesCount * 2;
  var circleRadius = 7;
  var starRadius = 15;
  for (let i = 0; i < particlesCount * 3; i++) {
    drawCircle(i, circleRadius);
  }
}

// this will hydrate the position array
drawPosition();

// take the position array and set the positions on the geometry
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// helper to draw a star shape
function drawStar(i, radius) {
  const ix = i * 3;
  const iy = i * 3 + 1;
  const iz = i * 3 + 2;

  var x = radius * Math.cos(i);
  var y = radius * Math.sin(i);
  var z = 0;

  if (i % 2 === 0) {
    radius -= 1;
  }

  positionArray[ix] = x;
  positionArray[iy] = y;
  positionArray[iz] = z;
}

// helper to draw a cirlce shape
function drawCircle(i, radius) {
  const ix = i * 3;
  const iy = i * 3 + 1;
  const iz = i * 3 + 2;

  var x = radius * Math.cos(i);
  var y = 0;
  var z = radius * Math.sin(i);

  positionArray[ix] = x;
  positionArray[iy] = y;
  positionArray[iz] = z;
}

const loader = new THREE.TextureLoader();
// const shinyStar = loader.load("./shiny.png");

const pointsMaterial = new THREE.PointsMaterial({
  size: particleConfig.size,
  // map: shinyStar,
  transparent: true,
  color: "white",
  sizeAttenuation: true,
});

export const pointsMesh = new THREE.Points(particlesGeometry, pointsMaterial);

const particlePostionCount = pointsMesh.geometry.attributes.position.count;

const particlePositions = JSON.parse(
  JSON.stringify(pointsMesh.geometry.attributes.position.array)
);

export const animateParticles = (averageFrequency, frequencyData, color) => {
  const now = Date.now() / 3000;

  const damping = 4.2;

  var angle = ((2 * Math.PI) / particlesCount) * 3;

  for (let i = 0; i < particlesCount * 3; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;

    // const xsin = Math.sin(iy + now) + Math.sin(ix + now);
    const xsin = averageFrequency / 40 + damping;
    const ycos = averageFrequency / 40 + damping;
    const zsin = averageFrequency / 40 + damping;

    // set new positions
    positionArray[ix] = particlePositions[ix] * (xsin + ycos);
    positionArray[iy] = particlePositions[iy] * (xsin + ycos);
    positionArray[iz] = particlePositions[iz] * (xsin + ycos);
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );

  // if (particleConfig.deriveColorFromSound) {
  if (false) {
    pointsMesh.material.color = new THREE.Color(color);
  }

  // pointsMesh.material.size = averageFrequency / particleConfig.sizeCoefficient;
  pointsMesh.visible = particleConfig.show;
  pointsMesh.material.size = averageFrequency / 10;
  pointsMesh.material.needsUpdate = true;
};

particleFolder.add(particleConfig, "size", 0, 10).onChange(() => {
  pointsMesh.material.size = particleConfig.size;
});

particleFolder.add(particleConfig, "show").onChange(() => {
  pointsMesh.visible = particleConfig.show;
});

particleFolder.add(particleConfig, "sizeCoefficient").onChange(() => {
  pointsMesh.material.size = particleConfig.sizeCoefficient;
});

particleFolder.add(particleConfig, "deriveColorFromSound").onChange((value) => {
  particleConfig.deriveColorFromSound = value;
});
