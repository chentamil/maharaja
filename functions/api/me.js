export async function onRequest(context) {

  const cookieHeader =
    context.request.headers.get("Cookie") || "";

  console.log("RAW COOKIE HEADER:", cookieHeader);

  // safer parsing (IMPORTANT)
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map(c => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );

  const token = cookies.sb_access_token;

  if (!token) {
    return Response.json({
      authenticated: false,
      reason: "sb_access_token missing"
    }, { status: 401 });
  }

  return Response.json({
    authenticated: true
  });
}