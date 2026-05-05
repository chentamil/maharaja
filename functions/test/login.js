// Login function
export async function onRequestPost(context) {
  const { request } = context;
  const url = new URL(request.url);

  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  // Simple credentials check
  if (username !== "admin" || password !== "123") {
    return Response.redirect(url.origin + "/test/login?error=invalid", 302);
  }

  // Create session payload
  const payload = {
    u: username,
    exp: Date.now() + 60 * 60 * 1000 // 1 hour
  };

  const payloadB64 = btoa(JSON.stringify(payload));
  const sig = await signHMAC(payloadB64);

  const token = `${payloadB64}.${sig}`;

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": `auth=${token}; HttpOnly; Secure; Path=/test; SameSite=Strict`,
      "Location": "/test/ka/kabill" // <-- redirect to your desired page
    }
  });
}

// Sign payload using HMAC
async function signHMAC(payload) {
  const secret = "sdj@2026!secureKeyfx7YFWyKfH"; // same secret as middleware
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
}
