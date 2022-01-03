import * as THREE from "three";
import { gui } from "../dat.gui.js";

const warmLightConfig = {
  x: 2,
  y: 3,
  z: 20,
  color: 0xff0000,
  intensityCoefficient: 0.1,
};

export const warmLight = new THREE.PointLight(warmLightConfig.color, 1, 100);

const { x, y, z } = warmLightConfig;

warmLight.position.set(x, y, z);

export const warmLightHelper = new THREE.PointLightHelper(warmLight, 2);

// Animation Function
export const animateWarmLight = (avgFrequencyData) => {
  warmLight.intensity = avgFrequencyData * warmLightConfig.intensityCoefficient;
};

const config = gui.addFolder("Warm light");

config.addColor(warmLightConfig, "color").onChange(function (value) {
  warmLight.color.set(value);
});

config.add(warmLightConfig, "x", -10, 10).onChange((x) => {
  warmLight.position.set(x, y, z);
});

config.add(warmLightConfig, "y", -10, 10).onChange((y) => {
  warmLight.position.set(x, y, z);
});

config.add(warmLightConfig, "z", -10, 10).onChange((z) => {
  warmLight.position.set(x, y, z);
});

config
  .add(warmLightConfig, "intensityCoefficient", 0, 10)
  .step(0.1)
  .onChange((value) => {
    warmLight.intensity = warmLight.intensity * value;
  });
