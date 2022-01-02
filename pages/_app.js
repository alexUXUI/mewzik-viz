import { useEffect, useState } from "react";
import "../styles/globals.css";
import "../styles/style.css";
import "../styles/unsupported.module.css";

function isBrowserSupported() {
  let userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else {
    browserName = "No browser detection";
  }

  if (browserName !== "chrome" && browserName !== "firefox") {
    return false;
  }

  return true;
}

function MyApp({ Component, pageProps }) {
  const [canRunSite, setCanRunSite] = useState(false);

  useEffect(() => {
    setCanRunSite(isBrowserSupported());
  });

  if (!true) {
    return (
      <div id="unsupported">
        <div className="container">
          <h1>Sorry, this browser is not supported.</h1>
          <h3>
            For the ultimate experience, please visit this site on a desktop
            chrome or firefox browser. Thanks a bunch and hope you enjoy!
          </h3>
        </div>
      </div>
    );
  }
  return <Component {...pageProps} />;
}

export default MyApp;
