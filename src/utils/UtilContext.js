

import {
    useContext,
    createContext,
    useState,
  } from "react";

const UtilContext = createContext();
export function useUtil() {
  return useContext(UtilContext);
}

export function UtilProvider({ children }) {
  const [volume, setVolume] = useState(0.05);

  return (
    <UtilContext.Provider
      value={{
        volume,
        setVolume
      }}
    >
      {children}
    </UtilContext.Provider>
  );
}
