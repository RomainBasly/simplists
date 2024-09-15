import { Socket, io as ioClient } from 'socket.io-client';
import { injectable } from 'tsyringe';

@injectable()
export class WebSocketClientService {
  private instance: Socket | null = null;
  private url;
  private maxRetry = 3;
  private retryInterval = 10000;
  private retryCount = 0;

  constructor() {
    this.url = process.env.SOCKET_URL || '';
    this.connect();
  }

  private connect() {
    this.instance = ioClient(this.url, {
      transports: ['websocket', 'polling'], // Ensure both transports are allowed
      upgrade: true,
    });

    this.instance.on('connect', () => {
      console.log('connect to the Websocket Server');
      this.initializeListeners();
    });
  }

  private ensureConnection() {
    if (!this.instance) {
      this.instance = ioClient(this.url);

      this.instance.on('connect', () => {
        console.log('connect to the Websocket Server');
        this.initializeListeners();
      });

      this.instance.on('connect_error', (error) => {
        console.log('WebSocket Connection Error:', error);
        if (this.instance) {
          this.instance.disconnect();
        }
        this.retryConnection();
      });
      this.instance.on('disconnect', () => {
        console.log('disconnect');
        this.instance!.disconnect();
      });
    }
  }

  private retryConnection() {
    if (this.retryCount < this.maxRetry) {
      setTimeout(() => {
        console.log(`Attempting to reconnect... Attempt ${this.retryCount + 1}`);
        this.retryCount++;
        this.connect();
      }, this.retryInterval);
    }
  }

  public emit(eventName: string, data: any) {
    this.ensureConnection();
    if (this.instance) {
      this.instance.emit(eventName, data);
    } else {
      console.log('WebSocket not connected');
    }
  }
  private initializeListeners() {
    if (this.instance) {
      this.instance.on('From Api', (data) => {
        console.log('received data', data);
      });
    }
  }
}
