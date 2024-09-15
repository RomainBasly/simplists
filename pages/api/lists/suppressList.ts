import ListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const listId = req.body.id;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const listsApi = ListsApi.getInstance();

    const listSuppressed = await listsApi.suppressList(listId, {
      Cookie: cookieHeader || "",
    });

    return res.status(200).json({
      message: "List suppressed",
      listSuppressed,
      success: "ok",
    });
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is 13", error);
    res.status(500).json({ error: "Failed to suppress the list" });
  }
}
