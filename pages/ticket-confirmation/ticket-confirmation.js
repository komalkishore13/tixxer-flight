/* ============================================
   TIXXER FLIGHT — Ticket Confirmation Page JS
   ============================================ */

// State
let booking = null;
let payment = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const bookingStored = sessionStorage.getItem('bookingData');
  const paymentStored = sessionStorage.getItem('paymentResult');

  if (!bookingStored) {
    window.location.href = '../index/index.html';
    return;
  }

  booking = JSON.parse(bookingStored);
  payment = paymentStored ? JSON.parse(paymentStored) : generateMockPayment();

  renderTicket();
  generateQR();
  saveBookingToHistory();
});

// Generate mock payment if not coming from real flow
function generateMockPayment() {
  return {
    txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    bookingId: 'TXF-' + Date.now().toString(36).toUpperCase(),
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38',
    amountETH: booking.pricing.totalETH,
    timestamp: new Date().toISOString(),
  };
}

// Render Ticket
function renderTicket() {
  const f = booking.flight;
  const sc = booking.seatClass;
  const search = booking.searchData;
  const p = booking.pricing;

  const fromCity = search?.from?.city || f.from;
  const toCity = search?.to?.city || f.to;
  const dateStr = f.date ? formatDateLong(new Date(f.date)) : '--';
  const stopsText = f.stops === 0 ? 'Non-stop' : `${f.stops} stop`;

  // Header
  document.getElementById('ticketBookingId').textContent = payment.bookingId;

  // Route
  document.getElementById('ticketFromCode').textContent = f.from;
  document.getElementById('ticketFromCity').textContent = fromCity;
  document.getElementById('ticketDepTime').textContent = f.depTime;
  document.getElementById('ticketToCode').textContent = f.to;
  document.getElementById('ticketToCity').textContent = toCity;
  document.getElementById('ticketArrTime').textContent = f.arrTime;

  // Airline badge
  document.getElementById('ticketAirlineLogo').src = `../../${f.airlineData?.logo || 'assets/airlines/AI.png'}`;
  document.getElementById('ticketAirlineLogo').alt = f.airlineData?.name || 'Airline';
  document.getElementById('ticketAirlineName').textContent = f.airlineData?.name || 'Airline';

  // Duration
  document.getElementById('ticketDuration').textContent = `${f.duration} · ${stopsText}`;

  // Details grid
  document.getElementById('ticketPassenger').textContent = `${booking.totalPassengers} Passenger${booking.totalPassengers > 1 ? 's' : ''}`;
  document.getElementById('ticketFlightNo').textContent = f.flightNo;
  document.getElementById('ticketDate').textContent = dateStr;
  document.getElementById('ticketSeatClass').textContent = `${seatIcons[sc.id] || '💺'} ${sc.name}`;
  document.getElementById('ticketPax').textContent = formatPaxBreakdown();

  // Payment section
  document.getElementById('ticketAmount').textContent = `₹${p.total.toLocaleString('en-IN')}`;
  document.getElementById('ticketEth').textContent = `${p.totalETH} ETH`;

  const txShort = payment.txHash.slice(0, 10) + '...' + payment.txHash.slice(-8);
  const txLink = document.getElementById('ticketTxHash');
  txLink.textContent = txShort;
  txLink.href = `https://sepolia.etherscan.io/tx/${payment.txHash}`;
}

// Format passenger breakdown
function formatPaxBreakdown() {
  const t = booking.searchData?.travellers || { adults: 1, children: 0, infants: 0 };
  const parts = [];
  if (t.adults > 0) parts.push(`${t.adults} Adult${t.adults > 1 ? 's' : ''}`);
  if (t.children > 0) parts.push(`${t.children} Child${t.children > 1 ? 'ren' : ''}`);
  if (t.infants > 0) parts.push(`${t.infants} Infant${t.infants > 1 ? 's' : ''}`);
  return parts.join(', ');
}

