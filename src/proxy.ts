// middleware will be working on 2 sides
// 1- for the admin routes
// 2- for the user routes to get the restaurantId to be sent with each request will be created by the user

//http://192.168.1.12:3000/villa9?table=2

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const userToken = request.cookies.get("userToken")?.value;

  const { pathname } = request.nextUrl;

  ///// ==========================handle the admin routes and log in ===================================

  // if there is no token and the user is trying to access any of the admin routes without login
  // then ====> it has to be redirect to the login page
  if (!userToken && pathname.startsWith("/admin/a7fK29xP")) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // if the user login and try to access the dashboard, give him access to do so if there is a token stored
  if (userToken && pathname === "/admin/login") {
    const dashboardUrl = new URL("/admin/a7fK29xP", request.url);
    return NextResponse.redirect(dashboardUrl);
  }
}

export const config = {
  matcher: "/admin/:path*",
  // matcher: ["/admin/:path*", "/menu/:path*"],
  // matcher: [
  //   "/admin/:path*",
  //   "/((?!api|_next/static|_next/image|favicon.ico).*)",
  // ],
};
