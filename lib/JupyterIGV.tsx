import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { JupyterIGVProps } from "./interfaces";
import Header from "./components/Header";
import { HandlersContext, useHandlers } from "./context/Handlers";
import { IGVBrowserContext, useIGVBrowser } from "./context/IGVBrowser";
import { IGVOptionsContext } from "./context/IGVOptions";
import { usePersistedState } from "./utils/hooks";
import igv, { Browser, CreateOpt } from "igv";

import "./JupyterIGV.scss";

interface IGVBrowserProps {
  igvOptions: CreateOpt;
}

function IGVBrowser(props: IGVBrowserProps) {
  const igvBrowser = useIGVBrowser();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the browser on mount
    igv
      .createBrowser(containerRef.current!, props.igvOptions)
      .then((browser) => igvBrowser.setBrowser(browser));

    // Handler function to destroy the browser on unmount
    return () => {
      const browser = igvBrowser.getBrowser();
      if (browser) igv.removeBrowser(browser);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
}

function App() {
  const handlers = useHandlers();
  const browserRef = useRef<Browser | null>(null);
  const defaultIGVOptions: CreateOpt = {
    genome: "GCA_000022165.1",
  };
  const [igvOptions, setIGVOptions] = usePersistedState<CreateOpt>(
    handlers,
    "igvOptions",
    defaultIGVOptions
  );

  const setBrowser = (browser: Browser) => {
    browserRef.current = browser;
  };

  const getBrowser = () => {
    return browserRef.current;
  };

  return (
    <div id="jupyter-igv-app" className="climb-jupyter jupyter-igv h-100">
      <IGVBrowserContext.Provider
        value={{ browserRef, setBrowser, getBrowser }}
      >
        <IGVOptionsContext.Provider value={setIGVOptions}>
          <Header />
          <Container fluid className="jupyter-igv-content">
            <IGVBrowser igvOptions={igvOptions} />
          </Container>
        </IGVOptionsContext.Provider>
      </IGVBrowserContext.Provider>
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
        <App />
      </HandlersContext.Provider>
    </QueryClientProvider>
  );
}

export default JupyterIGV;
