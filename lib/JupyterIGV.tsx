import { useState, useRef, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JupyterIGVProps } from "./interfaces";
import { IGVOptions } from "./types";
import Header from "./components/Header";
import IGVProvider from "./context/IGVProvider";
import { useIGV } from "./context/IGVContext";
import { HandlersContext } from "./context/HandlersContext";
import igv, { CreateOpt } from "igv";

import "./JupyterIGV.scss";

interface IGViewerProps {
  igvOptions: IGVOptions;
}

function IGViewer(props: IGViewerProps) {
  const igvContext = useIGV();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IGV browser already exists, do nothing
    if (igvContext.getBrowser()) return;

    // Create the browser
    igv
      .createBrowser(
        containerRef.current!,
        props.igvOptions as unknown as CreateOpt
      )
      .then((browser) => {
        igvContext.setBrowser(browser);
      });
  }, [igvContext, props.igvOptions]);

  return <div ref={containerRef} />;
}

function App() {
  const baseOptions: IGVOptions = {};
  const defaultOptions: IGVOptions = {
    ...baseOptions,
    genome: "hg38",
  };
  const [igvOptions] = useState<IGVOptions>(defaultOptions);

  return (
    <div id="jupyter-igv-app" className="climb-jupyter jupyter-igv h-100">
      <Header />
      <div className="jupyter-igv-content">
        <IGViewer igvOptions={igvOptions} />
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function JupyterIGV(props: JupyterIGVProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HandlersContext.Provider value={{ ...props }}>
        <IGVProvider>
          <App />
        </IGVProvider>
      </HandlersContext.Provider>
    </QueryClientProvider>
  );
}

export default JupyterIGV;
