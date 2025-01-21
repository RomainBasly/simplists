import { SocketConfig } from "./config";
import { PubSubService } from "./services/pubsub";
import { SocketService } from "./services/websocket";

require("dotenv").config();

class Main {
  public async start() {
    console.info("socket started");
    const { io, httpServer } = SocketConfig.getInstance().startServer();
    const pubSubService = PubSubService.getInstance(io, httpServer);
    pubSubService.init();

    const socketService = SocketService.getInstance(io, httpServer);
    this.registerPubSubListener(pubSubService, socketService);

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
    });

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
    });
  }

  private registerPubSubListener(
    pubSubService: PubSubService,
    socketService: SocketService
  ) {
    const events = [
      "add_item",
      "update_item_content",
      "delete_item",
      "change_item_status",
      "new_list_invitation",
      "list_invitation_status_change",
      "list_creation",
    ];

    events.forEach((event) => {
      socketService.registerListeners(pubSubService, event);
    });
  }
}

new Main().start();
