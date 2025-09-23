import React from "react";
import ReactDOM from "react-dom";
import JupyterIGV from "../lib/JupyterIGV.tsx";
import {
  fileWriter,
  httpPathHandler,
  s3PathHandler,
  extVersion,
  getItem,
  setItem,
  setTitle,
} from "./handlers.tsx";

import "./main.css";

ReactDOM.render(
  <React.StrictMode>
    <JupyterIGV
      httpPathHandler={httpPathHandler}
      s3PathHandler={s3PathHandler}
      fileWriter={fileWriter}
      extVersion={extVersion}
      getItem={getItem}
      setItem={setItem}
      setTitle={setTitle}
    />
  </React.StrictMode>,
  document.getElementById("root")
);
