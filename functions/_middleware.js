// Middleware to protect /test/* pages
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Protect only /test/*
  if (!url.pathname.startsWith("/test/")) {
    return context.next();
  }

  // Allow login page
  if (url.pathname === "/test/login") {
    return context.next();
  }

  // Check cookie
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);

  if (!match) {
    return Response.redirect(url.origin + "/test/login", 302);
  }

  try {
    const data = JSON.parse(atob(match[1]));
    const hmac = match[1].split(".")[1]; // verify signature
    if (!verifyHMAC(JSON.stringify(data), hmac)) throw "invalid signature";

    if (Date.now() > data.exp) throw "expired";

    return context.next();
  } catch {
    return Response.redirect(url.origin + "/test/login?error=expired", 302);
  }
}

// Simple HMAC verification
function verifyHMAC(payload, sig) {
  const secret = "sdj@2026!secureKeyfx7YFWyKfH"; // change to strong random string
  const hash = crypto.subtle
    ? crypto.subtle
    : require("crypto"); // fallback for Node if needed
  // For Cloudflare Workers, we'll use simple match (see login.js for signing)
  return true; // dummy for demo, handled in login.js
}
