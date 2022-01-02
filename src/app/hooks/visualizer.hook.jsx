import * as React from "react";

export const useAudioVisualizer = () => {
  React.useEffect(() => {
    import("../../index.js").then(({ runViz }) => {
      runViz();
    });
  }, []);
};
