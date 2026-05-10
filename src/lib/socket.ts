import { io } from "socket.io-client";

export const socket = io("https://localhost:4000", {
  autoConnect: false,

  auth: {
    token:
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : "",
  }
})
