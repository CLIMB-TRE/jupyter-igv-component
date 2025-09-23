import React, { createContext, useContext } from "react";
import { Browser } from "igv";

interface IGVContextType {
  browserRef: React.MutableRefObject<Browser | null>;
  setBrowser: (browser: Browser) => void;
  getBrowser: () => Browser | null;
}

export const IGVContext = createContext<IGVContextType | undefined>(undefined);

export function useIGV() {
  const context = useContext(IGVContext);
  if (context === undefined) {
    throw new Error("useIGV must be used within an IGVProvider");
  }
  return context;
}
