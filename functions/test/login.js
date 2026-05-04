export async function onRequestPost(context) {
  const { request } = context;
  const url = new URL(request.url);

  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  // Simple credentials check
  if (username !== "admin" || password !== "123") {
    return Response.redirect(
      url.origin + "/test/login?error=invalid",
      302
    );
  }

  // Create token
  const token = btoa(JSON.stringify({
    u: username,
    exp: Date.now() + 60 * 60 * 1000 // 1 hour expiry
  }));

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": `auth=${token}; HttpOnly; Secure; Path=/test; SameSite=Strict`,
      "Location": "/test/" // redirect to protected area
    }
  });
}

// Allow GET to show login page (optional JSON message or custom page)
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const params = url.searchParams;
  const error = params.get("error") || "";

  return new Response(`
    <h2>Login Page</h2>
    ${error ? `<p style="color:red">${error}</p>` : ""}
    <form action="/test/login" method="POST">
      <input name="username" placeholder="Username" required>
      <input name="password" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `, {
    headers: { "Content-Type": "text/html" }
  });
}
