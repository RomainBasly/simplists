import { createClient, RedisClientType } from 'redis';
import { injectable } from 'tsyringe';

@injectable()
export class RedisPubSubConfig {
  private static instance: RedisPubSubConfig;
  private redisPublisher: RedisClientType | null = null;

  constructor() {
    if (RedisPubSubConfig.instance) {
      return RedisPubSubConfig.instance;
    }

    try {
      this.redisPublisher = createClient({
        url: process.env.REDIS_URL || 'redis://34.22.232.95:6379',
        password: process.env.REDIS_PASSWORD,
      });
      this.redisPublisher.connect();
    } catch (error) {
      console.error('error creating client', error);
    }

    RedisPubSubConfig.instance = this;
    return RedisPubSubConfig.instance;
  }

  public getPubSubClient(): RedisClientType | null {
    if (this.redisPublisher) return this.redisPublisher;
    return null;
  }
}
