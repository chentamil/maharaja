export async function onRequestPost(context) {

  const { request } = context;
  const url = new URL(request.url);

  const form = await request.formData();

  const username = form.get("username");
  const password = form.get("password");

  if (username !== "admin" || password !== "123") {
    return Response.redirect(
      url.origin + "/test/login.html?error=invalid",
      302
    );
  }

  const token = btoa(JSON.stringify({
    u: username,
    exp: Date.now() + 60 * 60 * 1000
  }));

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie":
        `auth=${token}; HttpOnly; Secure; Path=/test; SameSite=Strict`,
      "Location": "/test/"
    }
  });
}
