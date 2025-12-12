import React from "react";
import ReactDOM from "react-dom";
import JupyterIGV from "../lib/JupyterIGV.tsx";
import {
  version,
  getItem,
  setItem,
  setTitle,
  s3PresignHandler,
} from "./handlers.ts";

import "climb-jupyter-base-component/dist/style.css";
import "./main.css";

ReactDOM.render(
  <React.StrictMode>
    <JupyterIGV
      version={version}
      s3PresignHandler={s3PresignHandler}
      getItem={getItem}
      setItem={setItem}
      setTitle={setTitle}
    />
  </React.StrictMode>,
  document.getElementById("root")
);
