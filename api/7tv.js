export default async function handler(req, res) {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const allowed = [
    'emote-sets/global',
    'users/twitch/',
  ];
  const normalizedPath = String(path);
  const isAllowed = normalizedPath === 'emote-sets/global' || normalizedPath.startsWith('users/twitch/');
  if (!isAllowed) return res.status(400).json({ error: 'Invalid path' });

  try {
    const upstream = await fetch(`https://7tv.io/v3/${normalizedPath}`);
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', 'application/json');
    res.send(body || '{}');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
