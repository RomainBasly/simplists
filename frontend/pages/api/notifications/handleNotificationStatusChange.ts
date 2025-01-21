import NotificationsApi from "@/api/BackComponents/NotificationsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const { notificationId, isNew } = req.body;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const notificationsApi = NotificationsApi.getInstance();
    const notificationStatusChanged =
      await notificationsApi.modifyNotificationStatus(notificationId, isNew, {
        Cookie: cookieHeader || "",
      });

    if (notificationStatusChanged.success) {
      return res.status(200).json({
        success: true,
        message: "Notification status changed",
        data: notificationStatusChanged,
      });
    }
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is20", error);
    res
      .status(500)
      .json({ error: "Failed to change the status of the notification" });
  }
}
