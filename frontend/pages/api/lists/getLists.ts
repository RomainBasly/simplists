import UserListsApi from "@/api/BackComponents/UserListsApi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookieHeader = req.headers.cookie;

  try {
    const listUserApi = UserListsApi.getInstance();

    const data = await listUserApi.getListsByUser({
      Cookie: cookieHeader || "",
    });

    return res.status(200).json(data);
  } catch (error) {
    // Handle errors (e.g., from your backend call)
    console.log("error is14", error);
    res.status(500).json({ error: "Failed to fetch lists" });
  }
}
