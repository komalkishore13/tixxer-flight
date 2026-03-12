const { connectToDatabase } = require('./db');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = await connectToDatabase();
    const collection = db.collection('bookings');

    const filter = {};
    if (req.query.wallet) {
      filter.walletAddress = req.query.wallet;
    }

    const bookings = await collection
      .find(filter)
      .sort({ bookedAt: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