// QR Code Generator
function generateQR() {
  const container = document.getElementById('ticketQR');
  const canvas = document.createElement('canvas');
  const size = 88;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const data = payment.bookingId + '|' + booking.flight.flightNo;
  const hash = simpleHash(data);

  const cellSize = 4;
  const grid = Math.floor(size / cellSize);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#1a1a2e';
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      if (isFinderPattern(row, col, grid)) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        continue;
      }
      const idx = (row * grid + col) % hash.length;
      if (hash.charCodeAt(idx) % 3 !== 0) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }

  drawFinderBox(ctx, 0, 0, cellSize);
  drawFinderBox(ctx, (grid - 7) * cellSize, 0, cellSize);
  drawFinderBox(ctx, 0, (grid - 7) * cellSize, cellSize);

  container.appendChild(canvas);
}

function isFinderPattern(row, col, grid) {
  if (row < 7 && col < 7) return isFinderCell(row, col);
  if (row < 7 && col >= grid - 7) return isFinderCell(row, col - (grid - 7));
  if (row >= grid - 7 && col < 7) return isFinderCell(row - (grid - 7), col);
  return false;
}

function isFinderCell(r, c) {
  if (r === 0 || r === 6 || c === 0 || c === 6) return true;
  if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
  return false;
}

function drawFinderBox(ctx, x, y, cellSize) {
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, 7 * cellSize - 1, 7 * cellSize - 1);
}

function simpleHash(str) {
  let hash = '';
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i).toString(16);
  }
  while (hash.length < 200) hash += hash;
  return hash;
}

// Save booking to localStorage AND MongoDB
function saveBookingToHistory() {
  const trips = JSON.parse(localStorage.getItem('tixxer_trips') || '[]');

  // Avoid duplicates (same bookingId)
  if (trips.some(t => t.bookingId === payment.bookingId)) return;

  const f = booking.flight;
  const sc = booking.seatClass;
  const p = booking.pricing;
  const search = booking.searchData;

  const tripData = {
    bookingId: payment.bookingId,
    txHash: payment.txHash,
    walletAddress: payment.walletAddress,
    bookedAt: payment.timestamp || new Date().toISOString(),
    from: f.from,
    to: f.to,
    fromCity: search?.from?.city || f.from,
    toCity: search?.to?.city || f.to,
    date: f.date || '',
    depTime: f.depTime,
    arrTime: f.arrTime,
    duration: f.duration,
    stops: f.stops,
    flightNo: f.flightNo,
    airlineName: f.airlineData?.name || 'Airline',
    airlineLogo: f.airlineData?.logo || '',
    airlineCode: f.airlineData?.code || '',
    seatClass: sc.name,
    seatClassId: sc.id,
    passengers: booking.totalPassengers,
    travellers: search?.travellers || { adults: 1, children: 0, infants: 0 },
    totalINR: p.total,
    totalETH: p.totalETH,
    status: 'confirmed',
  };

  // Save to localStorage (immediate, works offline)
  trips.unshift(tripData);
  localStorage.setItem('tixxer_trips', JSON.stringify(trips));

  // Save to MongoDB (async, non-blocking)
  saveBookingToMongoDB(tripData);
}

async function saveBookingToMongoDB(tripData) {
  try {
    const res = await fetch('/api/save-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData),
    });
    if (res.ok) {
      console.log('Booking saved to MongoDB');
    } else {
      console.warn('MongoDB save failed:', res.status);
    }
  } catch (err) {
    console.warn('MongoDB save failed (network):', err.message);
  }
}

