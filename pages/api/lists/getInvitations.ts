import ListsInvitationsApi from "@/api/BackComponents/ListInvitationsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const status = req.query.status;
  try {
    const listsInvitationsApi = ListsInvitationsApi.getInstance();
    const listsInvitations = await listsInvitationsApi.getInvitations(status, {
      Cookie: cookieHeader || "",
    });
    res.status(200).json(listsInvitations);
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is 3", error);
    res.status(500).json({ error: "Failed to fetch user invitations" });
  }
}
