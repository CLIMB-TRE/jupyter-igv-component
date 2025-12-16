import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { JupyterIGVProps } from "./interfaces";
import Header from "./components/Header";
import IGVProvider from "./context/IGVProvider";
import { useIGV } from "./context/IGVContext";
import { HandlersContext } from "./context/HandlersContext";
import igv, { CreateOpt } from "igv";

import "./JupyterIGV.scss";

function IGVBrowser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const igvContext = useIGV();
  const igvOptions: CreateOpt = {
    genome: "GCA_000022165.1",
  };

  useEffect(() => {
    // Create the browser on mount
    igv
      .createBrowser(containerRef.current!, igvOptions)
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
  return (
    <div id="jupyter-igv-app" className="climb-jupyter jupyter-igv h-100">
      <Header />
      <Container fluid className="jupyter-igv-content">
        <IGVBrowser />
      </Container>
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
