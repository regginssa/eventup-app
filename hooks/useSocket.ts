import { SERVER_SOCKET_URL } from "@/config/env";
import { IUser } from "@/types/user";
import { useEffect, useRef } from "react";
import io from "socket.io-client";

export const useSocket = (user: IUser) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(SERVER_SOCKET_URL, {
      transports: ["websocket"],
      query: { userId: user._id },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
};
