export async function onRequest(context) {

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_KEY = context.env.SUPABASE_ANON_KEY;

  const cache = caches.default;

  const cacheKey = new Request(context.request.url, context.request);

  // Try edge cache first
  const cached = await cache.match(cacheKey);

  if (cached) {
    return cached;
  }

  try {

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/slots?select=*,courts(id,name)`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await res.json();

    const response = new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=150, stale-while-revalidate=30",
        "x-generated-at": Date.now().toString()
      }
    });

    // Store in Cloudflare edge cache
    context.waitUntil(
      cache.put(cacheKey, response.clone())
    );

    return response;

  } catch (err) {

    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });

  }
}