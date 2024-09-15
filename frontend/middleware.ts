import CspService from "@/Services/cspServices";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/faq",
  "/register/verify-code",
  "/register/add-password",
];
const LOGIN_PATH = "/login";
const HOME_PATH = "/home";

const isPublicPath = (pathname: string) => PUBLIC_PATHS.includes(pathname);

const handlePublicPaths = (
  url: URL,
  accessToken: string | undefined,
  response: NextResponse
) => {
  if (isPublicPath(url.pathname)) {
    if (
      accessToken &&
      (url.pathname === "/login" || url.pathname === "/register")
    ) {
      url.pathname = HOME_PATH;
      return NextResponse.redirect(url);
    }
    return response;
  }
  return null;
};

const handleTokens = (
  url: URL,
  accessToken: string | undefined,
  refreshToken: string | undefined,
  response: NextResponse
) => {
  if (!accessToken && !refreshToken) {
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  // If there's a refreshToken, the page component will handle refreshing the accessToken
  return response;
};

const handleRootPath = (
  url: URL,
  accessToken: string | undefined,
  refreshToken: string | undefined
) => {
  if (url.pathname === "/" && (accessToken || refreshToken)) {
    url.pathname = HOME_PATH;
    return NextResponse.redirect(url);
  }
  return null;
};

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { nonce, contentSecurityPolicyHeaderValue } =
    CspService.getInstance().initiateCsp();

  const url = request.nextUrl.clone();
  const response = NextResponse.next();

  response.headers.set("x-nonce", nonce);
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );
  // Handle public paths
  const publicPathResponse = handlePublicPaths(url, accessToken, response);
  if (publicPathResponse) return publicPathResponse;

  // Handle redirection from root path
  const rootPathResponse = handleRootPath(url, accessToken, refreshToken);
  if (rootPathResponse) return rootPathResponse;

  // Handle token validation and redirection
  const tokenResponse = handleTokens(url, accessToken, refreshToken, response);
  if (tokenResponse) return tokenResponse;

  return response;
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/lists/create-list",
    "/profile",
    "/((?!api|_next/static|favicon.ico).*)",
  ],
  api: {
    bodyParser: true,
  },
};
