/* ============================================
   TIXXER FLIGHT — Seat Selector Component
   Renders seat class cards
   ============================================ */

function renderSeatClassCards(containerId, seatClasses, basePrice, onSelect) {
  const grid = document.getElementById(containerId);

  grid.innerHTML = seatClasses.map(sc => {
    const price = Math.round(basePrice * sc.priceMultiplier);
    const seatsWarning = sc.seatsLeft <= 5
      ? `<div class="seats-left">Only ${sc.seatsLeft} seats left!</div>`
      : '';

    const perksHTML = sc.perks.map(p =>
      `<div class="perk-item">
        <span class="perk-icon">${p.icon}</span>
        <span>${p.text}</span>
      </div>`
    ).join('');

    return `
      <div class="seat-card" id="seat-${sc.id}" data-class="${sc.id}" data-price="${price}" onclick="${onSelect}('${sc.id}')">
        <div class="seat-check">\u2713</div>

        <div class="seat-card-header">
          <div class="seat-icon-box ${sc.iconClass}">${sc.icon}</div>
          <div>
            <div class="seat-class-name">${sc.name}</div>
            <span class="seat-class-tag ${sc.tagClass}">${sc.tag}</span>
          </div>
        </div>

        <div class="seat-description">${sc.description}</div>

        <div class="seat-perks">${perksHTML}</div>

        <div class="seat-card-footer">
          <div class="seat-price">
            <div class="price-amount">\u20B9${price.toLocaleString('en-IN')}</div>
            <div class="price-label">per person</div>
            ${seatsWarning}
          </div>
          <button class="btn-select-seat" onclick="event.stopPropagation(); ${onSelect}('${sc.id}')">Select</button>
        </div>
      </div>
    `;
  }).join('');
}
