export default async function handler(req, res) {
  const { path, key } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });
  if (!key)  return res.status(400).json({ error: 'Missing key' });

  try {
    const r    = await fetch(`https://www.googleapis.com/youtube/v3/${path}&key=${key}`);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
