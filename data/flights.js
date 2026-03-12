/* ============================================
   TIXXER FLIGHT — Centralized Data Store
   All mock data: cities, airlines, flights, seat classes
   Dynamic pricing based on route distance
   ============================================ */

const FlightData = {

  // ─── Airports / Cities (50 Indian airports) ───
  // lat/lon used for distance-based pricing
  cities: [
    { code: 'IXA', city: 'Agartala',           airport: 'Maharaja Bir Bikram Airport',              country: 'India', lat: 23.89, lon: 91.24 },
    { code: 'AMD', city: 'Ahmedabad',          airport: 'Sardar Vallabhbhai Patel International',   country: 'India', lat: 23.07, lon: 72.63 },
    { code: 'ATQ', city: 'Amritsar',           airport: 'Sri Guru Ram Dass Jee International',      country: 'India', lat: 31.71, lon: 74.80 },
    { code: 'IXU', city: 'Aurangabad',         airport: 'Chikkalthana Airport',                     country: 'India', lat: 19.86, lon: 75.40 },
    { code: 'IXB', city: 'Bagdogra',           airport: 'Bagdogra Airport',                         country: 'India', lat: 26.68, lon: 88.33 },
    { code: 'BLR', city: 'Bengaluru',          airport: 'Kempegowda International Airport',         country: 'India', lat: 13.20, lon: 77.71 },
    { code: 'BHO', city: 'Bhopal',             airport: 'Raja Bhoj Airport',                        country: 'India', lat: 23.29, lon: 77.34 },
    { code: 'BBI', city: 'Bhubaneswar',        airport: 'Biju Patnaik International Airport',       country: 'India', lat: 20.24, lon: 85.82 },
    { code: 'IXC', city: 'Chandigarh',         airport: 'Chandigarh International Airport',         country: 'India', lat: 30.67, lon: 76.79 },
    { code: 'MAA', city: 'Chennai',            airport: 'Chennai International Airport',             country: 'India', lat: 12.99, lon: 80.17 },
    { code: 'CJB', city: 'Coimbatore',         airport: 'Coimbatore International Airport',         country: 'India', lat: 11.03, lon: 77.04 },
    { code: 'DED', city: 'Dehradun',           airport: 'Jolly Grant Airport',                      country: 'India', lat: 30.19, lon: 78.18 },
    { code: 'DEL', city: 'Delhi',              airport: 'Indira Gandhi International Airport',      country: 'India', lat: 28.56, lon: 77.10 },
    { code: 'DHM', city: 'Dharamshala',        airport: 'Gaggal Airport',                           country: 'India', lat: 32.16, lon: 76.26 },
    { code: 'DIB', city: 'Dibrugarh',          airport: 'Dibrugarh Airport',                        country: 'India', lat: 27.48, lon: 95.02 },
    { code: 'DMU', city: 'Dimapur',            airport: 'Dimapur Airport',                          country: 'India', lat: 25.88, lon: 93.77 },
    { code: 'GAY', city: 'Gaya',               airport: 'Gaya Airport',                             country: 'India', lat: 24.74, lon: 84.95 },
    { code: 'GOI', city: 'Goa (Dabolim)',      airport: 'Dabolim Airport',                          country: 'India', lat: 15.38, lon: 73.83 },
    { code: 'GOX', city: 'Goa (Manohar)',      airport: 'Manohar International Airport',            country: 'India', lat: 15.38, lon: 73.90 },
    { code: 'GOP', city: 'Gorakhpur',          airport: 'Gorakhpur Airport',                        country: 'India', lat: 26.74, lon: 83.45 },
    { code: 'GAU', city: 'Guwahati',           airport: 'Lokpriya Gopinath Bordoloi International', country: 'India', lat: 26.11, lon: 91.59 },
    { code: 'HYD', city: 'Hyderabad',          airport: 'Rajiv Gandhi International Airport',       country: 'India', lat: 17.24, lon: 78.43 },
    { code: 'IMF', city: 'Imphal',             airport: 'Bir Tikendrajit International Airport',    country: 'India', lat: 24.76, lon: 93.90 },
    { code: 'IDR', city: 'Indore',             airport: 'Devi Ahilyabai Holkar Airport',            country: 'India', lat: 22.72, lon: 75.80 },
    { code: 'JAI', city: 'Jaipur',             airport: 'Jaipur International Airport',             country: 'India', lat: 26.82, lon: 75.81 },
    { code: 'IXJ', city: 'Jammu',              airport: 'Jammu Airport',                            country: 'India', lat: 32.69, lon: 74.84 },
    { code: 'CNN', city: 'Kannur',             airport: 'Kannur International Airport',             country: 'India', lat: 11.92, lon: 75.55 },
    { code: 'COK', city: 'Kochi',              airport: 'Cochin International Airport',             country: 'India', lat: 10.15, lon: 76.40 },
    { code: 'CCU', city: 'Kolkata',            airport: 'Netaji Subhas Chandra Bose International', country: 'India', lat: 22.65, lon: 88.45 },
    { code: 'IXL', city: 'Leh',               airport: 'Kushok Bakula Rimpochee Airport',          country: 'India', lat: 34.14, lon: 77.55 },
    { code: 'LKO', city: 'Lucknow',           airport: 'Chaudhary Charan Singh International',     country: 'India', lat: 26.76, lon: 80.88 },
    { code: 'IXM', city: 'Madurai',           airport: 'Madurai Airport',                          country: 'India', lat:  9.83, lon: 78.09 },
    { code: 'IXE', city: 'Mangalore',         airport: 'Mangalore International Airport',          country: 'India', lat: 12.96, lon: 74.89 },
    { code: 'BOM', city: 'Mumbai',            airport: 'Chhatrapati Shivaji Maharaj International', country: 'India', lat: 19.09, lon: 72.87 },
    { code: 'NAG', city: 'Nagpur',            airport: 'Dr. Babasaheb Ambedkar International',     country: 'India', lat: 21.09, lon: 79.05 },
    { code: 'PAT', city: 'Patna',             airport: 'Jay Prakash Narayan International Airport', country: 'India', lat: 25.59, lon: 85.09 },
    { code: 'IXZ', city: 'Port Blair',        airport: 'Veer Savarkar International Airport',      country: 'India', lat: 11.64, lon: 92.73 },
    { code: 'PNQ', city: 'Pune',              airport: 'Pune Airport',                             country: 'India', lat: 18.58, lon: 73.92 },
    { code: 'RPR', city: 'Raipur',            airport: 'Swami Vivekananda Airport',                country: 'India', lat: 21.18, lon: 81.74 },
    { code: 'RAJ', city: 'Rajkot',            airport: 'Rajkot International Airport',             country: 'India', lat: 22.31, lon: 70.78 },
    { code: 'IXR', city: 'Ranchi',            airport: 'Birsa Munda Airport',                      country: 'India', lat: 23.31, lon: 85.32 },
    { code: 'SXR', city: 'Srinagar',          airport: 'Sheikh ul-Alam International Airport',     country: 'India', lat: 34.00, lon: 74.77 },
    { code: 'STV', city: 'Surat',             airport: 'Surat International Airport',              country: 'India', lat: 21.11, lon: 72.74 },
    { code: 'TRV', city: 'Thiruvananthapuram', airport: 'Trivandrum International Airport',        country: 'India', lat:  8.48, lon: 76.92 },
    { code: 'TRZ', city: 'Tiruchirappalli',   airport: 'Tiruchirappalli International Airport',    country: 'India', lat: 10.76, lon: 78.71 },
    { code: 'TIR', city: 'Tirupati',          airport: 'Tirupati Airport',                         country: 'India', lat: 13.63, lon: 79.54 },
    { code: 'UDR', city: 'Udaipur',           airport: 'Maharana Pratap Airport',                  country: 'India', lat: 24.62, lon: 73.90 },
    { code: 'BDQ', city: 'Vadodara',          airport: 'Vadodara Airport',                         country: 'India', lat: 22.34, lon: 73.23 },
    { code: 'VNS', city: 'Varanasi',          airport: 'Lal Bahadur Shastri International Airport', country: 'India', lat: 25.45, lon: 82.86 },
    { code: 'VTZ', city: 'Visakhapatnam',     airport: 'Visakhapatnam International Airport',      country: 'India', lat: 17.72, lon: 83.22 },
  ],

  // ─── Airlines (9) ─────────────────────────────
  // tier: price multiplier (budget < 1.0, full-service > 1.0)
  airlines: [
    { code: '6E', name: 'IndiGo',           color: '#3f51b5', logo: 'assets/airlines/6E.png', tier: 0.92 },
    { code: 'AI', name: 'Air India',         color: '#e23a28', logo: 'assets/airlines/AI.png', tier: 1.12 },
    { code: 'IX', name: 'Air India Express', color: '#e65100', logo: 'assets/airlines/IX.png', tier: 0.95 },
    { code: 'QP', name: 'Akasa Air',         color: '#ff5722', logo: 'assets/airlines/QP.png', tier: 0.90 },
    { code: 'SG', name: 'SpiceJet',          color: '#ff6f00', logo: 'assets/airlines/SG.png', tier: 0.88 },
    { code: '9I', name: 'Alliance Air',      color: '#1565c0', logo: 'assets/airlines/9I.png', tier: 0.85 },
    { code: 'S5', name: 'Star Air',          color: '#2e7d32', logo: 'assets/airlines/S5.png', tier: 0.84 },
    { code: 'I7', name: 'IndiaOne Air',      color: '#6a1b9a', logo: 'assets/airlines/I7.png', tier: 0.83 },
    { code: 'IC', name: 'Fly91',             color: '#00838f', logo: 'assets/airlines/IC.png', tier: 0.86 },
  ],

  // ─── Base Flight Templates ────────────────────
  // priceOffset adds per-flight variation (± rupees)
  baseFlights: [
    { airline: '6E', flightNo: '6E-213',  depTime: '05:45', arrTime: '07:55', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 0 },
    { airline: 'AI', flightNo: 'AI-507',  depTime: '06:30', arrTime: '08:40', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 150 },
    { airline: 'S5', flightNo: 'S5-123',  depTime: '07:00', arrTime: '08:30', duration: '1h 30m', durationMin: 90,  stops: 0, priceOffset: -100 },
    { airline: 'IX', flightNo: 'IX-124',  depTime: '07:45', arrTime: '10:00', duration: '2h 15m', durationMin: 135, stops: 0, priceOffset: 50 },
    { airline: 'QP', flightNo: 'QP-112',  depTime: '08:30', arrTime: '10:40', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 80 },
    { airline: 'SG', flightNo: 'SG-819',  depTime: '09:15', arrTime: '12:30', duration: '3h 15m', durationMin: 195, stops: 1, stopCity: 'JAI', priceOffset: -50 },
    { airline: '9I', flightNo: '9I-821',  depTime: '10:00', arrTime: '12:10', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 0 },
    { airline: 'IC', flightNo: 'IC-901',  depTime: '10:45', arrTime: '12:15', duration: '1h 30m', durationMin: 90,  stops: 0, priceOffset: -80 },
    { airline: '6E', flightNo: '6E-511',  depTime: '11:30', arrTime: '13:40', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 120 },
    { airline: 'AI', flightNo: 'AI-672',  depTime: '12:15', arrTime: '14:25', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 200 },
    { airline: 'I7', flightNo: 'I7-101',  depTime: '13:00', arrTime: '14:35', duration: '1h 35m', durationMin: 95,  stops: 0, priceOffset: -120 },
    { airline: 'IX', flightNo: 'IX-309',  depTime: '13:45', arrTime: '17:00', duration: '3h 15m', durationMin: 195, stops: 1, stopCity: 'BOM', priceOffset: 0 },
    { airline: 'SG', flightNo: 'SG-402',  depTime: '14:30', arrTime: '16:50', duration: '2h 20m', durationMin: 140, stops: 0, priceOffset: 60 },
    { airline: 'QP', flightNo: 'QP-304',  depTime: '15:15', arrTime: '17:25', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 100 },
    { airline: '6E', flightNo: '6E-732',  depTime: '16:00', arrTime: '18:10', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 30 },
    { airline: '9I', flightNo: '9I-612',  depTime: '16:45', arrTime: '18:55', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: -60 },
    { airline: 'AI', flightNo: 'AI-284',  depTime: '17:30', arrTime: '21:00', duration: '3h 30m', durationMin: 210, stops: 1, stopCity: 'HYD', priceOffset: 100 },
    { airline: 'SG', flightNo: 'SG-631',  depTime: '18:15', arrTime: '21:30', duration: '3h 15m', durationMin: 195, stops: 1, stopCity: 'AMD', priceOffset: -30 },
    { airline: 'S5', flightNo: 'S5-274',  depTime: '19:00', arrTime: '20:30', duration: '1h 30m', durationMin: 90,  stops: 0, priceOffset: -90 },
    { airline: '6E', flightNo: '6E-604',  depTime: '19:45', arrTime: '21:55', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 180 },
    { airline: 'QP', flightNo: 'QP-657',  depTime: '20:30', arrTime: '22:40', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: -40 },
    { airline: 'AI', flightNo: 'AI-915',  depTime: '21:15', arrTime: '23:25', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 250 },
    { airline: 'IX', flightNo: 'IX-765',  depTime: '22:00', arrTime: '00:10', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: 0 },
    { airline: '6E', flightNo: '6E-987',  depTime: '23:00', arrTime: '01:10', duration: '2h 10m', durationMin: 130, stops: 0, priceOffset: -70 },
  ],

  // ─── Seat Classes ─────────────────────────────
  seatClasses: [
    {
      id: 'economy', name: 'Economy', tag: 'Most Popular', tagClass: 'popular',
      icon: '💺', iconClass: 'economy',
      description: 'Comfortable standard seating with complimentary snacks and beverages.',
      priceMultiplier: 1, seatsLeft: 42,
      perks: [
        { icon: '💺', text: 'Standard Seat (30" pitch)' },
        { icon: '🧳', text: '15 kg Check-in Baggage' },
        { icon: '🍽️', text: '1 Complimentary Meal' },
        { icon: '🎧', text: 'Personal Entertainment Screen' },
        { icon: '🔌', text: 'USB Charging Port' },
      ],
    },
    {
      id: 'premium_economy', name: 'Premium Economy', tag: 'Best Value', tagClass: 'premium-tag',
      icon: '🛋️', iconClass: 'premium',
      description: 'Extra legroom and enhanced amenities for a more relaxed journey.',
      priceMultiplier: 1.8, seatsLeft: 18,
      perks: [
        { icon: '🛋️', text: 'Extra Legroom Seat (36" pitch)' },
        { icon: '🧳', text: '25 kg Check-in Baggage' },
        { icon: '🍽️', text: '2 Premium Meals' },
        { icon: '🎧', text: 'Noise-cancelling Headphones' },
        { icon: '⚡', text: 'Power Outlet + USB' },
        { icon: '🏷️', text: 'Priority Boarding' },
      ],
    },
    {
      id: 'business', name: 'Business', tag: 'Recommended', tagClass: 'luxury',
      icon: '🥂', iconClass: 'business',
      description: 'Lie-flat seats, lounge access, and premium dining experience.',
      priceMultiplier: 2.8, seatsLeft: 8,
      perks: [
        { icon: '🛏️', text: 'Lie-flat Seat (42" pitch)' },
        { icon: '🧳', text: '35 kg Check-in Baggage' },
        { icon: '🍷', text: 'Multi-course Gourmet Dining' },
        { icon: '🛃', text: 'Lounge Access' },
        { icon: '⚡', text: 'In-seat Power + Wi-Fi' },
        { icon: '🏷️', text: 'Priority Check-in & Boarding' },
        { icon: '🎒', text: 'Amenity Kit' },
      ],
    },
    {
      id: 'first', name: 'First Class', tag: 'Exclusive', tagClass: 'exclusive',
      icon: '👑', iconClass: 'first',
      description: 'Private suite with personal service, champagne, and luxury amenities.',
      priceMultiplier: 4.5, seatsLeft: 2,
      perks: [
        { icon: '🚪', text: 'Private Suite with Door' },
        { icon: '🧳', text: '40 kg Check-in + Garment Bag' },
        { icon: '🍾', text: 'Champagne & Fine Dining' },
        { icon: '🛃', text: 'First Class Lounge & Spa' },
        { icon: '📱', text: 'Complimentary Wi-Fi' },
        { icon: '🚗', text: 'Chauffeur Airport Transfer' },
        { icon: '🛏️', text: 'Turndown Bedding Service' },
        { icon: '🎒', text: 'Designer Amenity Kit' },
      ],
    },
  ],

  // ─── Popular Routes (for homepage) ────────────
  popularRoutes: [
    { from: 'DEL', to: 'BOM', fromCity: 'Delhi',     toCity: 'Mumbai',    price: 4800, tag: 'Trending' },
    { from: 'BLR', to: 'DEL', fromCity: 'Bengaluru',  toCity: 'Delhi',     price: 5900, tag: null },
    { from: 'HYD', to: 'BOM', fromCity: 'Hyderabad', toCity: 'Mumbai',    price: 4200, tag: null },
    { from: 'DEL', to: 'GOI', fromCity: 'Delhi',     toCity: 'Goa',       price: 6400, tag: 'Popular' },
  ],

  // ─── Haversine Distance (km) ─────────────────
  getDistance(fromCode, toCode) {
    const from = this.cities.find(c => c.code === fromCode);
    const to   = this.cities.find(c => c.code === toCode);
    if (!from || !to) return 800;

    const R = 6371;
    const toRad = (deg) => deg * Math.PI / 180;
    const dLat = toRad(to.lat - from.lat);
    const dLon = toRad(to.lon - from.lon);
    const a = Math.sin(dLat / 2) ** 2
            + Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat))
            * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },

  // ─── Dynamic Price Calculator ─────────────────
  // Formula: (distance × 4.8 + 1200) + direct_markup − layover_discount − time_discount
  // Then × airline tier, + per-flight offset, floor at ₹2200
  calcPrice(distKm, flight, airline) {
    let price = distKm * 4.8 + 1200;

    // Non-stop premium vs layover discount
    if (flight.stops === 0) {
      price += 600;
    } else {
      price -= 500;
    }

    // Time-of-day discount (early morning / late night)
    const hour = parseInt(flight.depTime.split(':')[0]);
    if (hour < 6 || hour >= 23) {
      price -= 400;          // red-eye / ultra-early
    } else if (hour < 7 || hour >= 21) {
      price -= 200;          // early morning / late evening
    }

    // Airline tier multiplier
    price *= airline.tier;

    // Per-flight variation
    price += flight.priceOffset || 0;

    // Round to nearest ₹10, enforce floor
    price = Math.round(price / 10) * 10;
    return Math.max(price, 2200);
  },

  // ─── Generate Flights for a Route ─────────────
  generateFlights(from, to, date) {
    const dist = this.getDistance(from, to);

    return this.baseFlights.map((f, i) => {
      const airline = this.airlines.find(a => a.code === f.airline);
      const basePrice = this.calcPrice(dist, f, airline);

      return {
        id: `FL-${from}-${to}-${i}`,
        ...f,
        from,
        to,
        date,
        basePrice,
        airlineData: airline,
        seatsLeft: Math.floor(Math.random() * 15) + 1,
      };
    });
  },

  // ─── Seat icon map ────────────────────────────
  seatIcons: {
    economy: '💺',
    premium_economy: '🛋️',
    business: '🥂',
    first: '👑',
  },
};
