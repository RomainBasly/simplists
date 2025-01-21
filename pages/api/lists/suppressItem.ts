import ListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const { listName, item, elementId, listId, beneficiaries } = req.body;


  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const listsApi = ListsApi.getInstance();
    const itemSuppressed = await listsApi.suppressItem(
      listName,
      item,
      listId,
      elementId,
      beneficiaries,
      {
        Cookie: cookieHeader || "",
      }
    );
    if (itemSuppressed.success) {
      return res.status(200).json({
        success: true,
        message: "Item suppress of list",
      });
    }
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is8", error);
    res
      .status(500)
      .json({ error: "Failed to suppress the element of the list" });
  }
}
