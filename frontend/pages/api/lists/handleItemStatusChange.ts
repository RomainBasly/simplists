import ListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const elementId = req.body.elementId;
  const listId = req.body.listId;
  const statusOpen = req.body.statusOpen;
  const beneficiaries = req.body.beneficiaries;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const listsApi = ListsApi.getInstance();
    const itemStatusChanged = await listsApi.handleItemStatusChange(
      listId,
      elementId,
      statusOpen,
      beneficiaries,
      {
        Cookie: cookieHeader || "",
      }
    );

    if (itemStatusChanged.success) {
      return res.status(200).json({
        success: true,
        message: "Item status changed",
        data: itemStatusChanged,
      });
    }
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is7", error);
    res.status(500).json({ error: "Failed to change the status of the item" });
  }
}