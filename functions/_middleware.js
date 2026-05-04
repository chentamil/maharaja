export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Protect only /test/* paths
  if (!url.pathname.startsWith("/test/")) {
    return context.next();
  }

  // Allow login/logout functions
  if (url.pathname === "/test/login" || url.pathname === "/test/logout") {
    return context.next();
  }

  // Check auth cookie
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);

  if (!match) {
    return Response.redirect(url.origin + "/test/login", 302);
  }

  try {
    const data = JSON.parse(atob(match[1]));

    if (Date.now() > data.exp) throw "expired";

    return context.next();
  } catch {
    return Response.redirect(url.origin + "/test/login", 302);
  }
}
