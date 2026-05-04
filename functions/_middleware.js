// /functions/_middleware.js
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Only protect /test/* paths
  if (!url.pathname.startsWith("/test/")) {
    return context.next();
  }

  // Allow login/logout function routes
  if (
    url.pathname === "/test/login" ||  // function route
    url.pathname === "/test/logout"    // function route
  ) {
    return context.next();
  }

  // Check for auth cookie
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);

  // If no cookie, redirect to login function
  if (!match) {
    return Response.redirect(url.origin + "/test/login", 302);
  }

  try {
    const data = JSON.parse(atob(match[1]));

    // If token expired, redirect to login
    if (Date.now() > data.exp) throw "expired";

    // Authorized, continue to requested page
    return context.next();
  } catch {
    // Invalid or expired token
    return Response.redirect(url.origin + "/test/login", 302);
  }
}
