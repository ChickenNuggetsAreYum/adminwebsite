export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing q parameter" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  const apiKey = context.env.SERPAPI_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing SERPAPI_KEY in env vars" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  const serpUrl =
    `https://serpapi.com/search.json?engine=bing_images&q=${encodeURIComponent(query)}&api_key=${apiKey}`;

  const res = await fetch(serpUrl);
  const data = await res.json();

  const results = (data.images_results || []).slice(0, 10).map(img => ({
    thumbnail: img.thumbnail,
    original: img.original,
    title: img.title,
    source: img.source,
    link: img.link
  }));

  return new Response(JSON.stringify({ query, results }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}