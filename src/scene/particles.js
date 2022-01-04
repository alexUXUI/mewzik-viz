import * as THREE from "three";
import { gui } from "./dat.gui.js";

const particleFolder = gui.addFolder("Particles");

// Particle Configs
const particleConfig = {
  size: 0.1,
  show: true,
  sizeCoefficient: 10,
  deriveColorFromSound: true,
  transparent: true,
};

// Make Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 600;

// x, y, z for all particles
const positionArray = new Float32Array(particlesCount * 3);

function calculateCircumference(radius) {
  return Math.PI * (radius + radius);
}

calculateCircumference(1);

var segment = particlesCount * 2;
var radius = 1000;

var angle = (20 * Math.PI) / segment;

var half = particlesCount / 3;

for (let i = 0; i < particlesCount * 3; i++) {
  const ix = i * 3;
  const iy = i * 3 + 1;
  const iz = i * 3 + 2;

  var x = radius * Math.cos(i);
  var y = radius * Math.sin(i);
  var z = 0;

  // if (i < half) {
  //   z = radius * Math.sin(i);
  //   y = 0;
  // }

  // good one
  // positionArray[i] = Math.sin((Math.random() - 0.5) * 100) * 100;

  // experimental
  // let val1 = Math.sin(i * (Math.PI / 180)) * 100;
  // let val2 = Math.cos(i * (Math.PI / 180)) * 100;
  // let val3 = Math.tan(i * (Math.PI / 180)) * 100;

  // positionArray[ix] = val1;
  // positionArray[iy] = val2;
  // positionArray[iz] = val3;

  if (i % 2 === 0) {
    radius -= 1;
  }

  positionArray[ix] = x;
  positionArray[iy] = y;
  positionArray[iz] = z;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// var particleTexture = THREE.ImageUtils.loadTexture('./box.png');

const loader = new THREE.TextureLoader();
const shinyStar = loader.load("./shiny.png");

const pointsMaterial = new THREE.PointsMaterial({
  size: particleConfig.size,
  map: shinyStar,
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

    // var x = radius * Math.cos(angle * i);
    // var y = radius * Math.sin(angle * i);

    // calculate current vertex wave height
    // const xsin = Math.sin(now) * damping;
    // const ycos = Math.cos(now) * damping;

    // const xsin = Math.sin(averageFrequency);
    const xsin = averageFrequency / damping / 200;
    const ycos = averageFrequency / damping / 200;
    const zangle = Math.tan(now) * damping;
    // set new positions
    positionArray[ix] = particlePositions[ix] * (xsin + ycos);
    positionArray[iy] = particlePositions[iy] * (xsin + ycos);
    positionArray[iz] = particlePositions[iz] * zangle;

    // positionArray[ix] = particlePositions[ix] * (x + y);
    // positionArray[iy] = particlePositions[iy] * (x + y);
    // positionArray[iz] = particlePositions[iz] * (xsin + ycos);
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );

  if (particleConfig.deriveColorFromSound) {
    pointsMesh.material.color = new THREE.Color(color);
  }

  // pointsMesh.material.size = averageFrequency / particleConfig.sizeCoefficient;
  pointsMesh.visible = particleConfig.show;
  pointsMesh.material.size = averageFrequency / 3;
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
