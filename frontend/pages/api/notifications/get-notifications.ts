import NotificationsApi from "@/api/BackComponents/NotificationsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;

  try {
    const userNotificationsApi = NotificationsApi.getInstance();
    const data = await userNotificationsApi.getNotifications({
      Cookie: cookieHeader || "",
    });

    return res.status(200).json(data);
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is18", error);
    res.status(500).json({ error: "Failed to get notifications" });
  }
}
