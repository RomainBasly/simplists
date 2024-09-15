import JwtService from "@/Services/jwtService";
import { IList, IListElement } from "../Materials/UserLists";
import { IElement } from "../Materials/UserLists/ListPage";
import Cookies from 'js-cookie'

export function sortItemObjectByUpdatedDateDSC(
  objectA: IElement,
  objectB: IElement
) {
  let dateA = new Date(objectA.updated_at);
  let dateB = new Date(objectB.updated_at);

  return dateB.getTime() - dateA.getTime();
}
export function sortItemObjectByUpdatedDateASC(
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

