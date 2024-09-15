import UserListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const listId = req.query.listId;

  if (!listId || typeof listId !== "string") {
    return res.status(400).json({ error: "Invalid or missing listId" });
  }

  try {
    const listApi = UserListsApi.getInstance();
    const listItems = await listApi.getListItemsByListId(listId, {
      Cookie: cookieHeader || "",
    });
    res.status(200).json(listItems);
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is4", error);
    res.status(500).json({ error: "Failed to fetch listsItems" });
  }
}
