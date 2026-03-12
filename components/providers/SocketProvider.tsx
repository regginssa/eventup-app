import { SERVER_SOCKET_URL } from "@/config/env";
import { IUser } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthProvider";

interface SocketContextProps {
  socket: any;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be within SocketProvider");
  }

  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<any>(null);

  const { user, setAuthUser } = useAuth();

  useEffect(() => {
    if (!user) return;

    const sk = io(SERVER_SOCKET_URL, {
      transports: ["websocket"],
      query: { userId: user._id },
    });

    sk.on("connect", () => {
      sk.emit("user_connected", user._id);
    });

    setSocket(sk);

    return () => {
      sk.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdateUser = ({ user }: { user: IUser }) => {
      setAuthUser(user);
    };

    socket.on("auth_user_updated", handleUpdateUser);

    return () => {
      socket.off("auth_user_updated", handleUpdateUser);
    };
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
