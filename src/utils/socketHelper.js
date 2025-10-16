import io from "socket.io-client";
import { socketURL } from "./backendServerBaseURL";

export default class socketHelper {
  // socket constructor
  constructor() {
    this.socket = io(socketURL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      transports: ["websocket"],
      query: {
        type: "kiosk",
      },
    });
  }
}
