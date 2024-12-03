import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // TODO: cache this user for other components to access
  const user = await authenticatedUser({ request, response });

  //   const isOnDashboard = request.nextUrl.pathname.startsWith("/");

  //   if (isOnDashboard) {
  //     if (!user)
  //       return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  //     return response;
  //   } else if (user) {
  //     return NextResponse.redirect(new URL("/", request.nextUrl));
  //   }
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
