import UserListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const listId = req.query.listId;

  try {
    const listUserApi = UserListsApi.getInstance();
    const data = await listUserApi.getListDefinitionByListId(listId, {
      Cookie: cookieHeader || "",
    });
    return res.status(200).json(data);
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is5", error);
    res.status(500).json({ error: "Failed to fetch list Definition" });
  }
}
