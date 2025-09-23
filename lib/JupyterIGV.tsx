import React, { useState, useRef, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JupyterIGVProps } from "./interfaces";
import { IGVOptions } from "./types";
import igv, { CreateOpt, Browser } from "igv";

import "./JupyterIGV.scss";
import "./JupyterIGV.css";

const genomeOptions = [
  "",
  "hs1",
  "chm13v1.1",
  "hg38",
  "hg38_1kg",
  "hg19",
  "hg18",
  "mm39",
  "mm10",
  "mm9",
  "rn7",
  "rn6",
  "gorGor6",
  "gorGor4",
  "panTro6",
  "panTro5",
  "panTro4",
  "macFas5",
  "GCA_011100615.1",
  "panPan2",
  "canFam3",
  "canFam4",
  "canFam5",
  "bosTau9",
  "bosTau8",
  "susScr11",
  "galGal6",
  "danRer11",
  "danRer10",
  "ce11",
  "dm6",
  "dm3",
  "dmel_r5.9",
  "sacCer3",
  "ASM294v2",
  "ASM985889v3",
  "tair10",
];

/**
 * React component for IGV.
 *
 * @returns The React component
 */
function IGViewer({ igvOptions }: { igvOptions: IGVOptions }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<Browser | null>(null);

  useEffect(() => {
    igv
      .createBrowser(containerRef.current!, igvOptions as unknown as CreateOpt)
      .then((browser) => (browserRef.current = browser));
  }, []);

  useEffect(() => {
    if (browserRef.current) {
      console.log("Loading IGV options:", igvOptions);
      browserRef.current.loadGenome(
        igvOptions.genome ? igvOptions.genome : igvOptions.reference!
      );
    }
  }, [igvOptions]);

  return <div ref={containerRef} />;
}

function App(props: JupyterIGVProps) {
  props;

  const baseOptions: IGVOptions = {};

  const defaultOptions: IGVOptions = {
    ...baseOptions,
    genome: "hg38",
  };

  // Genome property
  const [genome, setGenome] = useState("");

  // Reference properties
  const [fastaURL, setFastaURL] = useState("");
  const [indexURL, setIndexURL] = useState("");

  // IGV options state
  const [igvOptions, setIgvOptions] = useState<IGVOptions>(defaultOptions);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedOptions: IGVOptions = {
      ...baseOptions,
    };

    if (genome) {
      updatedOptions.genome = genome;
    }

    if (fastaURL) {
      updatedOptions.reference = {
        fastaURL: fastaURL,
        indexURL: indexURL,
      };
    }

    console.log("Setting IGV options:", updatedOptions);
    setIgvOptions(updatedOptions);
  };

  return (
    <div className="jupyter-igv h-100">
      <form onSubmit={handleSubmit} style={{ marginBottom: "8px" }}>
        <select value={genome} onChange={(e) => setGenome(e.target.value)}>
          {genomeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={fastaURL}
          onChange={(e) => setFastaURL(e.target.value)}
          placeholder="Reference FASTA (.fa or .fasta)"
        />
        <input
          type="text"
          value={indexURL}
          onChange={(e) => setIndexURL(e.target.value)}
          placeholder="Reference FASTA index (.fai)"
        />
        <button type="submit">Refresh</button>
      </form>
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
      <App {...props} />
    </QueryClientProvider>
  );
}

export default JupyterIGV;
