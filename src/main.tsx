import React from "react";
import ReactDOM from "react-dom";
import JupyterIGV from "../lib/JupyterIGV.tsx";
import { version, getItem, setItem, setTitle, getS3Paths } from "./handlers.ts";

import "./main.css";

ReactDOM.render(
  <React.StrictMode>
    <JupyterIGV
      version={version}
      getItem={getItem}
      setItem={setItem}
      setTitle={setTitle}
      getS3Paths={getS3Paths}
    />
  </React.StrictMode>,
  document.getElementById("root")
);
