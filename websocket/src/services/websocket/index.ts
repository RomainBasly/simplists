import { Server as IOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import http from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { PubSub } from "@google-cloud/pubsub";

export class SocketService {
  private static instance: SocketService;
  private userSocketMap: Map<string, { socketId: string; userId?: string }>;
  private pubSubClient: PubSub;

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
    this.pubSubClient = new PubSub();
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

      socket.on("adding-item-to-list-backend", (data: any) => {
        const elementToPassToFront = data.addedItem;
        data.beneficiaries.map((person: any) => {
          const userId = person["app-users"].user_id;

          // TODO : see what we can do for multi device connexion
          const targetSocketId = this.findSocketIdByUserId(userId);

          if (targetSocketId) {
            this.io.to(targetSocketId).emit("adding-item-to-list-socket", {
              elementToPass: elementToPassToFront,
            });
          }
        });
      });

      socket.on("suppress-item-from-list-backend", (data: any) => {
        const elementId = data.elementId;
        data.beneficiaries.map((person: any) => {
          const userId = person["app-users"].user_id;

          // TODO : see what we can do for multi device connexion
          const targetSocketId = this.findSocketIdByUserId(userId);

          if (targetSocketId) {
            this.io.to(targetSocketId).emit("suppress-item-from-list-socket", {
              elementId,
            });
          }
        });
      });

      socket.on("update-item-content-backend", (data: any) => {
        const elementToPassToFront = data.updatedItem;
        data.beneficiaries.map((person: any) => {
          const userId = person["app-users"].user_id;

          // TODO : see what we can do for multi device connexion
          const targetSocketId = this.findSocketIdByUserId(userId);

          if (targetSocketId) {
            this.io.to(targetSocketId).emit("update-item-content-socket", {
              elementToPass: elementToPassToFront,
            });
          }
        });
      });

      socket.on("change-item-status-backend", (data: any) => {
        const elementToPassToFront = data.updatedItem;
        data.beneficiaries.map((person: any) => {
          const userId = person["app-users"].user_id;

          // TODO : see what we can do for multi device connexion
          const targetSocketId = this.findSocketIdByUserId(userId);

          if (targetSocketId) {
            this.io.to(targetSocketId).emit("change-item-status-socket", {
              elementToPass: elementToPassToFront,
            });
          }
        });
      });

      socket.on("list-invitation-backend", (data: any) => {
        const { userId } = data;

        // TODO : see what we can do for multi device connexion
        const targetSocketId = this.findSocketIdByUserId(userId);

        if (targetSocketId) {
          this.io.to(targetSocketId).emit("list-invitation-socket", {
            data,
          });
        }
      });

      socket.on("register-user-id", (data) => {
        const { accessTokenJWT, socketId } = data;

        const decoded = jwt.decode(accessTokenJWT);
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
    });

    this.io.on("error", (err) => {
      console.error("Socket.io error:", err);
    });

    this.httpServer.on("error", (err) => {
      console.error("HTTP server error:", err);
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
