import ListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const elementId = req.body.elementId;
  const contentUpdate = req.body.contentUpdate;
  const listId = req.body.listId;
  const beneficiaries = req.body.beneficiaries;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const listsApi = ListsApi.getInstance();
    const itemContentUpdated = await listsApi.handleItemContentChange(
      listId,
      elementId,
      contentUpdate,
      beneficiaries,
      {
        Cookie: cookieHeader || "",
      }
    );

    if (itemContentUpdated.success) {
      return res.status(200).json({
        success: true,
        message: "Item status changed",
        data: itemContentUpdated,
      });
    }
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is9", error);
    res.status(500).json({ error: "Failed to list element" });
  }
}
