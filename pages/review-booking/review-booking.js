/* ============================================
   TIXXER FLIGHT — Review Booking Page JS
   ============================================ */

// State
let booking = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const stored = sessionStorage.getItem('bookingData');

  if (!stored) {
    window.location.href = '../index/index.html';
    return;
  }

  booking = JSON.parse(stored);

  renderFlightDetails();
  renderPassengerInfo();
  renderSeatClass();
  renderPriceBreakdown();
});

// 1. Flight Details
function renderFlightDetails() {
  const f = booking.flight;
  const search = booking.searchData;
  const fromCity = search?.from?.city || f.from;
  const toCity = search?.to?.city || f.to;
  const dateStr = f.date ? formatDate(new Date(f.date)) : '--';
  const stopsText = f.stops === 0 ? 'Non-stop' : `${f.stops} stop via ${f.stopCity || ''}`;
  const stopsClass = f.stops === 0 ? 'non-stop' : 'has-stop';
  const tripLabel = search?.tripType === 'roundtrip' ? 'Round Trip' : search?.tripType === 'multicity' ? 'Multi City' : 'One Way';

  document.getElementById('flightDetailsBody').innerHTML = `
    <div class="flight-detail-top">
      <div class="fd-airline">
        <img class="fd-airline-logo" src="../../${f.airlineData?.logo}" alt="${f.airlineData?.name || 'Airline'}">
        <div>
          <div class="fd-airline-name">${f.airlineData?.name || 'Airline'}</div>
          <div class="fd-flight-no">${f.flightNo}</div>
        </div>
      </div>
      <div class="fd-date">📅 ${dateStr}</div>
    </div>

    <div class="fd-route">
      <div class="fd-endpoint">
        <div class="fd-time">${f.depTime}</div>
        <div class="fd-code">${f.from}</div>
        <div class="fd-city">${fromCity}</div>
      </div>
      <div class="fd-middle">
        <div class="fd-duration">${f.duration}</div>
        <div class="fd-line-wrap">
          <div class="fd-dot start"></div>
          <div class="fd-line"></div>
          <div class="fd-plane">✈</div>
          <div class="fd-dot end"></div>
        </div>
        <div class="fd-stops ${stopsClass}">${stopsText}</div>
      </div>
      <div class="fd-endpoint">
        <div class="fd-time">${f.arrTime}</div>
        <div class="fd-code">${f.to}</div>
        <div class="fd-city">${toCity}</div>
      </div>
    </div>

    <div class="fd-details-grid">
      <div class="fd-detail-item">
        <div class="fd-detail-label">Airline</div>
        <div class="fd-detail-value">${f.airlineData?.name || 'Airline'}</div>
      </div>
      <div class="fd-detail-item">
        <div class="fd-detail-label">Flight No.</div>
        <div class="fd-detail-value">${f.flightNo}</div>
      </div>
      <div class="fd-detail-item">
        <div class="fd-detail-label">Date</div>
        <div class="fd-detail-value">${dateStr}</div>
      </div>
      <div class="fd-detail-item">
        <div class="fd-detail-label">Departure</div>
        <div class="fd-detail-value">${f.depTime} · ${f.from}</div>
      </div>
      <div class="fd-detail-item">
        <div class="fd-detail-label">Arrival</div>
        <div class="fd-detail-value">${f.arrTime} · ${f.to}</div>
      </div>
      <div class="fd-detail-item">
        <div class="fd-detail-label">Trip Type</div>
        <div class="fd-detail-value">${tripLabel}</div>
      </div>
    </div>
  `;
}

// 2. Passenger Info
function renderPassengerInfo() {
  const search = booking.searchData;
  const travellers = search?.travellers || { adults: 1, children: 0, infants: 0 };
  const totalPax = booking.totalPassengers;

  const chips = [];
  if (travellers.adults > 0) chips.push(`<div class="pax-count-chip"><span class="pax-num">${travellers.adults}</span> Adult${travellers.adults > 1 ? 's' : ''}</div>`);
  if (travellers.children > 0) chips.push(`<div class="pax-count-chip"><span class="pax-num">${travellers.children}</span> Child${travellers.children > 1 ? 'ren' : ''}</div>`);
  if (travellers.infants > 0) chips.push(`<div class="pax-count-chip"><span class="pax-num">${travellers.infants}</span> Infant${travellers.infants > 1 ? 's' : ''}</div>`);

  document.getElementById('passengerBody').innerHTML = `
    <div class="pax-grid">
      <div class="pax-item">
        <div class="pax-label">Total Passengers</div>
        <div class="pax-value">${totalPax} Traveller${totalPax > 1 ? 's' : ''}</div>
      </div>
      <div class="pax-item">
        <div class="pax-label">Trip Type</div>
        <div class="pax-value">${search?.tripType === 'roundtrip' ? 'Round Trip' : search?.tripType === 'multicity' ? 'Multi City' : 'One Way'}</div>
      </div>
      <div class="pax-item">
        <div class="pax-label">Departure Date</div>
        <div class="pax-value">${search?.departDate ? formatDate(new Date(search.departDate)) : '--'}</div>
      </div>
      <div class="pax-item">
        <div class="pax-label">Cabin Class</div>
        <div class="pax-value">${booking.seatClass.name}</div>
      </div>
    </div>
    <div class="pax-breakdown">${chips.join('')}</div>
  `;
}

// 3. Seat Class
function renderSeatClass() {
  const sc = booking.seatClass;
  const icon = seatIcons[sc.id] || '💺';

  const perksHTML = sc.perks.map(p => {
    return `<div class="perk-chip"><span class="perk-chip-icon">✓</span> ${p}</div>`;
  }).join('');

  document.getElementById('seatClassBody').innerHTML = `
    <div class="seat-review-row">
      <div class="seat-review-icon ${sc.id}">${icon}</div>
      <div class="seat-review-info">
        <div class="seat-review-name">${sc.name}</div>
        <div class="seat-review-price-each">₹${sc.pricePerPax.toLocaleString('en-IN')} per person</div>
      </div>
    </div>
    <div class="seat-review-perks">${perksHTML}</div>
  `;
}

// 4. Price Breakdown
function renderPriceBreakdown() {
  const p = booking.pricing;
  const f = booking.flight;
  const sc = booking.seatClass;
  const totalPax = booking.totalPassengers;

  document.getElementById('priceFrom').textContent = f.from;
  document.getElementById('priceTo').textContent = f.to;
  document.getElementById('priceClassBadge').textContent = `${seatIcons[sc.id] || '💺'} ${sc.name} · ${totalPax} Pax`;

  document.getElementById('priceRows').innerHTML = `
    <div class="price-row">
      <div class="price-row-label">
        Base Fare
        <span class="price-sub">₹${sc.pricePerPax.toLocaleString('en-IN')} × ${totalPax} pax</span>
      </div>
      <div class="price-row-value">₹${p.baseFare.toLocaleString('en-IN')}</div>
    </div>
    <div class="price-row">
      <div class="price-row-label">
        Taxes & Fees
        <span class="price-sub">15% of base fare</span>
      </div>
      <div class="price-row-value">₹${p.taxes.toLocaleString('en-IN')}</div>
    </div>
    <div class="price-row">
      <div class="price-row-label">Platform Fee</div>
      <div class="price-row-value">₹${p.platformFee}</div>
    </div>
  `;

  document.getElementById('priceTotal').textContent = `₹${p.total.toLocaleString('en-IN')}`;
  document.getElementById('priceEth').textContent = `≈ ${p.totalETH} ETH`;
}

// Continue to Payment
function continueToPayment() {
  window.location.href = `../payment/payment.html`;
}
