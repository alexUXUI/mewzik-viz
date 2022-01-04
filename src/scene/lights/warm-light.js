import * as THREE from "three";
import { gui } from "../dat.gui.js";

const warmLightConfig = {
  x: 2,
  y: 3,
  z: 50,
  color: 0xff0000,
  intensityCoefficient: 0.1,
};

// INITIALIZE LIGHT
export const warmLight = new THREE.PointLight(warmLightConfig.color, 1, 100);

const { x, y, z } = warmLightConfig;

// SET LIGHT POSITION
warmLight.position.set(x, y, z);

// LIGHT HELPER
export const warmLightHelper = new THREE.PointLightHelper(warmLight, 2);

// Animation Function
export const animateWarmLight = (avgFrequencyData) => {
  warmLight.intensity = avgFrequencyData * warmLightConfig.intensityCoefficient;
};

// CONFIGURE LIGHT WITH DAT GUI
const config = gui.addFolder("Warm Light");

config.addColor(warmLightConfig, "color").onChange(function (value) {
  warmLight.color.set(value);
});

config.add(warmLightConfig, "x", -250, 250).onChange((x) => {
  warmLight.position.set(x, y, z);
});

config.add(warmLightConfig, "y", -250, 250).onChange((y) => {
  warmLight.position.set(x, y, z);
});

config.add(warmLightConfig, "z", -250, 250).onChange((z) => {
  warmLight.position.set(x, y, z);
});

config
  .add(warmLightConfig, "intensityCoefficient", 0, 1)
  .step(0.001)
  .onChange((value) => {
    warmLight.intensity = warmLight.intensity * value;
  });
