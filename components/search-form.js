/* ============================================
   TIXXER FLIGHT — Search Form Component
   City dropdowns, travellers, currency, search
   ============================================ */

// ─── State ───────────────────────────────────
const searchState = {
  tripType: 'oneway',
  from: null,
  to: null,
  departDate: '',
  returnDate: '',
  travellers: { adults: 1, children: 0, infants: 0 },
  currency: { code: 'INR', symbol: '₹' },
  walletAddress: null,
};

// ─── Initialize Search Form ─────────────────
function initSearchForm() {
  setMinDates();
  renderCityDropdown('from');
  renderCityDropdown('to');
  document.addEventListener('click', handleOutsideClick);
}

// ─── Date Helpers ────────────────────────────
function setMinDates() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('departDate').min = today;
  document.getElementById('returnDate').min = today;

  document.getElementById('departDate').addEventListener('change', (e) => {
    searchState.departDate = e.target.value;
    document.getElementById('returnDate').min = e.target.value;
    const dateObj = new Date(e.target.value);
    document.getElementById('departSub').textContent = formatDate(dateObj);
  });

  document.getElementById('returnDate').addEventListener('change', (e) => {
    searchState.returnDate = e.target.value;
    const dateObj = new Date(e.target.value);
    document.getElementById('returnSub').textContent = formatDate(dateObj);
  });
}

// ─── Trip Type ───────────────────────────────
function setTripType(type, el) {
  searchState.tripType = type;
  document.querySelectorAll('.trip-tab').forEach(tab => tab.classList.remove('active'));
  el.classList.add('active');

  const returnGroup = document.getElementById('returnGroup');
  const returnDate = document.getElementById('returnDate');

  if (type === 'roundtrip') {
    returnGroup.classList.remove('disabled');
    returnDate.disabled = false;
  } else {
    returnGroup.classList.add('disabled');
    returnDate.disabled = true;
    returnDate.value = '';
    searchState.returnDate = '';
    document.getElementById('returnSub').textContent = 'For round trips';
  }
}

// ─── City Dropdown ───────────────────────────
function renderCityDropdown(type) {
  const dropdown = document.getElementById(`${type}Dropdown`);
  const cities = FlightData.cities;
  const headerHTML = '<div class="dropdown-header">Popular Cities</div>';
  const citiesHTML = cities.map(c => `
    <div class="city-option" onclick="selectCity(event, '${type}', '${c.code}')">
      <div class="city-code">${c.code}</div>
      <div class="city-details">
        <div class="city-name">${c.city}</div>
        <div class="airport-name">${c.airport}</div>
      </div>
    </div>
  `).join('');

  dropdown.innerHTML = headerHTML + citiesHTML;
}

function openCityDropdown(type) {
  closeAllDropdowns();
  const dropdown = document.getElementById(`${type}Dropdown`);
  dropdown.classList.add('active');
  document.getElementById(`${type}Input`).focus();
}

function filterCities(type) {
  const query = document.getElementById(`${type}Input`).value.toLowerCase();
  const dropdown = document.getElementById(`${type}Dropdown`);
  const cities = FlightData.cities;

  if (!dropdown.classList.contains('active')) {
    dropdown.classList.add('active');
  }

  const filtered = cities.filter(c =>
    c.city.toLowerCase().includes(query) ||
    c.code.toLowerCase().includes(query) ||
    c.airport.toLowerCase().includes(query)
  );

  const headerHTML = '<div class="dropdown-header">Search Results</div>';
  const citiesHTML = filtered.length > 0
    ? filtered.map(c => `
        <div class="city-option" onclick="selectCity(event, '${type}', '${c.code}')">
          <div class="city-code">${c.code}</div>
          <div class="city-details">
            <div class="city-name">${c.city}</div>
            <div class="airport-name">${c.airport}</div>
          </div>
        </div>
      `).join('')
    : '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">No cities found</div>';

  dropdown.innerHTML = headerHTML + citiesHTML;
}

function selectCity(event, type, code) {
  event.stopPropagation();
  const city = FlightData.cities.find(c => c.code === code);
  if (!city) return;

  searchState[type] = city;
  document.getElementById(`${type}Input`).value = `${city.city} (${city.code})`;
  document.getElementById(`${type}Sub`).textContent = city.airport;
  document.getElementById(`${type}Dropdown`).classList.remove('active');

  if (type === 'from') {
    setTimeout(() => openCityDropdown('to'), 150);
  } else if (type === 'to') {
    setTimeout(() => document.getElementById('departDate').focus(), 150);
  }
}

// ─── Swap Cities ─────────────────────────────
function swapCities() {
  const temp = searchState.from;
  searchState.from = searchState.to;
  searchState.to = temp;

  const fromInput = document.getElementById('fromInput');
  const toInput = document.getElementById('toInput');
  const fromSub = document.getElementById('fromSub');
  const toSub = document.getElementById('toSub');

  const tempVal = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = tempVal;

  const tempSub = fromSub.textContent;
  fromSub.textContent = toSub.textContent;
  toSub.textContent = tempSub;
}

// ─── Travellers ──────────────────────────────
function toggleTravellers(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('travellersDropdown');
  const isOpen = dropdown.classList.contains('active');
  closeAllDropdowns();
  if (!isOpen) {
    dropdown.classList.add('active');
  }
}

