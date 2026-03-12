/* ============================================
   TIXXER FLIGHT — My Trips Page JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Render localStorage data instantly
  const localTrips = JSON.parse(localStorage.getItem('tixxer_trips') || '[]');
  renderTrips(localTrips);

  // Then fetch from MongoDB and merge
  fetchTripsFromDB(localTrips);
});

async function fetchTripsFromDB(localTrips) {
  try {
    const res = await fetch('/api/get-bookings');
    if (!res.ok) return;

    const data = await res.json();
    const remoteTrips = data.bookings || [];

    if (remoteTrips.length === 0 && localTrips.length > 0) return;

    // Merge: remote is source of truth, keep local-only bookings
    const tripMap = new Map();
    for (const t of remoteTrips) tripMap.set(t.bookingId, t);
    for (const t of localTrips) {
      if (!tripMap.has(t.bookingId)) tripMap.set(t.bookingId, t);
    }

    const merged = Array.from(tripMap.values()).sort(
      (a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)
    );

    localStorage.setItem('tixxer_trips', JSON.stringify(merged));
    renderTrips(merged);
  } catch (err) {
    console.warn('MongoDB fetch failed:', err.message);
  }
}

function renderTrips(trips) {
  const listEl = document.getElementById('tripsList');
  const emptyEl = document.getElementById('tripsEmpty');

  if (trips.length === 0) {
    emptyEl.style.display = 'flex';
    listEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  listEl.style.display = 'flex';

  listEl.innerHTML = trips.map(trip => {
    const stopsText = trip.stops === 0 ? 'Non-stop' : `${trip.stops} stop`;
    const dateStr = trip.date ? formatDate(new Date(trip.date)) : '--';
    const bookedDate = trip.bookedAt ? formatDate(new Date(trip.bookedAt)) : '--';
    const txShort = trip.txHash ? trip.txHash.slice(0, 10) + '...' + trip.txHash.slice(-6) : '--';
    const logoSrc = trip.airlineLogo ? `../../${trip.airlineLogo}` : '';

    return `
      <div class="trip-card">
        <div class="trip-card-top">
          <div class="trip-status-badge confirmed">Confirmed</div>
          <div class="trip-booking-id">${trip.bookingId}</div>
        </div>

        <div class="trip-route-section">
          <div class="trip-endpoint">
            <div class="trip-code">${trip.from}</div>
            <div class="trip-city">${trip.fromCity}</div>
            <div class="trip-time">${trip.depTime}</div>
          </div>
          <div class="trip-route-mid">
            <div class="trip-flight-info">
              ${logoSrc ? `<img class="trip-airline-logo" src="${logoSrc}" alt="${trip.airlineName}">` : ''}
              <span class="trip-flight-no">${trip.flightNo}</span>
            </div>
            <div class="trip-route-line">
              <div class="trip-dot"></div>
              <div class="trip-line"></div>
              <div class="trip-plane">✈</div>
              <div class="trip-line"></div>
              <div class="trip-dot"></div>
            </div>
            <div class="trip-dur">${trip.duration} · ${stopsText}</div>
          </div>
          <div class="trip-endpoint">
            <div class="trip-code">${trip.to}</div>
            <div class="trip-city">${trip.toCity}</div>
            <div class="trip-time">${trip.arrTime}</div>
          </div>
        </div>

        <div class="trip-details-row">
          <div class="trip-detail">
            <span class="trip-detail-label">Date</span>
            <span class="trip-detail-value">${dateStr}</span>
          </div>
          <div class="trip-detail">
            <span class="trip-detail-label">Class</span>
            <span class="trip-detail-value">${trip.seatClass}</span>
          </div>
          <div class="trip-detail">
            <span class="trip-detail-label">Passengers</span>
            <span class="trip-detail-value">${trip.passengers}</span>
          </div>
          <div class="trip-detail">
            <span class="trip-detail-label">Paid</span>
            <span class="trip-detail-value trip-price">₹${trip.totalINR.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="trip-footer-row">
          <div class="trip-meta">
            <span class="trip-meta-label">Booked:</span> ${bookedDate}
          </div>
          <div class="trip-meta">
            <span class="trip-meta-label">Tx:</span>
            <a class="trip-tx-link" href="https://sepolia.etherscan.io/tx/${trip.txHash}" target="_blank">${txShort}</a>
          </div>
          <div class="trip-eth-badge">${trip.totalETH} ETH</div>
        </div>
      </div>
    `;
  }).join('');
}
