import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMana } from "./ManaContext";

const FishContext = createContext();
export function useFish() {
  return useContext(FishContext);
}

export function FishProvider({ children }) {
  const { userID } = useMana();

  return <FishContext.Provider value={{}}>{children}</FishContext.Provider>;
}
