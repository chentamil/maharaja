export async function onRequest(context) {

  const cookie = context.request.headers.get("Cookie") || "";

  return new Response(JSON.stringify({
    cookieReceived: cookie,
    hasCookie: cookie.includes("sb_access_token")
  }), {
    headers: { "Content-Type": "application/json" }
  });
}