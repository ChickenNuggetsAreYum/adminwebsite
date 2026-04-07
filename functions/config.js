export async function onRequestGet(context) {
  const scriptUrl = context.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return new Response(JSON.stringify({ error: "Missing GOOGLE_SCRIPT_URL env var" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({
    googleScriptUrl: scriptUrl
  }), {
    headers: { "Content-Type": "application/json" },
  });
}