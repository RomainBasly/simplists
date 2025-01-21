export type INotificationsList = INotification[];

export type INotification = {
  id: number;
  type: string;
  isNew: boolean;
  content: string;
  updated_at: string;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
  url: string;
};
