

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
  const [volume, setVolume] = useState(0.1);
  const [notif, setNotif] = useState(true);

  return (
    <UtilContext.Provider
      value={{
        volume,
        setVolume,
        notif, 
        setNotif,
      }}
    >
      {children}
    </UtilContext.Provider>
  );
}
