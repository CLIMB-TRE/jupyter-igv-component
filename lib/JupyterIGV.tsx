import { useState, useRef, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JupyterIGVProps } from "./interfaces";
import Header from "./components/Header";
import IGVProvider from "./context/IGVProvider";
import { useIGV } from "./context/IGVContext";
import { HandlersContext } from "./context/HandlersContext";
import igv, { CreateOpt } from "igv";

import "./JupyterIGV.scss";

interface IGViewerProps {
  igvOptions: CreateOpt;
}

function IGViewer(props: IGViewerProps) {
  const igvContext = useIGV();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the browser on mount
    igv
      .createBrowser(containerRef.current!, props.igvOptions)
      .then((browser) => igvContext.setBrowser(browser));

    // Handler function to destroy the browser on unmount
    return () => {
      const browser = igvContext.getBrowser();
      if (browser) igv.removeBrowser(browser);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
}

function App() {
  const defaultOptions: CreateOpt = {
    genome: "hg38",
  };
  const [igvOptions] = useState<CreateOpt>(defaultOptions);

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
