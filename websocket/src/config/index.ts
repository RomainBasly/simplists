import http from "http";
import express from "express";
import { Server as IOServer, Socket } from "socket.io";

export class SocketConfig {
  private static instance: SocketConfig;
  private expressApp: express.Application;
  private httpServer: http.Server;
  private io: IOServer;
  private readonly port: string | number;

  private constructor() {
    this.expressApp = express();
    this.httpServer = http.createServer(this.expressApp);
    this.port = process.env.PORT || 3001;

    this.io = new IOServer(this.httpServer, {
      cors: {
        origin: process.env.CORS_ORIGINS?.split(",") || [], // Allowed origins stored in a string on pm2
        allowedHeaders: ["custom-header"], // TODO : check if necessary
        credentials: true, // Allow sending of cookies and credentials
      },
      path: "/socket.io/",
    });

    this.listen();
  }

  public static getInstance(): SocketConfig {
    if (!this.instance) {
      this.instance = new SocketConfig();
    }
    return this.instance;
  }

  public startServer() {
    const { io, httpServer } = this;
    return { io, httpServer };
  }

  private listen(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
