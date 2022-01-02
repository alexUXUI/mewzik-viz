import * as React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-location";
import { useRouter } from "next/router";

import "../../styles/welcome.module.css";

export const Welcome = () => {
  const router = useRouter();

  const onClick = () => {
    router.push("/audio-viz");
  };

  const IntroElements = [
    <h1>Welcome to the Audio Visualizer!</h1>,
    <h2>Generates 3D graphics with Audio.</h2>,
    <button onClick={onClick}>Go to Audio Viz</button>,
  ];

  React.useEffect(() => {
    // find any canvas elements in the DOM and remove them
    const canvas = document.getElementsByTagName("canvas");
    for (let i = 0; i < canvas.length; i++) {
      canvas[i].remove();
    }

    // find any dat gui elements and hide them
    const gui = document.getElementsByClassName("dg");
    for (let i = 0; i < gui.length; i++) {
      gui[i].style.display = "none";
    }
  }, []);

  return (
    <div id="welcome">
      <motion.div
        className="container"
        variants={{
          hidden: { opacity: 1, scale: 0 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {IntroElements.map((index) => (
          <motion.div
            key={Math.random() * 100}
            className="item"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
              },
            }}
          >
            {index}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
