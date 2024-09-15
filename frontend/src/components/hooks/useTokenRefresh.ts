import JwtService from "@/Services/jwtService";
import Cookies from "js-cookie";

export const useTokenRefresh = () => {
  let accessToken = Cookies.get("accessToken");
  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (
      refreshToken &&
      !JwtService.getInstance().isTokenExpired(refreshToken)
    ) {
      try {
        const response = await fetch(`/api/token/getNewAccessToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ refreshToken }),
        });
        const result = await response.json();
        accessToken = result.accessToken;
      } catch (error) {
        throw new Error("Failed to refresh access token");
      }
    } else {
      throw new Error("Refresh token is invalid or expired");
    }
  };

  return { accessToken, refreshAccessToken };
};
