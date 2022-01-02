import * as THREE from "three";

// Shows an Axis in the middle of the scene
export const axesHelper = new THREE.AxesHelper(50);

// Shows a grid pane in the scene
export const gridHelper = new THREE.GridHelper(100, 10);

// Takes an object and shows if the camera is looking at it
export const cameraHelper = (obj) => new THREE.CameraHelper(obj);
