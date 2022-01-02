import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { camera } from "./camera.js";
import { Renderer, renderer } from "./renderer.js";

// CONTROLS
export const controls = new OrbitControls(camera, renderer);