function updateTraveller(event, type, delta) {
  event.stopPropagation();
  const current = searchState.travellers[type];
  const newVal = current + delta;

  if (type === 'adults' && (newVal < 1 || newVal > 9)) return;
  if (type === 'children' && (newVal < 0 || newVal > 6)) return;
  if (type === 'infants' && (newVal < 0 || newVal > searchState.travellers.adults)) return;

  searchState.travellers[type] = newVal;
  updateTravellersUI();
}

function updateTravellersUI() {
  const { adults, children, infants } = searchState.travellers;
  const total = adults + children + infants;

  document.getElementById('adultCount').textContent = adults;
  document.getElementById('childCount').textContent = children;
  document.getElementById('infantCount').textContent = infants;
  document.getElementById('totalTravellers').textContent = total;
  document.getElementById('travellersLabel').textContent = total === 1 ? 'Traveller' : 'Travellers';

  document.getElementById('adultMinus').disabled = adults <= 1;
  document.getElementById('adultPlus').disabled = adults >= 9;
  document.getElementById('childMinus').disabled = children <= 0;
  document.getElementById('childPlus').disabled = children >= 6;
  document.getElementById('infantMinus').disabled = infants <= 0;
  document.getElementById('infantPlus').disabled = infants >= adults;
}

function closeTravellers(event) {
  event.stopPropagation();
  document.getElementById('travellersDropdown').classList.remove('active');
}

// ─── Currency ────────────────────────────────
function toggleCurrency() {
  event.stopPropagation();
  const dropdown = document.getElementById('currencyDropdown');
  dropdown.classList.toggle('active');
}

function selectCurrency(event, code, symbol) {
  event.stopPropagation();
  searchState.currency = { code, symbol };
  document.getElementById('currencyLabel').textContent = `${code} ${symbol}`;

  document.querySelectorAll('.currency-option').forEach(opt => opt.classList.remove('active'));
  event.currentTarget.classList.add('active');

  document.getElementById('currencyDropdown').classList.remove('active');
}

// ─── Quick Search (Popular Routes) ───────────
function quickSearch(fromCode, toCode) {
  const fromCity = FlightData.cities.find(c => c.code === fromCode);
  const toCity = FlightData.cities.find(c => c.code === toCode);

  if (fromCity) {
    searchState.from = fromCity;
    document.getElementById('fromInput').value = `${fromCity.city} (${fromCity.code})`;
    document.getElementById('fromSub').textContent = fromCity.airport;
  }

  if (toCity) {
    searchState.to = toCity;
    document.getElementById('toInput').value = `${toCity.city} (${toCity.code})`;
    document.getElementById('toSub').textContent = toCity.airport;
  }

  document.querySelector('.search-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => document.getElementById('departDate').focus(), 500);
}

// ─── Search Flights ──────────────────────────
function searchFlights() {
  if (!searchState.from) {
    shakeElement('fromGroup');
    document.getElementById('fromInput').focus();
    return;
  }
  if (!searchState.to) {
    shakeElement('toGroup');
    document.getElementById('toInput').focus();
    return;
  }
  if (searchState.from.code === searchState.to.code) {
    alert('Departure and destination cities cannot be the same.');
    return;
  }
  if (!document.getElementById('departDate').value) {
    shakeElement(document.getElementById('departDate').closest('.input-group'));
    document.getElementById('departDate').focus();
    return;
  }
  if (searchState.tripType === 'roundtrip' && !document.getElementById('returnDate').value) {
    shakeElement('returnGroup');
    document.getElementById('returnDate').focus();
    return;
  }

  searchState.departDate = document.getElementById('departDate').value;

  const params = new URLSearchParams({
    from: searchState.from.code,
    to: searchState.to.code,
    date: searchState.departDate,
    trip: searchState.tripType,
    adults: searchState.travellers.adults,
    children: searchState.travellers.children,
    infants: searchState.travellers.infants,
  });

  if (searchState.tripType === 'roundtrip') {
    params.set('returnDate', searchState.returnDate);
  }

  const searchData = {
    from: searchState.from,
    to: searchState.to,
    departDate: searchState.departDate,
    returnDate: searchState.returnDate,
    tripType: searchState.tripType,
    travellers: { ...searchState.travellers },
    currency: { ...searchState.currency },
  };
  sessionStorage.setItem('flightSearch', JSON.stringify(searchData));

  window.location.href = `../flight-results/flight-results.html?${params.toString()}`;
}

// ─── Shake Animation ─────────────────────────
function shakeElement(el) {
  const element = typeof el === 'string' ? document.getElementById(el) : el;
  if (!element) return;
  element.style.animation = 'none';
  element.offsetHeight;
  element.style.animation = 'shake 0.4s ease';
  setTimeout(() => { element.style.animation = ''; }, 400);
}

// Add shake keyframes
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ─── Global Click Handler ────────────────────
function closeAllDropdowns() {
  document.querySelectorAll('.city-dropdown, .travellers-dropdown, .currency-dropdown').forEach(d => {
    d.classList.remove('active');
  });
}

function handleOutsideClick(event) {
  if (!event.target.closest('#fromGroup')) {
    document.getElementById('fromDropdown')?.classList.remove('active');
  }
  if (!event.target.closest('#toGroup')) {
    document.getElementById('toDropdown')?.classList.remove('active');
  }
  if (!event.target.closest('#travellersGroup')) {
    document.getElementById('travellersDropdown')?.classList.remove('active');
  }
  if (!event.target.closest('#currencySelector')) {
    document.getElementById('currencyDropdown')?.classList.remove('active');
  }
}
