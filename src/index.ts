import dotenv from "dotenv";
import { SocketService } from "./services/websocket";
import { SocketConfig } from "./config";

dotenv.config();

class Main {
  public async start() {
    console.info("socket started");
    const { io, httpServer } = SocketConfig.getInstance().startServer();
    SocketService.getInstance(io, httpServer);
  }
}

new Main().start();
