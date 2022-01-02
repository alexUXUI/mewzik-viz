import * as React from "react";
import { useAudioVisualizer } from "./hooks/visualizer.hook";
import { makeRenderer } from "../index";
import Link from "next/link";

import "../../styles/audioviz.module.css";

export const AudioVisualizer = () => {
  const [file, setFile] = React.useState(undefined);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);

  useAudioVisualizer();

  React.useEffect(() => {
    // look for canvasas in the DOM and if there are none, run the makeRenderer function
    const canvas = document.getElementsByTagName("canvas");
    if (canvas.length === 0) {
      makeRenderer();
    }

    // find any dat gui elements and unhide them
    const gui = document.getElementsByClassName("dg");
    for (let i = 0; i < gui.length; i++) {
      gui[i].style.visbility = "visible";
    }
  }, []);

  let style = !isAudioPlaying ? "cta" : "";

  return (
    <div id="screen--start">
      <div className="audioVisualizer">
        <div id="content">
          <Link href="/">
            <a className="nav-link">Home</a>
          </Link>
          <div className={style}>
            {!isAudioPlaying && <h1>Get some tunes</h1>}
            <>
              <label
                className={
                  !isAudioPlaying
                    ? "custom-file-upload-2"
                    : "custom-file-upload"
                }
              >
                Select MP3
                <input
                  type="file"
                  id="thefile"
                  accept="audio/*"
                  onChange={(e) => {
                    setFile(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </label>
            </>
          </div>
          <audio
            id="audio"
            controls
            onEnded={(data) => {
              window.stopAnimation();
              setIsAudioPlaying(false);
            }}
            onPlay={(e) => {
              setIsAudioPlaying(true);
            }}
          ></audio>
        </div>
      </div>
    </div>
  );
};
