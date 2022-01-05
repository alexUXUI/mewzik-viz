import * as THREE from "three";
import { gui } from "./dat.gui.js";

const ringFolder = gui.addFolder("Ring Points");

// Particle Configs
const ringConfig = {
  size: 0.1,
  show: true,
  sizeCoefficient: 10,
  deriveColorFromSound: false,
};

// Make Particle System
const ringGeometry = new THREE.BufferGeometry();
const ringPointStartingCount = 300;

// x, y, z for all particles
const positionArray = new Float32Array(ringPointStartingCount * 3);

// draw the initial positions of the particles
// we'll animate them based on this initial state
function drawPosition() {
  var segment = ringPointStartingCount * 2;
  var circleRadius = 17;
  for (let i = 0; i < ringPointStartingCount * 3; i++) {
    drawCircle(i, circleRadius);
  }
}

// this will hydrate the position array
drawPosition();

// take the position array and set the positions on the geometry
ringGeometry.setAttribute(
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
  var y = 0 + 50;
  var z = radius * Math.sin(i);

  positionArray[ix] = x;
  positionArray[iy] = y;
  positionArray[iz] = z;
}

const loader = new THREE.TextureLoader();
const shinyStar = loader.load("./shiny.png");

const ringMaterial = new THREE.PointsMaterial({
  size: 1,
  //   map: shinyStar,
  transparent: true,
  color: "white",
  sizeAttenuation: true,
});

export const ringMesh = new THREE.Points(ringGeometry, ringMaterial);

const ringPositionCount = ringMesh.geometry.attributes.position.count;

const ringPointPositions = JSON.parse(
  JSON.stringify(ringMesh.geometry.attributes.position.array)
);

export const animateRing = (averageFrequency, frequencyData, color) => {
  const now = Date.now() / 300;

  const damping = 4.2;

  var angle = ((2 * Math.PI) / ringPointStartingCount) * 3;

  for (let i = 0; i < ringPointStartingCount * 3; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;

    const xsin = Math.sin(iy + now) + Math.sin(ix + now);
    // const xsin = averageFrequency / 40 + damping;
    const ycos =
      Math.sin(iy + now) + Math.sin(ix + now) * (averageFrequency / 10);
    const zsin = averageFrequency / 40 + damping;

    // set new positions
    positionArray[ix] = ringPointPositions[ix] * (xsin + ycos);
    positionArray[iy] = ringPointPositions[iy] * (xsin + ycos);
    positionArray[iz] = ringPointPositions[iz] * (xsin + ycos);
  }

  ringGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );

  // if (ringConfig.deriveColorFromSound) {
  if (false) {
    ringMesh.material.color = new THREE.Color(color);
  }

  // ringMesh.material.size = averageFrequency / ringConfig.sizeCoefficient;
  ringMesh.visible = ringConfig.show;
  ringMesh.material.size = averageFrequency / 10;
  ringMesh.material.needsUpdate = true;
};

ringFolder.add(ringConfig, "size", 0, 10).onChange(() => {
  ringMesh.material.size = ringConfig.size;
});

ringFolder.add(ringConfig, "show").onChange(() => {
  ringMesh.visible = ringConfig.show;
});

ringFolder.add(ringConfig, "sizeCoefficient").onChange(() => {
  ringMesh.material.size = ringConfig.sizeCoefficient;
});

ringFolder.add(ringConfig, "deriveColorFromSound").onChange((value) => {
  ringConfig.deriveColorFromSound = value;
});
