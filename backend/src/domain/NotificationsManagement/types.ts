import { UUID } from 'crypto';

export type INotificationElement = {
  url: string;
  content: string;
  isNew: boolean;
  type: string;
  creator_id?: number;
  recipient_id: `${string}-${string}-${string}-${string}-${string}`;
};
