import React, { createContext, useState } from "react";

export const LPContext = createContext(null);

export const LPUserProvider = ({ children }) => {
  const [name, setName] = useState(null);

  return (
    <LPContext.Provider value={{ name, setName }}>
      {children}
    </LPContext.Provider>
  );
};
