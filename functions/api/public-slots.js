export async function onRequest(context) {

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_KEY = context.env.SUPABASE_ANON_KEY;

  const cache = caches.default;

  // Current request
  const cacheKey = new Request(context.request.url, context.request);

  // Try cache first
  let response = await cache.match(cacheKey);

  if (response) {
    return response;
  }

  try {

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/slots?select=*,courts(id,name)`,
      {
        headers: {
          apikey: SUPABASE_KEY
        }
      }
    );

    const data = await res.json();

    response = new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "x-cache-status": "MISS",
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