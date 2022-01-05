import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const loader = new GLTFLoader();

import { scene } from "../index.js";

export function prepareTree(avgFrequencyData) {
  return loader.load(
    "tree.glb",
    function (gltf) {
      gltf.scene.traverse(function (child, i) {
        // if (child.isMesh) {
        //   child.material.color.setHex(0xffffff);
        //   child.material.metalness = 0.5;
        //   child.material.roughness = 0.5;
        //   child.material.envMapIntensity = 1;
        //   child.material.envMap = cubeTexture;
        // }

        const children = gltf.scene.children;

        if (child.isMesh) {
          child.material.color.setHex(0xffffff);
          child.material.metalness = 0.5;
          child.material.roughness = 0.5;
          child.material.envMapIntensity = 1;
          child.position.set(-90, 0, 0);

          console.log(child.geometry.attributes);
        }
      });

      scene.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}
