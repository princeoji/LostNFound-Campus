import { getItems, saveItems } from './lib/itemsStore.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // ─── GET /api/items ── Return all items ──────────────
  if (req.method === 'GET') {
    try {
      const items = await getItems();
      return res.status(200).json(items);
    } catch (error) {
      console.error('GET items error:', error);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
  }

  // ─── POST /api/items ── Create a new item ────────────
  if (req.method === 'POST') {
    try {
      const { image, category, description, location, uploadedBy, uploaderName } = req.body;

      if (!image || !category || !description || !location || !uploadedBy) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newItem = {
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        image,        // This is now a Vercel Blob URL
        category,
        description,
        location,
        uploadedBy,
        uploaderName: uploaderName || 'Unknown',
        timestamp: new Date().toISOString(),
      };

      const items = await getItems();
      items.push(newItem);
      await saveItems(items);

      return res.status(201).json(newItem);
    } catch (error) {
      console.error('POST items error:', error);
      return res.status(500).json({ error: 'Failed to create item' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
