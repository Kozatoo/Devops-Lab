import React, { createContext } from "react";
import socket from "./socket";

const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {
  const context = React.useMemo(() => socket, [socket]);

  return (
    <SocketContext.Provider value={context}>{children}</SocketContext.Provider>
  );
};

function useSocket() {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}

export { SocketProvider, useSocket };
