export default async function handler(req, res) {
  const path = String(req.query.path || '');
  const key = String(req.query.key || '');
  const authHeader = String(req.headers.authorization || '');
  if (!path) return res.status(400).json({ error: 'Missing path' });
  if (!authHeader && !key) return res.status(401).json({ error: 'Missing API key or authorization token' });

  try {
    const [pathname, search = ''] = path.split('?');
    const url = new URL(`https://www.googleapis.com/youtube/v3/${pathname}`);
    if (search) url.search = search;
    if (key && !authHeader) url.searchParams.set('key', key);

    const headers = {};
    if (authHeader) headers.Authorization = authHeader;

    const r = await fetch(url.toString(), { headers });
    const text = await r.text();

    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        return res.status(r.status).json({ error: `Invalid JSON from YouTube API: ${err.message}`, raw: text });
      }
    }

    if (!r.ok) {
      const errorMessage = data?.error?.message || data?.error || text || `YouTube API request failed with status ${r.status}`;
      return res.status(r.status).json({ error: errorMessage, detail: data || text });
    }

    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
