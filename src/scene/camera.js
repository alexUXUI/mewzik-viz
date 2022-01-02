import * as THREE from "three";
import { gui } from "./dat.gui";

// const config = gui.addFolder("Camera");
// config.open();

// Camera defaults configs
const cameraConfig = {
  fieldOfView: 50,
  aspectRatio: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 10000,
  x: 0,
  y: 20,
  z: 35,
};

const { fieldOfView, aspectRatio, near, far, x, y, z } = cameraConfig;

// Create new camera
export const camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  near,
  far
);

// Set camera position
camera.position.set(x, y, z);

// Animation Function that moves the camera 360 degrees around a focal point
// (Gets called this in the animation loop)
export const rotateCameraAroundScene = (focalPoint, camera) => {
  let angle = 0;
  let radius = 20;
  let rotationSpeed = 0.002;

  let x = camera.position.x;
  let y = camera.position.y;
  let z = camera.position.z;

  camera.position.x = x * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed);
  camera.position.z = z * Math.cos(rotationSpeed) - x * Math.sin(rotationSpeed);

  camera.lookAt(focalPoint);
};

// // Expose Camera Configs through Dat.GUI
// config.add(cameraConfig, "fieldOfView", 2, 200).onChange((value) => {
//   camera.fov = value;
//   camera.updateProjectionMatrix();
// });

// config.add(cameraConfig, "aspectRatio", 0.1, 10).onChange((value) => {
//   camera.aspect = value;
//   camera.updateProjectionMatrix();
// });

// config.add(cameraConfig, "near", 0.1, 100).onChange((value) => {
//   camera.near = value;
//   camera.updateProjectionMatrix();
// });

// config.add(cameraConfig, "far", 0.1, 100).onChange((value) => {
//   camera.far = value;
//   camera.updateProjectionMatrix();
// });

// config.add(cameraConfig, "x", -100, 100).onChange((value) => {
//   camera.position.x = value;
// });

// config.add(cameraConfig, "y", -100, 100).onChange((value) => {
//   camera.position.y = value;
// });

// config.add(cameraConfig, "z", -100, 100).onChange((value) => {
//   camera.position.z = value;
// });
