import { createClient } from "redis";
import { SocketService } from "../websocket";
import http from "http";
import { Server } from "socket.io";
import { EventEmitter } from "events";

export class PubSubService extends EventEmitter {
  private static instance: PubSubService;
  private redisSubscriber;
  private redisPublisher;
  private socketService: SocketService;

  private constructor(io: Server, httpServer: http.Server) {
    super();

    const redisURL = process.env.REDIS_URL || "redis://34.22.232.95:6379";
    this.redisSubscriber = createClient({ url: redisURL });
    this.redisPublisher = createClient({ url: redisURL });

    console.log("Connecting Redis subscriber...");
    this.redisSubscriber
      .connect()
      .then(() => console.log("Redis subscriber connected"));
    console.log("Connecting Redis publisher...");
    this.redisPublisher
      .connect()
      .then(() => console.log("Redis publisher connected"));

    this.redisSubscriber.on("error", (err) =>
      console.error("Redis Subscriber Error:", err)
    );
    this.socketService = SocketService.getInstance(io, httpServer);
  }

  public static getInstance(io: Server, httpServer: http.Server) {
    if (!this.instance) {
      this.instance = new PubSubService(io, httpServer);
    }
    return this.instance;
  }

  public init() {
    this.subscribeToTopics();
  }

  async subscribeToTopics() {
    const topics = [
      "add_item",
      "update_item_content",
      "delete_item",
      "change_item_status",
      "list_invitation_status_change",
      "list_creation",
    ];

    for (const topicName of topics) {
      await this.redisSubscriber.subscribe(topicName, (message) => {
        try {
          const data = JSON.parse(message);
          const { action } = data;
          this.emit(action, data);
        } catch (error) {
          console.error(`Error processing Redis Message:`, error);
        }
      });
    }
  }
}
