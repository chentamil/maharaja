export async function onRequest(context) {

  const { request } = context;
  const url = new URL(request.url);

  // Protect only /test/*
  if (!url.pathname.startsWith("/test/")) {
    return context.next();
  }

  // Allow login page
  if (url.pathname === "/test/login.html") {
    return context.next();
  }

  // Check cookie
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);

  if (!match) {
    return Response.redirect(
      url.origin + "/test/login.html",
      302
    );
  }

  try {
    const data = JSON.parse(atob(match[1]));

    if (Date.now() > data.exp) throw "expired";

    return context.next();

  } catch {
    return Response.redirect(
      url.origin + "/test/login.html",
      302
    );
  }
}
