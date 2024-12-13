import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // const user = await authenticatedUser({ request, response });

  // if (user) return NextResponse.redirect(new URL("/", request.nextUrl));
  return response;
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: [
    // "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    "/auth/login",
    "/auth/signup",
    "/auth/confirm-signup",
    // TODO: maybe reset password can be done by authenticated users too?
    "/auth/reset-password/submit",
    "/auth/reset-password/confirm",
  ],
};
