import { DefaultEventsMap } from "@socket.io/component-emitter";
import assert from "assert";
import Cookies from "js-cookie";
import { Socket, io } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    assert(
      process.env.NEXT_PUBLIC_SOCKET_URL,
      "error getting the socket url from env"
    );
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket", "polling"], // Ensure both transports are allowed
      upgrade: true,
    });
    // Setup your event listeners here
    socket.on("connect", () => {
      const accessTokenJWT = Cookies.get("accessToken");
      const socketId = localStorage.getItem("socketId");
      if (accessTokenJWT) {
        socket.emit("register-user-id", { socketId, accessTokenJWT });
      }
      console.log("Connected to the socket Server");
    });

    socket.on("disconnect", () => {
      deleteId();
      console.log("Disconnected from the socket server");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
  }
  return socket;
};

const deleteId = () => localStorage.removeItem("socketId");
