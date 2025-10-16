import io from "socket.io-client";
import { socketURL } from "./backendServerBaseURL";

export default class socketHelper {
  // socket constructor
  constructor() {
    this.socket = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 3,
      transports: ["polling"], // Use only polling for better reliability
      timeout: 15000,
      forceNew: true,
      query: {
        type: "kiosk",
      },
    });

    // Handle connection errors
    this.socket.on("connect_error", (error) => {
      console.warn("Socket.IO connection error:", error.message);
      // Don't throw errors, just log them
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("Socket.IO disconnected:", reason);
      // Only reconnect if it's not a manual disconnect
      if (reason !== "io client disconnect") {
        console.log("Attempting to reconnect...");
      }
    });

    this.socket.on("connect", () => {
      console.log("Socket.IO connected successfully");
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket.IO reconnected after", attemptNumber, "attempts");
    });

    this.socket.on("reconnect_error", (error) => {
      console.warn("Socket.IO reconnection error:", error.message);
    });

    this.socket.on("reconnect_failed", () => {
      console.warn("Socket.IO reconnection failed - giving up");
    });
  }
}
