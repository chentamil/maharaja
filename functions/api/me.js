export async function onRequest(context) {

  const cookie = context.request.headers.get("Cookie") || "";

  console.log("COOKIE HEADER:", cookie);

  const tokenMatch = cookie.match(/sb_access_token=([^;]+)/);

  if (!tokenMatch) {
    return new Response(JSON.stringify({
      error: "No cookie found"
    }), { status: 401 });
  }

  return Response.json({
    authenticated: true,
    tokenPreview: tokenMatch[1].slice(0, 10)
  });
}