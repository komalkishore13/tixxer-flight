/* ============================================
   TIXXER FLIGHT — Index Page JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSearchForm();
  renderPopularRoutes();
});

function renderPopularRoutes() {
  const grid = document.getElementById('popularRoutesGrid');
  if (!grid) return;

  grid.innerHTML = FlightData.popularRoutes.map(route => {
    // Compute cheapest flight price for this route
    const flights = FlightData.generateFlights(route.from, route.to, new Date().toISOString().split('T')[0]);
    const cheapest = Math.min(...flights.map(f => f.basePrice));
    const tagHTML = route.tag ? `<span class="route-tag">${route.tag}</span>` : '';

    return `
      <div class="route-card" onclick="quickSearch('${route.from}', '${route.to}')">
        <div class="route-path">
          <span class="route-code">${route.from}</span>
          <span class="route-arrow">\u2192</span>
          <span class="route-code">${route.to}</span>
        </div>
        <div class="route-cities">${route.fromCity} \u2192 ${route.toCity}</div>
        <div class="route-price">
          <span class="from-text">from</span>
          <span class="price">\u20B9${cheapest.toLocaleString('en-IN')}</span>
        </div>
        ${tagHTML}
      </div>
    `;
  }).join('');
}
