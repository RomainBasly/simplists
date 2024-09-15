import { AuthorizationApi } from "@/api/BackComponents/AuthorizationApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;
  try {
    const refreshTokenApi = AuthorizationApi.getInstance();

    if (cookieHeader) {
      const newAccessToken = await refreshTokenApi.getNewAccessToken({
        Cookie: { refreshToken: cookieHeader },
      });
      if (!newAccessToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      return res.status(200).json({ accessToken: newAccessToken });
    } else {
      throw new Error("error getting the cookieHeader from the request");
    }
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is10", error);
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
}
