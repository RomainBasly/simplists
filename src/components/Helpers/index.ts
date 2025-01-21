import { IElement } from "../../../types/types";
import { INotification } from "../Materials/NotificationsList/types";
import { IList } from "../Materials/UserLists";

export function sortListItemObjectByUpdatedDateDSC(
  objectA: IElement,
  objectB: IElement
) {
  let dateA = new Date(objectA.updated_at);
  let dateB = new Date(objectB.updated_at);

  return dateB.getTime() - dateA.getTime();
}

// Todo - deal with this warning
export function sortListNotificationsObjectByUpdatedDateDSC(
  objectA: INotification,
  objectB: INotification
) {
  let dateA = new Date(objectA.updated_at);
  let dateB = new Date(objectB.updated_at);

  return dateB.getTime() - dateA.getTime();
}

export function sortListItemObjectByUpdatedDateASC(
  objectA: IElement,
  objectB: IElement
) {
  let dateA = new Date(objectA.updated_at);
  let dateB = new Date(objectB.updated_at);

  return dateA.getTime() - dateB.getTime();
}

export function sortItemListObjectByNameASC(a: IList, b: IList) {
  let firstElement = a["app-lists"].listName.toUpperCase();
  let secondElement = b["app-lists"].listName.toUpperCase();

  if (firstElement > secondElement) {
    return 1;
  }

  if (firstElement < secondElement) {
    return -1;
  }
  return 0;
}

type Items = {
  content: string;
};

export function sortListItemsByAlphabeticContent(a: Items, b: Items): number {
  if (a.content.toLocaleLowerCase() > b.content.toLocaleLowerCase()) {
    return 1;
  } else if (a.content.toLocaleLowerCase() === b.content.toLocaleLowerCase()) {
    return 0;
  } else return -1;
}

export function convertUrlBase64ToUint8Array(base64String: string | undefined) {
  if (base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
