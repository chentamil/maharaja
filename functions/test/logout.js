export async function onRequest() {
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie":
        "auth=deleted; Path=/test; Max-Age=0",
      "Location": "/test/login.html"
    }
  });
}