// Download Ticket as PDF
function downloadTicketPDF() {
  const f = booking.flight;
  const sc = booking.seatClass;
  const p = booking.pricing;
  const search = booking.searchData;
  const fromCity = search?.from?.city || f.from;
  const toCity = search?.to?.city || f.to;
  const dateStr = f.date ? formatDateLong(new Date(f.date)) : '--';
  const stopsText = f.stops === 0 ? 'Non-stop' : `${f.stops} stop`;
  const txShort = payment.txHash.slice(0, 16) + '...' + payment.txHash.slice(-8);

  const printHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>E-Ticket — ${payment.bookingId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 32px; }
    .ticket { max-width: 640px; margin: 0 auto; border: 2px solid #1a1a2e; border-radius: 12px; overflow: hidden; }
    .t-header { background: #1a2d50; color: #fff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
    .t-brand { font-size: 16px; font-weight: 800; letter-spacing: 1px; }
    .t-bid { color: #4facfe; font-size: 14px; font-weight: 700; }
    .t-bid-label { font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; }
    .t-body { padding: 24px; }
    .t-route { display: flex; align-items: flex-start; margin-bottom: 24px; }
    .t-ep { text-align: center; min-width: 90px; }
    .t-code { font-size: 28px; font-weight: 800; letter-spacing: 2px; }
    .t-city { font-size: 11px; color: #666; margin-top: 2px; }
    .t-time { font-size: 18px; font-weight: 700; color: #1a73e8; margin-top: 6px; }
    .t-elabel { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }
    .t-mid { flex: 1; text-align: center; padding-top: 10px; }
    .t-dur { font-size: 12px; font-weight: 600; color: #555; }
    .t-airline { font-size: 11px; color: #999; margin-top: 4px; }
    .t-arrow { font-size: 20px; color: #1a73e8; margin: 6px 0; }
    .t-tear { border-top: 2px dashed #ddd; margin: 20px 0; }
    .t-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
    .t-item-label { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 3px; }
    .t-item-value { font-size: 13px; font-weight: 700; color: #1a1a2e; }
    .t-confirmed { color: #00c853; }
    .t-pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .t-pay-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; }
    .t-pay-label { color: #999; }
    .t-pay-value { font-weight: 600; }
    .t-pay-eth { color: #1a73e8; }
    .t-footer { background: #f4f6fb; padding: 12px 24px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #e2e5f1; }
    @media print { body { padding: 0; } .ticket { border: 2px solid #000; } }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="t-header">
      <div class="t-brand">✈ TIXXER FLIGHT</div>
      <div style="text-align:right;">
        <div class="t-bid-label">Booking ID</div>
        <div class="t-bid">${payment.bookingId}</div>
      </div>
    </div>
    <div class="t-body">
      <div class="t-route">
        <div class="t-ep">
          <div class="t-code">${f.from}</div>
          <div class="t-city">${fromCity}</div>
          <div class="t-time">${f.depTime}</div>
          <div class="t-elabel">Departure</div>
        </div>
        <div class="t-mid">
          <div class="t-dur">${f.duration} · ${stopsText}</div>
          <div class="t-airline">${f.airlineData?.name || 'Airline'} · ${f.flightNo}</div>
          <div class="t-arrow">─── ✈ ───▶</div>
        </div>
        <div class="t-ep">
          <div class="t-code">${f.to}</div>
          <div class="t-city">${toCity}</div>
          <div class="t-time">${f.arrTime}</div>
          <div class="t-elabel">Arrival</div>
        </div>
      </div>

      <div class="t-tear"></div>

      <div class="t-grid">
        <div><div class="t-item-label">Passenger</div><div class="t-item-value">${booking.totalPassengers} Passenger${booking.totalPassengers > 1 ? 's' : ''}</div></div>
        <div><div class="t-item-label">Flight</div><div class="t-item-value">${f.flightNo}</div></div>
        <div><div class="t-item-label">Date</div><div class="t-item-value">${dateStr}</div></div>
        <div><div class="t-item-label">Seat Class</div><div class="t-item-value">${sc.name}</div></div>
        <div><div class="t-item-label">Travellers</div><div class="t-item-value">${formatPaxBreakdown()}</div></div>
        <div><div class="t-item-label">Status</div><div class="t-item-value t-confirmed">✓ Confirmed</div></div>
      </div>

      <div class="t-tear"></div>

      <div class="t-pay-grid">
        <div>
          <div class="t-pay-row"><span class="t-pay-label">Amount Paid</span><span class="t-pay-value">₹${p.total.toLocaleString('en-IN')}</span></div>
          <div class="t-pay-row"><span class="t-pay-label">Paid in ETH</span><span class="t-pay-value t-pay-eth">${p.totalETH} ETH</span></div>
        </div>
        <div>
          <div class="t-pay-row"><span class="t-pay-label">Tx Hash</span><span class="t-pay-value" style="font-size:10px;font-family:monospace;">${txShort}</span></div>
          <div class="t-pay-row"><span class="t-pay-label">Network</span><span class="t-pay-value">Sepolia Testnet</span></div>
        </div>
      </div>
    </div>
    <div class="t-footer">This is an electronic ticket. Please carry a valid photo ID for verification. — tixxerflight.io</div>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  printWindow.document.write(printHTML);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };
}
