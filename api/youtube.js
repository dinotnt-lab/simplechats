export default async function handler(req, res) {
  const path = String(req.query.path || '');
  const key = String(req.query.key || '');
  if (!path) return res.status(400).json({ error: 'Missing path' });
  if (!key) return res.status(400).json({ error: 'Missing key' });

  try {
    const url = `https://www.googleapis.com/youtube/v3/${path}&key=${encodeURIComponent(key)}`;
    const r = await fetch(url);
    const text = await r.text();

    if (!text) {
      if (!r.ok) {
        return res.status(r.status).json({ error: `YouTube API request failed with status ${r.status}` });
      }
      return res.status(r.status).json({});
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return res.status(r.status).json({ error: `Invalid JSON from YouTube API: ${err.message}` });
    }

    if (!r.ok) {
      const errorMessage = data?.error?.message || data?.error || `YouTube API request failed with status ${r.status}`;
      return res.status(r.status).json({ error: errorMessage });
    }

    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
