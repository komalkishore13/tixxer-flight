/* ============================================
   TIXXER FLIGHT — Flight Results Page JS
   ============================================ */

// ─── State ───────────────────────────────────
let searchData = null;
let allFlights = [];
let filteredFlights = [];

let filters = {
  sort: 'best',
  maxPrice: 10000,
  timeSlot: null,
  stops: [0, 1],
  airlines: [],
};

// ─── Initialization ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const stored = sessionStorage.getItem('flightSearch');
  const params = new URLSearchParams(window.location.search);

  if (stored) {
    searchData = JSON.parse(stored);
  } else if (params.get('from') && params.get('to')) {
    searchData = {
      from: { code: params.get('from'), city: params.get('from') },
      to: { code: params.get('to'), city: params.get('to') },
      departDate: params.get('date') || new Date().toISOString().split('T')[0],
      tripType: params.get('trip') || 'oneway',
      travellers: {
        adults: parseInt(params.get('adults')) || 1,
        children: parseInt(params.get('children')) || 0,
        infants: parseInt(params.get('infants')) || 0,
      },
    };
  } else {
    window.location.href = '../index/index.html';
    return;
  }

  renderSummary();
  showLoading();
  setTimeout(() => {
    allFlights = FlightData.generateFlights(searchData.from.code, searchData.to.code, searchData.departDate);
    filters.airlines = FlightData.airlines.map(a => a.code);

    // Set price slider max to highest flight price (rounded up to nearest 500)
    const maxFlightPrice = Math.max(...allFlights.map(f => f.basePrice));
    const sliderMax = Math.ceil(maxFlightPrice / 500) * 500;
    const slider = document.getElementById('priceSlider');
    slider.max = sliderMax;
    slider.value = sliderMax;
    filters.maxPrice = sliderMax;
    document.getElementById('priceMax').textContent = `\u20B9${sliderMax.toLocaleString('en-IN')}`;

    applyFilters();
    renderFilters();
    hideLoading();
  }, 1500);
});

// ─── Render Search Summary ───────────────────
function renderSummary() {
  const totalPax = searchData.travellers.adults + searchData.travellers.children + searchData.travellers.infants;
  const dateStr = formatDate(new Date(searchData.departDate));
  const tripLabel = searchData.tripType === 'roundtrip' ? 'Round Trip' : searchData.tripType === 'multicity' ? 'Multi City' : 'One Way';

  document.getElementById('summaryFrom').textContent = searchData.from.code;
  document.getElementById('summaryFromCity').textContent = searchData.from.city;
  document.getElementById('summaryTo').textContent = searchData.to.code;
  document.getElementById('summaryToCity').textContent = searchData.to.city;
  document.getElementById('summaryTrip').textContent = tripLabel;
  document.getElementById('summaryDate').textContent = dateStr;
  document.getElementById('summaryPax').textContent = `${totalPax} Traveller${totalPax > 1 ? 's' : ''}`;
}

// ─── Loading ─────────────────────────────────
function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
  document.getElementById('flightsList').style.display = 'none';
}

function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
  document.getElementById('flightsList').style.display = 'flex';
}

// ─── Apply Filters & Sort ────────────────────
function applyFilters() {
  let flights = [...allFlights];

  flights = flights.filter(f => f.basePrice <= filters.maxPrice);

  if (filters.timeSlot) {
    flights = flights.filter(f => {
      const hour = parseInt(f.depTime.split(':')[0]);
      switch (filters.timeSlot) {
        case 'morning':   return hour >= 6 && hour < 12;
        case 'afternoon': return hour >= 12 && hour < 18;
        case 'evening':   return hour >= 18 && hour < 24;
        case 'night':     return hour >= 0 && hour < 6;
        default: return true;
      }
    });
  }

  flights = flights.filter(f => filters.stops.includes(f.stops));

  if (filters.airlines.length > 0 && filters.airlines.length < FlightData.airlines.length) {
    flights = flights.filter(f => filters.airlines.includes(f.airline));
  }

  switch (filters.sort) {
    case 'best':
      // Balanced score: normalize price + duration, weight equally
      const prices = flights.map(f => f.basePrice);
      const durations = flights.map(f => f.durationMin);
      const minP = Math.min(...prices), maxP = Math.max(...prices);
      const minD = Math.min(...durations), maxD = Math.max(...durations);
      const rangeP = maxP - minP || 1;
      const rangeD = maxD - minD || 1;
      flights.sort((a, b) => {
        const scoreA = ((a.basePrice - minP) / rangeP) * 0.5 + ((a.durationMin - minD) / rangeD) * 0.5;
        const scoreB = ((b.basePrice - minP) / rangeP) * 0.5 + ((b.durationMin - minD) / rangeD) * 0.5;
        return scoreA - scoreB;
      });
      break;
    case 'cheapest':
      flights.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case 'fastest':
      flights.sort((a, b) => a.durationMin - b.durationMin);
      break;
  }

  filteredFlights = flights;
  renderFlights();
  updateSortTabPrices();
}

