import * as THREE from "three";
import { gui } from "../dat.gui.js";

// LIGHT CONFIGS
const coolLightConfig = {
  x: -2,
  y: -3,
  z: -50,
  color: 0x3000ff,
  intensityCoefficient: 0.1,
};

// INITIALIZE LIGHT
export const coolLight = new THREE.PointLight(coolLightConfig.color, 1, 100);

const { x, y, z } = coolLightConfig;

// SET LIGHT POSITION
coolLight.position.set(x, y, z);

// LIGHT HELPER
export const coolLightHelper = new THREE.PointLightHelper(coolLight, 2);

// Animation Function
export const animateCoolLight = (avgFrequencyData) => {
  coolLight.intensity = avgFrequencyData * coolLightConfig.intensityCoefficient;
};

// CONFIGURE LIGHT WITH DAT GUI
const config = gui.addFolder("Cool Light");

config.addColor(coolLightConfig, "color").onChange(function (value) {
  coolLight.color.set(value);
});

config.add(coolLightConfig, "x", -250, 250).onChange((x) => {
  coolLight.position.set(x, y, z);
});

config.add(coolLightConfig, "y", -250, 250).onChange((y) => {
  coolLight.position.set(x, y, z);
});

config.add(coolLightConfig, "z", -250, 250).onChange((z) => {
  coolLight.position.set(x, y, z);
});

config
  .add(coolLightConfig, "intensityCoefficient", 0, 1)
  .step(0.001)
  .onChange((value) => {
    coolLight.intensity = coolLight.intensity * value;
  });
