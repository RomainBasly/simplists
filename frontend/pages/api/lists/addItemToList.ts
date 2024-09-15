import ListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const listId = req.body.listId;
  const content = req.body.content;
  const beneficiaries = req.body.beneficiaries;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const listsApi = ListsApi.getInstance();

    const itemAdded = await listsApi.addItemToList(
      listId,
      content,
      beneficiaries,
      {
        Cookie: cookieHeader || "",
      }
    );

    return res.status(200).json({
      message: "Item added to list",
      itemAdded: itemAdded.addedElement,
      success: "ok",
    });
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is 1", error);
    res.status(500).json({ error: "Failed to add an element to the list" });
  }
}