// ─── Render Flights ──────────────────────────
function renderFlights() {
  const container = document.getElementById('flightsList');
  const countEl = document.getElementById('resultsCount');

  countEl.innerHTML = `<span>${filteredFlights.length}</span> flights found`;

  if (filteredFlights.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">✈️</div>
        <h3>No flights match your filters</h3>
        <p>Try adjusting your filters or search for different dates.</p>
      </div>
    `;
    return;
  }

  const cheapest = [...filteredFlights].sort((a, b) => a.basePrice - b.basePrice)[0];
  const fastest = [...filteredFlights].sort((a, b) => a.durationMin - b.durationMin)[0];

  container.innerHTML = filteredFlights.map((flight, i) => {
    const isCheapest = flight.id === cheapest.id;
    const isFastest = flight.id === fastest.id && !isCheapest;
    return renderFlightCardHTML(flight, i, { isCheapest, isFastest });
  }).join('');
}

// ─── Render Filters ──────────────────────────
function renderFilters() {
  const airlineContainer = document.getElementById('airlineFilters');
  airlineContainer.innerHTML = FlightData.airlines.map(a => {
    const isActive = filters.airlines.includes(a.code) ? 'active' : '';
    return `
      <div class="airline-option ${isActive}" onclick="toggleAirline('${a.code}')">
        <div class="airline-checkbox">✓</div>
        <img class="airline-logo-sm" src="../../${a.logo}" alt="${a.name}">
        <span>${a.name}</span>
      </div>
    `;
  }).join('');
}

// ─── Sort Tabs ──────────────────────────────
function setSortTab(tab) {
  filters.sort = tab;
  document.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.sort-tab[data-sort="${tab}"]`).classList.add('active');
  applyFilters();
}

function updateSortTabPrices() {
  if (filteredFlights.length === 0) return;
  const cheapest = [...filteredFlights].sort((a, b) => a.basePrice - b.basePrice)[0];
  const fastest = [...filteredFlights].sort((a, b) => a.durationMin - b.durationMin)[0];
  document.getElementById('sortCheapestPrice').textContent = `\u20B9${cheapest.basePrice.toLocaleString('en-IN')}`;
  document.getElementById('sortFastestPrice').textContent = fastest.duration;
  // Best: show cheapest non-stop or overall cheapest
  const bestNonStop = filteredFlights.filter(f => f.stops === 0).sort((a, b) => a.basePrice - b.basePrice)[0];
  const best = bestNonStop || cheapest;
  document.getElementById('sortBestPrice').textContent = `\u20B9${best.basePrice.toLocaleString('en-IN')}`;
}


function updatePriceFilter(value) {
  filters.maxPrice = parseInt(value);
  document.getElementById('priceMax').textContent = `₹${parseInt(value).toLocaleString('en-IN')}`;
  applyFilters();
}

function setTimeFilter(slot) {
  if (filters.timeSlot === slot) {
    filters.timeSlot = null;
    document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
  } else {
    filters.timeSlot = slot;
    document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
    document.querySelector(`.time-chip[data-slot="${slot}"]`).classList.add('active');
  }
  applyFilters();
}

function toggleStops(count) {
  const el = document.querySelector(`.stop-option[data-stops="${count}"]`);
  if (filters.stops.includes(count)) {
    if (filters.stops.length > 1) {
      filters.stops = filters.stops.filter(s => s !== count);
      el.classList.remove('active');
    }
  } else {
    filters.stops.push(count);
    el.classList.add('active');
  }
  applyFilters();
}

function toggleAirline(code) {
  if (filters.airlines.includes(code)) {
    if (filters.airlines.length > 1) {
      filters.airlines = filters.airlines.filter(a => a !== code);
    }
  } else {
    filters.airlines.push(code);
  }
  renderFilters();
  applyFilters();
}

function clearAllFilters() {
  const slider = document.getElementById('priceSlider');
  const sliderMax = parseInt(slider.max);

  filters = {
    sort: 'best',
    maxPrice: sliderMax,
    timeSlot: null,
    stops: [0, 1],
    airlines: FlightData.airlines.map(a => a.code),
  };

  document.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.sort-tab[data-sort="best"]').classList.add('active');
  slider.value = sliderMax;
  document.getElementById('priceMax').textContent = `\u20B9${sliderMax.toLocaleString('en-IN')}`;
  document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.stop-option').forEach(el => el.classList.add('active'));

  renderFilters();
  applyFilters();
}

// ─── Select Flight (Navigate) ────────────────
function selectFlight(flightId) {
  const flight = filteredFlights.find(f => f.id === flightId);
  if (!flight) return;

  sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
  window.location.href = `../select-seat/select-seat.html?flight=${encodeURIComponent(flightId)}`;
}

// ─── Modify Search ───────────────────────────
function modifySearch() {
  window.location.href = '../index/index.html';
}
