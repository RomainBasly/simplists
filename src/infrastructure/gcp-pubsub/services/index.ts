import { inject, injectable } from 'tsyringe';
import { RedisPubSubConfig } from '../RedisPubSubConfig';
import { RedisClientType } from 'redis';

@injectable()
export class RedisPubSubService {
  private redisPublisher: RedisClientType | null;

  constructor(@inject(RedisPubSubConfig) private readonly redisPubSubConfig: RedisPubSubConfig) {
    this.redisPublisher = this.redisPubSubConfig.getPubSubClient();
  }
  public async publishEvent(topic: string, message: any) {
    try {
      if (!this.redisPublisher) return;
      console.log('publishEvent topic ', topic);
      console.log('publishEvent message', message);
      await this.redisPublisher.publish(topic, JSON.stringify(message));
    } catch (error) {
      console.error(`Error publishing to redis`, error);
    }
  }
}
