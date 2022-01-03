import * as THREE from "three";
import { gui } from "./dat.gui.js";

const particleFolder = gui.addFolder("Particles");

// Particle Configs
const particleConfig = {
  size: 2.1,
  show: false,
  sizeCoefficient: 10,
  deriveColorFromSound: true,
};

// Make Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;

// x, y, z for all particles
const positionArray = new Float32Array(particlesCount * 3);

function calculateCircumference(radius) {
  return Math.PI * (radius + radius);
}

calculateCircumference(1);
let radius = 10000;

for (let i = 0; i < particlesCount * 3; i++) {
  const ix = i * 3;
  const iy = i * 3 + 1;
  const iz = i * 3 + 2;

  // good one
  // positionArray[i] = Math.sin((Math.random() - 0.5) * 100) * 100;

  // experimental
  let val1 = Math.sin(i * (Math.PI / 180)) * 100;
  let val2 = Math.cos(i * (Math.PI / 180)) * 100;
  let val3 = Math.tan(i * (Math.PI / 180)) * 100;

  positionArray[ix] = val1;
  positionArray[iy] = val2;
  positionArray[iz] = val3;
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
});

export const pointsMesh = new THREE.Points(particlesGeometry, pointsMaterial);

const particlePostionCount = pointsMesh.geometry.attributes.position.count;

const particlePositions = JSON.parse(
  JSON.stringify(pointsMesh.geometry.attributes.position.array)
);

export const animateParticles = (averageFrequency, frequencyData, color) => {
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

  if (particleConfig.deriveColorFromSound) {
    console.log("enable");
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
