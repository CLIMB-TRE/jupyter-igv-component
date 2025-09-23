import { useRef, ReactNode } from "react";
import { Browser } from "igv";
import { IGVContext } from "./IGVContext";

export default function IGVProvider({ children }: { children: ReactNode }) {
  const browserRef = useRef<Browser | null>(null);

  const setBrowser = (browser: Browser) => {
    browserRef.current = browser;
  };

  const getBrowser = () => {
    return browserRef.current;
  };

  return (
    <IGVContext.Provider value={{ browserRef, setBrowser, getBrowser }}>
      {children}
    </IGVContext.Provider>
  );
}
