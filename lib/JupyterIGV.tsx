import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { JupyterIGVProps } from "./interfaces";
import Header from "./components/Header";
import { HandlersContext, useHandlers } from "./context/Handlers";
import { IGVBrowserContext, useIGVBrowser } from "./context/IGVBrowser";
import { usePersistedState } from "./utils/hooks";
import { setTitleAsReference } from "./utils/functions";
import igv, { Browser, CreateOpt, BrowserEvents } from "igv";

import "./JupyterIGV.scss";

interface IGVBrowserProps {
  igvOptions: CreateOpt;
}

enum IGVEvents {
  TRACK_REMOVED = "trackremoved",
  TRACK_DRAG_END = "trackdragend",
  LOCUS_CHANGE = "locuschange",
  TRACK_ORDER_CHANGED = "trackorderchanged",
}

function IGVBrowser(props: IGVBrowserProps) {
  const handlers = useHandlers();
  const igvBrowser = useIGVBrowser();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the browser on mount
    igv
      .createBrowser(containerRef.current!, props.igvOptions)
      .then((browser) => {
        // Set the browser and document title
        igvBrowser.setBrowser(browser);
        setTitleAsReference(handlers, browser);

        // Event listeners for saving the browser on user interaction
        Object.values(IGVEvents).forEach((event) =>
          browser.on(event as BrowserEvents.EventType, () =>
            igvBrowser.saveBrowser(browser)
          )
        );
      });

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

  const saveBrowser = (browser: Browser) => {
    const session = browser.toJSON() as unknown as CreateOpt;
    // @ts-expect-error The GCA_000022165.1 reference
    // includes a locus in the ref object for some reason
    delete session["reference"]["locus"];
    setIGVOptions(session as unknown as CreateOpt);
  };

  return (
    <div id="jupyter-igv-app" className="climb-jupyter jupyter-igv h-100">
      <IGVBrowserContext.Provider
        value={{
          browserRef,
          setBrowser,
          getBrowser,
          saveBrowser,
        }}
      >
        <Header />
        <Container fluid className="jupyter-igv-content">
          {handlers.enabled && <IGVBrowser igvOptions={igvOptions} />}
        </Container>
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
