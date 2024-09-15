import ListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const { id, updatedCoreData, updatedEmails } = req.body;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const listsApi = ListsApi.getInstance();

    const listUpdated = await listsApi.updateListSettings(
      id,
      updatedCoreData,
      updatedEmails,
      { Cookie: cookieHeader || "" }
    );

    return res.status(200).json({
      message: "List settings updated",
      listUpdated,
    });
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is11", error);
    res.status(500).json({ error: "Failed to update list settings" });
  }
}
