import io from "socket.io-client";
import { socketURL } from "./backendServerBaseURL";

export default class socketHelper {
  // socket constructor
  constructor() {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    this.socket = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      transports: ["websocket"],
      query: {
        type: "kiosk",
        token: token, // Send token for authentication
      },
      auth: {
        token: token, // Alternative way to send token
      },
    });
  }
}
