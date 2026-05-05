const USERS = [
  { u: "admin", p: "123" },
  { u: "sdj2", p: "456" }
];

// Rate limit store
const RATE_LIMIT = 5; // max attempts
const RATE_WINDOW = 10 * 60 * 1000; // 10 min
const attempts = new Map();

const SECRET = "sdj@2026!secureKeyfx7YFWyKfH"; // change to random secret

export async function onRequestPost(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Rate limiting by IP
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const timestamps = (attempts.get(ip) || []).filter(t => now - t < RATE_WINDOW);
  timestamps.push(now);
  attempts.set(ip, timestamps);
  if (timestamps.length > RATE_LIMIT) {
    return Response.redirect(url.origin + "/test/login?error=rate", 302);
  }

  // Get form data
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  const user = USERS.find(u => u.u === username && u.p === password);
  if (!user) {
    return Response.redirect(url.origin + "/test/login?error=invalid", 302);
  }

  // Create session token
  const payload = JSON.stringify({ u: username, exp: Date.now() + 60 * 60 * 1000 });
  const sig = await hmac(payload);
  const token = btoa(payload) + "." + sig;

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": `auth=${token}; HttpOnly; Secure; Path=/test; SameSite=Strict`,
      "Location": "/test/ka/kabill" // redirect after login
    }
  });
}

// HMAC signing function
async function hmac(str) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(str));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}
