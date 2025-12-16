import { CreateOpt } from "igv";
import { createContext, useContext } from "react";

export const IGVOptionsContext = createContext<
  React.Dispatch<React.SetStateAction<CreateOpt>> | undefined
>(undefined);

export function useIGVOptions() {
  const context = useContext(IGVOptionsContext);
  if (context === undefined) {
    throw new Error("useIGVOptions must be used within an IGVOptions Provider");
  }
  return context;
}
