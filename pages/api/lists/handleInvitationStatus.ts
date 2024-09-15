import ListInvitationsApi from "@/api/BackComponents/ListInvitationsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const listId = req.body.listId;
  const invitationId = req.body.invitationId;
  const status = req.body.status;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const invitationsApi = ListInvitationsApi.getInstance();

    await invitationsApi.handleInvitationStatus(listId, invitationId, status, {
      Cookie: cookieHeader || "",
    });

    return res.status(200).json({ message: "List modified" });
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is6", error);
    res.status(500).json({ error: "Failed to change list invitations" });
  }
}
