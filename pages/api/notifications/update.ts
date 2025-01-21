import NotificationsApi from "@/api/BackComponents/NotificationsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  const { subscription, userAgent } = req.body;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const userNotificationsApi = NotificationsApi.getInstance();

    const data = await userNotificationsApi.setNotificationsPreferences(
      {
        Cookie: cookieHeader || "",
      },
      "update",
      subscription,
      userAgent
    );

    return res.status(200).json(data);
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is17", error);
    res
      .status(500)
      .json({ error: "Failed to update notifications preferences" });
  }
}
