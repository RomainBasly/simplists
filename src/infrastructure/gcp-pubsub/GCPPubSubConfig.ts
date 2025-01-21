import { PubSub } from '@google-cloud/pubsub';
import { injectable } from 'tsyringe';

@injectable()
export class GcpPubSubConfig {
  private static instance: GcpPubSubConfig;
  private pubSubClient: PubSub | null = null;

  constructor() {
    if (GcpPubSubConfig.instance) {
      return GcpPubSubConfig.instance;
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        this.pubSubClient = new PubSub({
          keyFilename: './key-pub-sub.json',
        });
      } else {
        const credentialsJSON = process.env.GCP_CREDENTIALS ? process.env.GCP_CREDENTIALS : '';
        const credentials = JSON.parse(credentialsJSON);
        const projectId = credentials.project_id;

        this.pubSubClient = new PubSub({ credentials, projectId });
      }
    } catch (error) {
      console.error('Failed to initialize Pub/Sub client:', error);
      throw error;
    }

    GcpPubSubConfig.instance = this;
    return GcpPubSubConfig.instance;
  }

  public getPubSubClient(): PubSub | null {
    if (this.pubSubClient) return this.pubSubClient;
    return null;
  }
}
