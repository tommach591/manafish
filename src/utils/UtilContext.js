

import {
    useContext,
    createContext,
    useState,
    useEffect,
  } from "react";

const UtilContext = createContext();
export function useUtil() {
  return useContext(UtilContext);
}

export function UtilProvider({ children }) {
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem("bgmVolume");
    return stored !== null ? parseFloat(stored) : 0.1;
  });
  
  const [notif, setNotif] = useState(() => {
    const stored = localStorage.getItem("notifOn");
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("bgmVolume", volume);
    localStorage.setItem("notifOn", notif);
  }, [volume, notif])

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
