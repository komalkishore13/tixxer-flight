/* ============================================
   TIXXER FLIGHT — Flight Card Component
   Renders flight cards for results page
   ============================================ */

function renderFlightCardHTML(flight, index, badges) {
  const badgeClass = badges.isCheapest ? 'cheapest' : badges.isFastest ? 'fastest' : '';

  const stopsLabel = flight.stops === 0
    ? '<span class="stops-badge non-stop">Non-stop</span>'
    : flight.stops === 1
      ? '<span class="stops-badge one-stop">1 Stop</span>'
      : `<span class="stops-badge multi-stop">${flight.stops} Stops</span>`;

  const stopsText = flight.stops === 0
    ? 'Non-stop'
    : `${flight.stops} stop via ${flight.stopCity || ''}`;

  const stopsClass = flight.stops > 0 ? 'has-stops' : '';

  return `
    <div class="flight-card ${badgeClass}" style="animation-delay: ${index * 0.05}s" onclick="selectFlight('${flight.id}')">
      <div class="flight-airline">
        <img class="airline-logo" src="../../${flight.airlineData.logo}" alt="${flight.airlineData.name}">
        <div class="airline-info">
          <div class="airline-name">${flight.airlineData.name}</div>
          <div class="flight-number">${flight.flightNo}</div>
        </div>
      </div>

      <div class="flight-schedule">
        <div class="schedule-time">
          <div class="time">${flight.depTime}</div>
          <div class="code">${flight.from}</div>
        </div>
        <div class="schedule-path">
          <div class="duration">${flight.duration}</div>
          <div class="path-line"></div>
          <div class="stops-text ${stopsClass}">${stopsText}</div>
        </div>
        <div class="schedule-time">
          <div class="time">${flight.arrTime}</div>
          <div class="code">${flight.to}</div>
        </div>
      </div>

      <div class="flight-stops">${stopsLabel}</div>

      <div class="flight-price">
        <div class="price-amount">\u20B9${flight.basePrice.toLocaleString('en-IN')}</div>
        <div class="price-pax">per person</div>
      </div>

      <div class="flight-action">
        <button class="btn-book" onclick="event.stopPropagation(); selectFlight('${flight.id}')">Select Flight \u2192</button>
      </div>
    </div>
  `;
}
