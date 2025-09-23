import { useState, useRef, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JupyterIGVProps } from "./interfaces";
import { IGVOptions } from "./types";
import Header from "./components/Header";
import IGVProvider from "./context/IGVProvider";
import { useIGV } from "./context/IGVContext";
import igv, { CreateOpt } from "igv";

import "./JupyterIGV.scss";
import "./JupyterIGV.css";

function IGViewer({ igvOptions }: { igvOptions: IGVOptions }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setBrowser, getBrowser } = useIGV();

  useEffect(() => {
    // If IGV browser already exists, do nothing
    if (getBrowser()) return;

    // Create the browser
    igv
      .createBrowser(containerRef.current!, igvOptions as unknown as CreateOpt)
      .then((browser) => {
        setBrowser(browser);
      });
  }, [setBrowser, getBrowser, igvOptions]);

  return <div ref={containerRef} />;
}

function App(props: JupyterIGVProps) {
  props;

  const baseOptions: IGVOptions = {};
  const defaultOptions: IGVOptions = {
    ...baseOptions,
    genome: "hg38",
  };

  // IGV options state
  const [igvOptions] = useState<IGVOptions>(defaultOptions);

  return (
    <div className="jupyter-igv h-100">
      <Header />
      <IGViewer igvOptions={igvOptions} />
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
      <IGVProvider>
        <App {...props} />
      </IGVProvider>
    </QueryClientProvider>
  );
}

export default JupyterIGV;
