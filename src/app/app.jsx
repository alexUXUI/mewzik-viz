// 3rd party Libs
import React from "react";
import ReactDOM from "react-dom";
import {
  MakeGenerics,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "react-location";
import { motion } from "framer-motion";
import { ReactLocationDevtools } from "react-location-devtools";

// Hooks
import { useAudioVisualizer } from "./hooks/visualizer.hook";

// Components
import { Welcome } from "./welcome.component";
import { AudioVisualizer } from "./viz.component";

// styles
import "../css/welcome.css";

// React location route definitions
const routes = [
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/audio-viz",
    element: <AudioVisualizer />,
  },
];

// Set up a ReactLocation instance
const location = new ReactLocation();

function App() {
  return (
    // Build our routes and render our router
    <Router location={location} routes={routes}>
      <Outlet />{" "}
      {/* Start rendering router matches this is the window where all the routes get rendered*/}
      <ReactLocationDevtools initialIsOpen={false} />
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
