// 3rd Party Libs
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

// LIGHTS
import {
  warmLightHelper,
  warmLight,
  animateWarmLight,
} from "./scene/lights/warm-light.js";

import {
  coolLightHelper,
  coolLight,
  animateCoolLight,
} from "./scene/lights/cool-light.js";
import { axesHelper, gridHelper } from "./scene/helpers.js";

// CAMERA
import { camera, rotateCameraAroundScene } from "./scene/camera.js";

// SCENE COMPONENTS
import {
  animateIcosahedron,
  icosahedron,
  renderIcosahedron,
} from "./scene/components/icosahedron.js";

// DATA TRANSFORMERS
import { prepareIcosahedron } from "./transformer/icosahedron.js";

// AUDIO
import { AudioManager, MicrophoneManager } from "./scene/audio.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// POST PROCESSING
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";

// Dat GUI
import { gui } from "./scene/dat.gui.js";

import { pointsMesh, animateParticles } from "./scene/particles.js";

// Renderer
export let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const makeRenderer = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
};

// Scene
export const scene = new THREE.Scene();

const sceneConfig = {
  ambientLight: 0xffffff,
  background: 0x000000,
  withHelpers: false,
  C: 0x32a852,
  "C#": 0x32a87d,
  D: 0x00ff00,
  "D#": 0x32a87d,
  E: 0x325fa8,
  F: 0x5532a8,
  "F#": 0x5532a8,
  G: 0x9232a8,
  "G#": 0xa83281,
  A: 0xa83281,
  "A#": 0xa83250,
  B: 0xa84432,
  smoothingCoefficient: 1,
};

let lastPlayedNotes = new Set();
let playedNotes = 0;

function getLastValue(set) {
  let value;
  for (value of set);
  return value;
}

// for every note we recieve, make sure we get X more like it before we return the new current note
// this is to prevent the note analzer from too much jittering
function getCurrentNote(note, smoothingCoefficient) {
  let currentNote = undefined;

  if (playedNotes < smoothingCoefficient) {
    lastPlayedNotes.add(note);
    playedNotes++;
    return currentNote;
  } else if (playedNotes === smoothingCoefficient) {
    currentNote = getLastValue(lastPlayedNotes);
    playedNotes = 0;
    lastPlayedNotes = new Set();
    return currentNote;
  }

  return "C";
}

export const runViz = () => {
  if (!renderer) {
    makeRenderer();
  }

  // Refs to audio and file HTML elements
  const file = document.getElementById("thefile");
  const audio = document.getElementById("audio");
  const audioManager = new AudioManager(audio);
  const analyser = audioManager.analyser();

  scene.background = new THREE.Color(sceneConfig.background);

  const controls = new OrbitControls(camera, renderer.domElement);

  // Adds lights to scene
  scene.add(warmLight);
  scene.add(coolLight);

  // Adds components to scene
  scene.add(icosahedron);

  // Add particle system to scene
  scene.add(pointsMesh);

  file.onchange = function () {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);

    audioManager.toggleMediaElement();

    var stopped;
    var requestId = 0;
    var starttime;

    function render(time) {
      if (!stopped) {
        requestId = window.requestAnimationFrame(render);

        // Create Audio Data
        const avgFrequencyData = analyser.getAverageFrequency();
        const frequencyData = analyser.getFrequencyData();

        // The note that is returned from the algo
        const { note } = analyser.getNote();

        // The note we want to send to the audio visualizer
        const currentNote = getCurrentNote(
          note,
          sceneConfig.smoothingCoefficient
        );

        // Generate a color from the current note
        const color = sceneConfig[currentNote];

        // Set the color of the background to the current note
        // scene.background.set(color);

        // Process Audio Data
        const { lowerHalfArray, upperHalfArray, lowerAvg, upperAvg } =
          prepareIcosahedron(frequencyData);

        // adjusts the intensity of the light based on the average frequency

        animateCoolLight(avgFrequencyData);

        animateWarmLight(avgFrequencyData);

        // Animates the icosahedron
        animateIcosahedron(avgFrequencyData, frequencyData);

        // Anitmates particles
        animateParticles(
          avgFrequencyData,
          frequencyData,
          color,
          scene.position
        );

        // Rotates the camera around the scene
        rotateCameraAroundScene(scene.position, camera);

        // renders the scene
        renderer.render(scene, camera);
      } else {
        cancelAnimationFrame(requestId);
      }
    }

    function start() {
      starttime = Date.now();
      requestId = window.requestAnimationFrame(render);
      stopped = false;
    }

    function stop() {
      if (requestId) {
        window.cancelAnimationFrame(requestId);
      }
      stopped = true;
    }

    window.stopAnimation = stop;

    start();
  };
};

const config = gui.addFolder("Scene");

config.add(sceneConfig, "withHelpers").onChange((value) => {
  if (value) {
    scene.add(axesHelper);
    scene.add(gridHelper);
    scene.add(warmLightHelper);
    scene.add(coolLightHelper);
  } else {
    scene.remove(axesHelper);
    scene.remove(gridHelper);
    scene.remove(warmLightHelper);
    scene.remove(coolLightHelper);
  }
});

config.addColor(sceneConfig, "background").onChange(function (value) {
  scene.background.set(value);
  const audioVisualizer = document.querySelector(".audioVisualizer");

  // convert value to hexadecimal
  const hex = value.toString(16);
  // add hash to hexadecimal
  const hexWithHash = "#" + hex;
  // set background color
  audioVisualizer.style.backgroundColor = hexWithHash;
});

// for all the notes, add the ability to change the color of the note in dat gui
let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
notes.forEach((note) => {
  config.addColor(sceneConfig, note).onChange(function (value) {
    const hex = value.toString(16);
    const hexWithHash = "#" + hex;
    sceneConfig[note] = hexWithHash;
  });
});

// add the smoothin coefficient to the dat gui
config
  .add(sceneConfig, "smoothingCoefficient")
  .min(1)
  .max(100)
  .step(0.1)
  .onChange(function (value) {
    sceneConfig.smoothingCoefficient = value;
  });

const resizeUpdateInterval = 500;

function setCanvasDimensions(canvas, width, height, set2dTransform = false) {
  const ratio = window.devicePixelRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  if (set2dTransform) {
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  }
}

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  setCanvasDimensions(renderer.domElement, width, height);
});
