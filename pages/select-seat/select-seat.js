/* ============================================
   TIXXER FLIGHT — Seat Selection Page JS
   ============================================ */

// State
let flight = null;
let searchData = null;
let selectedClass = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const flightStored = sessionStorage.getItem('selectedFlight');
  const searchStored = sessionStorage.getItem('flightSearch');

  if (!flightStored) {
    window.location.href = '../index/index.html';
    return;
  }

  flight = JSON.parse(flightStored);
  searchData = searchStored ? JSON.parse(searchStored) : null;

  renderFlightSummary();
  renderSeatClassCards('seatClassesGrid', FlightData.seatClasses, flight.basePrice, 'selectSeatClass');
  updateFareSidebar();
});

// Render Flight Summary
function renderFlightSummary() {
  const container = document.getElementById('flightSummary');
  const fromCity = searchData?.from?.city || flight.from;
  const toCity = searchData?.to?.city || flight.to;
  const dateStr = flight.date ? formatDate(new Date(flight.date)) : '--';
  const stopsText = flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`;
  const stopsClass = flight.stops === 0 ? 'non-stop' : 'has-stop';

  container.innerHTML = `
    <div class="summary-top">
      <div class="summary-airline">
        <img class="summary-airline-logo" src="../../${flight.airlineData?.logo}" alt="${flight.airlineData?.name || 'Airline'}">
        <div class="summary-airline-info">
          <div class="airline-name">${flight.airlineData?.name || 'Airline'}</div>
          <div class="flight-no">${flight.flightNo} · Boeing 737-800</div>
        </div>
      </div>
      <div class="summary-date-badge">📅 ${dateStr}</div>
    </div>

    <div class="flight-route-visual">
      <div class="route-endpoint">
        <div class="route-time">${flight.depTime}</div>
        <div class="route-code">${flight.from}</div>
        <div class="route-city">${fromCity}</div>
        <div class="route-terminal">Terminal 3</div>
      </div>
      <div class="route-middle">
        <div class="route-duration">${flight.duration}</div>
        <div class="route-line-container">
          <div class="route-line-dot-start"></div>
          <div class="route-line"></div>
          <div class="route-plane-icon">✈</div>
          <div class="route-line-dot-end"></div>
        </div>
        <div class="route-stops ${stopsClass}">${stopsText}</div>
      </div>
      <div class="route-endpoint">
        <div class="route-time">${flight.arrTime}</div>
        <div class="route-code">${flight.to}</div>
        <div class="route-city">${toCity}</div>
        <div class="route-terminal">Terminal 2</div>
      </div>
    </div>

    <div class="flight-meta">
      <div class="meta-chip"><span class="meta-icon">✈</span> ${flight.airlineData?.name || 'Airline'}</div>
      <div class="meta-chip"><span class="meta-icon">🎫</span> ${flight.flightNo}</div>
      <div class="meta-chip"><span class="meta-icon">⏱️</span> ${flight.duration}</div>
      <div class="meta-chip"><span class="meta-icon">🛄</span> Check-in Baggage Included</div>
      <div class="meta-chip"><span class="meta-icon">🍽️</span> In-flight Meals</div>
    </div>
  `;
}

// Select Seat Class
function selectSeatClass(classId) {
  selectedClass = FlightData.seatClasses.find(sc => sc.id === classId);
  if (!selectedClass) return;

  document.querySelectorAll('.seat-card').forEach(card => card.classList.remove('selected'));
  document.getElementById(`seat-${classId}`).classList.add('selected');

  updateFareSidebar();

  const btn = document.getElementById('btnContinue');
  btn.disabled = false;
  btn.classList.add('active');
  btn.textContent = `Continue with ${selectedClass.name} →`;
}

// Update Fare Sidebar
function updateFareSidebar() {
  document.getElementById('fareRoute').innerHTML = `
    <span class="fare-from">${flight.from}</span>
    <span class="fare-arrow">→</span>
    <span class="fare-to">${flight.to}</span>
  `;

  if (!selectedClass) {
    document.getElementById('fareBase').textContent = '--';
    document.getElementById('fareTax').textContent = '--';
    document.getElementById('farePlatform').textContent = '--';
    document.getElementById('fareTotal').textContent = '--';
    document.getElementById('fareEth').textContent = '≈ -- ETH';
    return;
  }

  const totalPax = searchData
    ? searchData.travellers.adults + searchData.travellers.children + searchData.travellers.infants
    : 1;

  const basePrice = Math.round(flight.basePrice * selectedClass.priceMultiplier);
  const taxes = Math.round(basePrice * 0.15);
  const platformFee = 50;
  const totalPerPax = basePrice + taxes + platformFee;
  const grandTotal = totalPerPax * totalPax;
  const ethPrice = (grandTotal / 215000).toFixed(4);

  document.getElementById('fareBase').textContent = `₹${(basePrice * totalPax).toLocaleString('en-IN')}`;
  document.getElementById('fareTax').textContent = `₹${(taxes * totalPax).toLocaleString('en-IN')}`;
  document.getElementById('farePlatform').textContent = `₹${platformFee}`;
  document.getElementById('fareTotal').textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  document.getElementById('fareEth').textContent = `≈ ${ethPrice} ETH`;
}

// Continue to Review
function continueToReview() {
  if (!selectedClass) return;

  const totalPax = searchData
    ? searchData.travellers.adults + searchData.travellers.children + searchData.travellers.infants
    : 1;

  const basePrice = Math.round(flight.basePrice * selectedClass.priceMultiplier);
  const taxes = Math.round(basePrice * 0.15);
  const platformFee = 50;
  const totalPerPax = basePrice + taxes + platformFee;
  const grandTotal = totalPerPax * totalPax;
  const ethPrice = (grandTotal / 215000).toFixed(4);

  const bookingData = {
    flight,
    searchData,
    seatClass: {
      id: selectedClass.id,
      name: selectedClass.name,
      pricePerPax: basePrice,
      perks: selectedClass.perks.map(p => p.text),
    },
    pricing: {
      baseFare: basePrice * totalPax,
      taxes: taxes * totalPax,
      platformFee,
      total: grandTotal,
      totalETH: ethPrice,
      perPax: totalPerPax,
    },
    totalPassengers: totalPax,
  };

  sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
  window.location.href = `../review-booking/review-booking.html`;
}
