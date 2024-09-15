import ListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const {
    listName,
    invitedEmails,
    thematic,
    accessLevel,
    description,
    cyphered,
  } = req.body;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const listsApi = ListsApi.getInstance();

    const listCreated = await listsApi.createList(
      listName,
      invitedEmails,
      thematic,
      accessLevel,
      description,
      cyphered,
      {
        Cookie: cookieHeader || "",
      }
    );

    return res.status(200).json({
      message: "List created",
      listCreated,
    });
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is2", error);
    res.status(500).json({ error: "Failed to create the list" });
  }
}
