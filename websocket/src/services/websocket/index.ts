import { Server as IOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import http from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { PubSubService } from "../pubsub";

export class SocketService {
  private static instance: SocketService;
  private userSocketMap: Map<string, { socketId: string; userId?: string }>;

  constructor(
    private io: IOServer<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >,
    private httpServer: http.Server
  ) {
    this.userSocketMap = new Map();
    this.initializeSocket();
  }

  public static getInstance(io: IOServer, http: http.Server): SocketService {
    if (!this.instance) {
      this.instance = new SocketService(io, http);
    }
    return this.instance;
  }

  private initializeSocket(): void {
    this.io.on("connection", (socket: Socket) => {
      const socketId = randomBytes(16).toString("hex");
      socket.emit("assign-socket-id", {
        socketId,
      });
      this.userSocketMap.set(socketId, {
        socketId,
      });
      console.log("this.userSocketMap", this.userSocketMap);
      socket.on("ping", () => {
        socket.emit("pong");
      });
      socket.on("disconnect", () => {
        this.userSocketMap.delete(socketId);
      });

      socket.on("register-user-id", (data) => {
        const { accessToken, socketId } = data;

        const decoded = jwt.decode(accessToken);
        if (
          typeof decoded === "object" &&
          decoded !== null &&
          "userInfo" in decoded
        ) {
          const userId = decoded.userInfo.id.toString();

          // TODO : see what we can do for multi device connexion
          this.userSocketMap.forEach((value, key) => {
            if (value.userId === userId) {
              this.userSocketMap.delete(key);
            }
          });

          if (this.userSocketMap.has(socketId)) {
            this.userSocketMap.set(socketId, {
              socketId: socket.id,
              userId,
            });
          }
          console.log(
            `Registering or updating userId ${userId} with socketId ${socket.id}`
          );
        }

        console.log("this.userSocketId", this.userSocketMap);
      });

      socket.on("unregister-user-id", (data) => {
        const { socketId } = data;

        if (this.userSocketMap.has(socketId)) {
          this.userSocketMap.set(socketId, { socketId: socket.id });
          console.log(`Removed userId association for socketId ${socketId}`);
        }
      });
    });

    this.io.on("error", (err) => {
      console.error("Socket.io error:", err);
    });

    this.httpServer.on("error", (err) => {
      console.error("HTTP server error:", err);
    });
  }

  public registerListeners(pubSubService: PubSubService, event: string) {
    pubSubService.on(event, (data) => {
      this.publishEvent(event, data);
    });
  }

  private publishEvent(action: string, payload: any, recepients?: unknown) {
    const elementToPublish = payload;
    console.log("elementToPublish", payload, payload.beneficiaries);
    payload.beneficiaries.map((person: any) => {
      console.log("beneficiaries", person);
      const userId = person["app-users"].user_id;

      // TODO : see what we can do for multi device connexion
      const targetSocketId = this.findSocketIdByUserId(userId);
      console.log("targetSocketId", targetSocketId);
      console.log("action", action);
      if (targetSocketId) {
        this.io.to(targetSocketId).emit(action, {
          payload,
        });
      }
    });
  }

  private findSocketIdByUserId(userId: string): string | null {
    for (const [_, value] of this.userSocketMap.entries()) {
      if (String(value.userId) === String(userId)) {
        return value.socketId;
      }
    }

    return null;
  }
}
