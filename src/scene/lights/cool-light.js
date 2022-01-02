import * as THREE from "three";
// import { gui } from "../dat.gui.js";

// LIGHT CONFIGS
const coolLightConfig = {
  x: -2,
  y: -3,
  z: -20,
  color: 0x3000ff,
};

// INITIALIZE LIGHT
export const coolLight = new THREE.PointLight(coolLightConfig.color, 1, 100);

const { x, y, z } = coolLightConfig;

// SET LIGHT POSITION
coolLight.position.set(x, y, z);

// LIGHT HELPER
export const coolLightHelper = new THREE.PointLightHelper(coolLight, 2);

// CONFIGURE LIGHT WITH DAT GUI
// const config = gui.addFolder("Cool Light");

// config.add(coolLight, "intensity", 0, 10).onChange((intensity) => {
//   coolLight.intensity = intensity;
//   coolLightHelper.update();
// });

// config.add(coolLightConfig, "x", -50, 50).onChange((x) => {
//   coolLight.position.set(x, y, z);
// });

// config.add(coolLightConfig, "y", -50, 50).onChange((y) => {
//   coolLight.position.set(x, y, z);
// });

// config.add(coolLightConfig, "z", -50, 50).onChange((z) => {
//   coolLight.position.set(x, y, z);
// });

// config.addColor(coolLightConfig, "color").onChange(function (value) {
//   coolLight.color.set(value);
// });
