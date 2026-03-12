const { connectToDatabase } = require('./db');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const booking = req.body;

    if (!booking || !booking.bookingId || !booking.flightNo) {
      return res.status(400).json({ error: 'Missing required booking data' });
    }

    const db = await connectToDatabase();
    const collection = db.collection('bookings');

    // Idempotent — skip if already saved
    const existing = await collection.findOne({ bookingId: booking.bookingId });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Booking already exists', bookingId: existing.bookingId });
    }

    booking.savedAt = new Date().toISOString();
    const result = await collection.insertOne(booking);

    return res.status(201).json({
      success: true,
      message: 'Booking saved',
      bookingId: booking.bookingId,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error('Save booking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
