/* ============================================
   TIXXER FLIGHT — Booking Summary Component
   Shared booking summary rendering
   ============================================ */

// Seat class icon map
const seatIcons = {
  economy: '\uD83D\uDCBA',
  premium_economy: '\uD83D\uDECB\uFE0F',
  business: '\uD83E\uDD42',
  first: '\uD83D\uDC51',
};

function renderPaymentSidebar(booking, containerId) {
  const f = booking.flight;
  const p = booking.pricing;
  const sc = booking.seatClass;
  const stopsText = f.stops === 0 ? 'Non-stop' : `${f.stops} stop`;

  document.getElementById(containerId).innerHTML = `
    <div class="psf-airline-row">
      <img class="psf-logo" src="../../${f.airlineData?.logo}" alt="${f.airlineData?.name || 'Airline'}">
      <div>
        <div class="psf-name">${f.airlineData?.name || 'Airline'}</div>
        <div class="psf-flight-no">${f.flightNo}</div>
      </div>
    </div>
    <div class="psf-route-row">
      <div class="psf-point">
        <div class="psf-time">${f.depTime}</div>
        <div class="psf-code">${f.from}</div>
      </div>
      <div class="psf-mid">
        <div class="psf-duration">${f.duration}</div>
        <div class="psf-line"></div>
        <div class="psf-stops">${stopsText}</div>
      </div>
      <div class="psf-point">
        <div class="psf-time">${f.arrTime}</div>
        <div class="psf-code">${f.to}</div>
      </div>
    </div>
    <div class="psf-meta-row">
      <span class="psf-meta-chip">\uD83D\uDCC5 ${f.date ? formatDate(new Date(f.date)) : '--'}</span>
      <span class="psf-meta-chip">\uD83D\uDCBA ${sc.name}</span>
      <span class="psf-meta-chip">\uD83D\uDC65 ${booking.totalPassengers} Pax</span>
    </div>
  `;
}

function renderPriceRows(pricing, containerId) {
  document.getElementById(containerId).innerHTML = `
    <div class="pay-summary-row">
      <span>Base Fare</span>
      <span>\u20B9${pricing.baseFare.toLocaleString('en-IN')}</span>
    </div>
    <div class="pay-summary-row">
      <span>Taxes & Fees</span>
      <span>\u20B9${pricing.taxes.toLocaleString('en-IN')}</span>
    </div>
    <div class="pay-summary-row">
      <span>Platform Fee</span>
      <span>\u20B9${pricing.platformFee}</span>
    </div>
  `;
}
