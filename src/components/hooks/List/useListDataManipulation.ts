
import { IBeneficiary, IUpdateList } from "../../../../types/types";

export async function addItemToListService(
  listId: string,
  listName: string,
  inputElement: string,
  beneficiaries?: IBeneficiary[]
): Promise<any> {
  try {
    const response = await fetch(`/api/lists/addItemToList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        listName,
        listId,
        content: inputElement,
        beneficiaries,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function updateListElementService(
  listName: string,
  listId: string,
  updatedContent: string,
  beneficiaries: IBeneficiary[],
  elementId?: string
): Promise<IUpdateList | null> {
  try {
    const response = await fetch(`/api/lists/updateListElement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        listName,
        listId,
        elementId,
        contentUpdate: updatedContent.trim(),
        beneficiaries,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function suppressElementService(
  listName: string,
  item: string,
  listId: string | null,
  elementId: string,
  beneficiaries: IBeneficiary[]
) {
  try {
    const response = await fetch(`/api/lists/suppressItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        listName,
        item,
        listId,
        elementId,
        beneficiaries,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function changeElementStatusService(
  listName: string,
  listId: string,
  id: string,
  changedElementName: string,
  statusOpen: boolean,
  beneficiaries: IBeneficiary[]
) {
  try {
    const body = JSON.stringify({
      listName,
      listId,
      elementId: id,
      changedElementName,
      statusOpen,
      beneficiaries,
    });
    const response = await fetch("/api/lists/handleItemStatusChange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body,
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}
