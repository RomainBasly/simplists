import NotificationsApi from "@/api/BackComponents/NotificationsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const { notificationId } = req.body;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const notificationApi = NotificationsApi.getInstance();
    const itemSuppressed = await notificationApi.deleteNotification(
      notificationId,
      {
        Cookie: cookieHeader || "",
      }
    );

    if (itemSuppressed.success) {
      return res.status(200).json({
        success: true,
        message: "Notification suppressed",
      });
    }
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is19", error);
    res
      .status(500)
      .json({ error: "Failed to suppress the notification of the list" });
  }
}
