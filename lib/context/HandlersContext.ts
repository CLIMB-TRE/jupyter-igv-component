import { createContext, useContext } from "react";
import { JupyterIGVProps } from "../interfaces";

export const HandlersContext = createContext<JupyterIGVProps | undefined>(
  undefined
);

export function useHandlers() {
  const context = useContext(HandlersContext);
  if (context === undefined) {
    throw new Error("useHandlers must be used within a Handlers Provider");
  }
  return context;
}
