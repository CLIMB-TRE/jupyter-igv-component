import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JupyterIGVProps } from "./interfaces";

import "./JupyterIGV.scss";
import "./JupyterIGV.css";

function App(props: JupyterIGVProps) {
  props;

  return <div className="jupyter-igv h-100"></div>;
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
      <App {...props} />
    </QueryClientProvider>
  );
}

export default JupyterIGV;
