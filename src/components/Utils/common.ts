import { sortListNotificationsObjectByUpdatedDateDSC } from "../Helpers";
import { INotificationsList } from "../Materials/NotificationsList/types";

export async function subscribeToNotifications(
  url: string,
  subscription: PushSubscription,
  userAgent: string
) {
  const bodyContent = { subscription, userAgent };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(bodyContent),
  });

  return response;
}

export const sortByDateAndByType = (
  initialNotifications: INotificationsList
) => {
  const liveNotificationssSorted = initialNotifications
    .filter((notification) => notification.isNew === true)
    .sort(sortListNotificationsObjectByUpdatedDateDSC);
  const readNotificationsListSorted = initialNotifications
    .filter((notification) => notification.isNew === false)
    .sort(sortListNotificationsObjectByUpdatedDateDSC);

  return [...liveNotificationssSorted, ...readNotificationsListSorted];
};

export function formatToReadableDate(dateString: string | number | Date) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `Le ${formatter.format(date).replace(":", "h")}`;
}
