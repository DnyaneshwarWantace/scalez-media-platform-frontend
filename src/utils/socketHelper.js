import io from "socket.io-client";
import { socketURL } from "./backendServerBaseURL";

export default class socketHelper {
  // socket constructor
  constructor() {
    this.socket = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
      timeout: 10000,
      query: {
        type: "kiosk",
      },
    });

    // Handle connection errors
    this.socket.on("connect_error", (error) => {
      console.warn("Socket.IO connection error:", error.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("Socket.IO disconnected:", reason);
    });

    this.socket.on("connect", () => {
      console.log("Socket.IO connected successfully");
    });
  }
}
