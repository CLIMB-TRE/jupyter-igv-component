import React, { createContext, useContext } from "react";
import { Browser } from "igv";

export const IGVBrowserContext = createContext<
  | {
      browserRef: React.MutableRefObject<Browser | null>;
      setBrowser: (browser: Browser) => void;
      getBrowser: () => Browser | null;
    }
  | undefined
>(undefined);

export function useIGVBrowser() {
  const context = useContext(IGVBrowserContext);
  if (context === undefined) {
    throw new Error("useIGVBrowser must be used within an IGVBrowser Provider");
  }
  return context;
}
