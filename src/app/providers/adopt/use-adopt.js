import { useContext } from "react";
import { AdoptContext } from "./adopt-context";

export function useAdopt() {
  const context = useContext(AdoptContext);
  if (!context) throw new Error("useAdopt must be used within a AdoptProvider");  
  return context;
}
