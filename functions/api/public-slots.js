export async function onRequest() {

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_KEY = context.env.SUPABASE_ANON_KEY;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/slots?select=*,courts(id,name)`,
    {
      headers: {
        apikey: SUPABASE_KEY
      }
    }
  );

  const data = await res.json();

  return Response.json(data);
}