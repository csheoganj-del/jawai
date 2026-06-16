const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'reservations.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Helper to read database
function readDatabase() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify([]));
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error("Error reading database:", err);
        return [];
    }
}

// Helper to write database
function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("Error writing database:", err);
    }
}

// Suite specs
const SUITES = {
    'leopard-trail': { name: 'Leopard Trails Suite', basePrice: 80000 },
    'granite-rock': { name: 'Granite Rock Suite', basePrice: 100000 },
    'obsidian-canopy': { name: 'Obsidian Canopy Tent', basePrice: 120000 }
};

// Addon specs
const ADDONS = {
    'private-safari': { name: 'Private Leopard Safari', price: 28000 },
    'cultural-walk': { name: 'Rabari Cultural Walk', price: 10000 },
    'ridge-trek': { name: 'Granite Ridge Trekking', price: 8000 },
    'stargazing': { name: 'Private Night Stargazing', price: 7500 }
};

// Currency formats
const CURRENCIES = {
    INR: { symbol: '₹', factor: 1.0, locale: 'en-IN' },
    USD: { symbol: '$', factor: 1 / 83.0, locale: 'en-US' },
    EUR: { symbol: '€', factor: 1 / 90.0, locale: 'de-DE' },
    GBP: { symbol: '£', factor: 1 / 105.0, locale: 'en-GB' }
};

function formatCurrency(val, currencyCode) {
    const spec = CURRENCIES[currencyCode] || CURRENCIES.INR;
    const converted = Math.round(val * spec.factor);
    return `${spec.symbol}${converted.toLocaleString(spec.locale)}`;
}

// API: Submit Reservation
app.post('/api/reserve', (req, res) => {
    const {
        fullName,
        email,
        phone,
        suite,
        checkIn,
        checkOut,
        guests,
        dietary,
        addons = [],
        specialRequests,
        currency = 'INR'
    } = req.body;

    if (!fullName || !email || !phone || !suite || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: "Required reservation fields missing." });
    }

    // Calculations
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    let nights = 1;
    if (checkOutDate > checkInDate) {
        nights = Math.ceil(Math.abs(checkOutDate - checkInDate) / (1000 * 3600 * 24));
    }

    const suiteSpec = SUITES[suite] || SUITES['leopard-trail'];
    const basePrice = suiteSpec.basePrice;
    
    // Guest modifier
    const guestCount = parseInt(guests) || 2;
    let modifier = 1.0;
    if (guestCount === 1) {
        modifier = 0.9;
    } else if (guestCount > 2) {
        modifier = 1.15;
    }

    const calculatedNightly = Math.round(basePrice * modifier);
    const baseLodgingTotal = calculatedNightly * nights;

    // Addons
    let experiencesTotal = 0;
    const addonDetails = addons.map(addonId => {
        const spec = ADDONS[addonId];
        if (spec) {
            experiencesTotal += spec.price;
            return { id: addonId, name: spec.name, price: spec.price };
        }
        return null;
    }).filter(Boolean);

    const taxTotal = Math.round((baseLodgingTotal + experiencesTotal) * 0.18);
    const grandTotal = baseLodgingTotal + experiencesTotal + taxTotal;

    // Unique Reservation ID
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const reservationId = `LT-2026-${randomSeq}`;

    const reservation = {
        id: reservationId,
        fullName,
        email,
        phone,
        suite: suiteSpec.name,
        checkIn,
        checkOut,
        nights,
        guests: guestCount,
        dietary: dietary || "None specified",
        addons: addonDetails,
        specialRequests: specialRequests || "None specified",
        baseLodgingTotal,
        experiencesTotal,
        taxTotal,
        grandTotal,
        currency,
        timestamp: new Date().toISOString()
    };

    // Save Database
    const db = readDatabase();
    db.push(reservation);
    writeDatabase(db);

    // ==========================================================
    // SIMULATED SYSTEM DISPATCHES & NOTIFICATIONS (TERMINAL LOGS)
    // ==========================================================
    const border = "✦" + "─".repeat(68) + "✦";

    // 1. WhatsApp Dispatch Template
    console.log("\n" + border);
    console.log(`✦ SIMULATED WHATSAPP CONCIERGE DISPATCH (Twilio API Push Alert)`);
    console.log(`✦ Status: DELIVERED | Recipient: Resort Head Concierge & Field Trackers`);
    console.log(border);
    console.log(`*LEOPARD TRAILS JAWAI - NEW EXPEDITION OUTPOST ALERT*`);
    console.log(`*Guest Name:* ${fullName}`);
    console.log(`*Sanctuary:* ${suiteSpec.name}`);
    console.log(`*Dates:* ${checkIn} to ${checkOut} (${nights} Nights)`);
    console.log(`*Explorers:* ${guestCount}`);
    console.log(`*Addons Active:* ${addonDetails.map(a => a.name).join(', ') || 'None'}`);
    console.log(`*Custom Requests:* ${specialRequests || 'None'}`);
    console.log(`*Action Required:* Coordination driver & private jeep dispatched.`);
    console.log(border + "\n");

    // 2. Guest Confirmation Email
    console.log(border);
    console.log(`✦ SIMULATED GUEST WELCOME EMAIL (SMTP Delivery Queue)`);
    console.log(`✦ Subject: Welcome to the Chronicle — Reservation ${reservationId} Confirmed`);
    console.log(`✦ Sent to: ${email}`);
    console.log(border);
    console.log(`Greetings ${fullName},\n`);
    console.log(`We are delighted to confirm your private sanctuary outpost reservation at Leopard Trails Jawai.`);
    console.log(`Carved into Jawai's ancient granite ridge, your expedition awaits.\n`);
    console.log(`*YOUR SANCTUARY SUMMARY:*`);
    console.log(`  - Booking Code: ${reservationId}`);
    console.log(`  - Sanctuary Selected: ${suiteSpec.name}`);
    console.log(`  - Check-in: ${checkIn} | Check-out: ${checkOut} (${nights} Nights)`);
    console.log(`  - Estimated Total: ${formatCurrency(grandTotal, currency)} (${currency})`);
    console.log(`\n*PRE-ARRIVAL CHECKLIST FOR JAWAI WILDERNESS:*`);
    console.log(`  [✓] Clothing: High-end lightweight linens in khaki, sage, or sand tones.`);
    console.log(`  [✓] Safari Gear: Wide-brimmed sunhat, premium binoculars, and telephoto lenses.`);
    console.log(`  [✓] Health: Custom organic sunscreen & bug repellent (provided at suites too).`);
    console.log(`\nOur guest relations coordinator will call you shortly to refine your custom itineraries.`);
    console.log(border + "\n");

    // 3. Concierge VIP Profile Briefing
    console.log(border);
    console.log(`✦ SIMULATED CONCIERGE STAFF VIP BRIEFING (Resort Internal CMS)`);
    console.log(`✦ Priority: HIGH (VIP Explorers profiling)`);
    console.log(border);
    console.log(`[PROFILE BRIEF - HNW GUEST CUSTOMIZER]`);
    console.log(`Guest Identity: ${fullName} | Tel: ${phone}`);
    console.log(`Dietary Profiling: ${dietary || 'None specified'}`);
    console.log(`Sanctuary Assigned: ${suiteSpec.name} (Value: ${formatCurrency(grandTotal, 'INR')})`);
    console.log(`Special Customized Requests: ${specialRequests || 'None'}`);
    console.log(`*CONCIERGE PREPARATION:*`);
    console.log(`  - Pre-chill private pool to guest preference.`);
    console.log(`  - Coordinate chef team on dietary preferences: "${dietary || 'NoneSpecified'}"`);
    console.log(`  - Prep Rabari guide schedules for customized activities: ${addonDetails.map(a => a.name).join(', ') || 'None'}`);
    console.log(border + "\n");

    res.json({ success: true, bookingId: reservationId });
});

// Serve Printable Voucher HTML
app.get('/api/voucher/:id', (req, res) => {
    const db = readDatabase();
    const reservation = db.find(r => r.id === req.params.id);

    if (!reservation) {
        return res.status(404).send(`
            <div style="text-align: center; padding: 100px; font-family: sans-serif; background-color: #0b0d0c; color: #dfb257;">
                <h2>Reservation Not Found</h2>
                <p>The stay voucher ID "${req.params.id}" was not registered in our chronicle database.</p>
                <a href="/" style="color: #fff; text-decoration: underline;">Return to sanctuary</a>
            </div>
        `);
    }

    const currCode = reservation.currency || 'INR';
    const totalText = formatCurrency(reservation.grandTotal, currCode);
    const baseText = formatCurrency(reservation.baseLodgingTotal, currCode);
    const addonsText = formatCurrency(reservation.experiencesTotal, currCode);
    const taxText = formatCurrency(reservation.taxTotal, currCode);
    const nightlyText = formatCurrency(Math.round(reservation.baseLodgingTotal / reservation.nights), currCode);

    const addonsList = reservation.addons.length > 0
        ? reservation.addons.map(a => `
            <div class="voucher-row">
                <span>✦ ${a.name}</span>
                <span>${formatCurrency(a.price, currCode)}</span>
            </div>
          `).join('')
        : '<div style="color: #6a746e; font-style: italic;">No additional adventures selected</div>';

    const voucherHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stay Outpost Voucher - ${reservation.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg-color: #050606;
                --card-bg: #0b0d0c;
                --accent-gold: #dfb257;
                --text-primary: #f5f6f6;
                --text-secondary: #a3adad;
                --accent-sage: #8fa89b;
                --border-color: rgba(223, 178, 87, 0.2);
            }
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                background-color: var(--bg-color);
                color: var(--text-primary);
                font-family: 'Outfit', sans-serif;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
            }
            .voucher-container {
                max-width: 800px;
                width: 100%;
                background: var(--card-bg);
                border: 1px solid var(--accent-gold);
                box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(223, 178, 87, 0.15);
                border-radius: 8px;
                padding: 50px;
                position: relative;
                overflow: hidden;
            }
            .voucher-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 5px;
                background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 30px;
                position: relative;
            }
            .header-star {
                color: var(--accent-gold);
                font-size: 1.5rem;
                margin-bottom: 10px;
                display: inline-block;
            }
            .header h1 {
                font-family: 'Cinzel', serif;
                font-size: 2.2rem;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: var(--text-primary);
                font-weight: 500;
                margin-bottom: 5px;
            }
            .header p {
                text-transform: uppercase;
                font-size: 0.75rem;
                letter-spacing: 0.25em;
                color: var(--accent-gold);
            }
            .voucher-badge {
                position: absolute;
                top: 30px;
                right: 30px;
                border: 1px solid var(--accent-gold);
                padding: 6px 12px;
                font-size: 0.75rem;
                letter-spacing: 0.1em;
                color: var(--accent-gold);
                text-transform: uppercase;
                border-radius: 2px;
                background: rgba(223, 178, 87, 0.05);
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 40px;
                margin-bottom: 45px;
            }
            .section-box {
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 24px;
                background: rgba(255, 255, 255, 0.01);
            }
            .section-box h3 {
                font-family: 'Cinzel', serif;
                font-size: 1.05rem;
                letter-spacing: 0.1em;
                color: var(--accent-gold);
                margin-bottom: 18px;
                border-bottom: 1px solid rgba(223, 178, 87, 0.1);
                padding-bottom: 8px;
                text-transform: uppercase;
            }
            .voucher-row {
                display: flex;
                justify-content: space-between;
                font-size: 0.9rem;
                margin-bottom: 12px;
                line-height: 1.5;
            }
            .voucher-row:last-child {
                margin-bottom: 0;
            }
            .voucher-row span:first-child {
                color: var(--text-secondary);
            }
            .voucher-row span:last-child {
                font-weight: 500;
                color: var(--text-primary);
            }
            .voucher-row.total-row {
                border-top: 1px solid var(--accent-gold);
                padding-top: 15px;
                margin-top: 15px;
            }
            .voucher-row.total-row span {
                font-family: 'Cinzel', serif;
                font-size: 1.25rem;
                color: var(--accent-gold) !important;
                font-weight: 700;
            }
            .checklist {
                margin-top: 30px;
            }
            .checklist-title {
                font-family: 'Cinzel', serif;
                font-size: 1rem;
                letter-spacing: 0.08em;
                color: var(--accent-sage);
                margin-bottom: 12px;
                text-transform: uppercase;
            }
            .checklist-item {
                font-size: 0.85rem;
                color: var(--text-secondary);
                margin-bottom: 8px;
                display: flex;
                gap: 8px;
            }
            .checklist-item span {
                color: var(--accent-gold);
            }
            .action-bar {
                margin-top: 40px;
                display: flex;
                gap: 20px;
                justify-content: center;
                width: 100%;
                max-width: 800px;
            }
            .btn {
                padding: 14px 28px;
                font-family: 'Outfit', sans-serif;
                font-size: 0.85rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                outline: none;
                text-decoration: none;
                text-align: center;
            }
            .btn.filled {
                background-color: var(--accent-gold);
                color: var(--bg-color);
                border: 1px solid var(--accent-gold);
            }
            .btn.filled:hover {
                box-shadow: 0 0 20px rgba(223, 178, 87, 0.4);
                transform: translateY(-2px);
            }
            .btn.outline {
                background-color: transparent;
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
            }
            .btn.outline:hover {
                border-color: var(--accent-gold);
                color: var(--text-primary);
            }
            .voucher-note {
                text-align: center;
                font-size: 0.8rem;
                color: var(--text-secondary);
                line-height: 1.5;
                margin-top: 40px;
                border-top: 1px solid var(--border-color);
                padding-top: 25px;
            }
            
            /* Print overrides */
            @media print {
                html, body {
                    height: 99%;
                    overflow: hidden;
                    background-color: #fff !important;
                    color: #000 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    font-size: 11px !important;
                }
                .voucher-container {
                    background: #fff !important;
                    border: 1px solid #000 !important;
                    box-shadow: none !important;
                    color: #000 !important;
                    padding: 15px 25px !important;
                    margin: 0 auto !important;
                    max-width: 100% !important;
                    width: 100% !important;
                    height: auto !important;
                }
                .voucher-container::before {
                    display: none;
                }
                .header {
                    margin-bottom: 15px !important;
                    padding-bottom: 10px !important;
                }
                .header h1 {
                    font-size: 1.5rem !important;
                }
                .grid {
                    gap: 15px !important;
                    margin-bottom: 15px !important;
                }
                .section-box {
                    padding: 12px 18px !important;
                    border: 1px solid #ddd !important;
                    background: none !important;
                }
                .section-box h3 {
                    color: #000 !important;
                    border-bottom: 1px solid #000 !important;
                    font-size: 0.85rem !important;
                    margin-bottom: 8px !important;
                    padding-bottom: 4px !important;
                }
                .voucher-row {
                    margin-bottom: 6px !important;
                    font-size: 0.8rem !important;
                }
                .voucher-row span:first-child {
                    color: #444 !important;
                }
                .voucher-row span:last-child {
                    color: #000 !important;
                }
                .voucher-row.total-row {
                    border-top: 2px solid #000 !important;
                    padding-top: 8px !important;
                    margin-top: 8px !important;
                }
                .voucher-row.total-row span {
                    font-size: 1rem !important;
                    color: #000 !important;
                }
                .checklist {
                    margin-top: 15px !important;
                }
                .checklist-title {
                    color: #000 !important;
                    font-size: 0.85rem !important;
                    margin-bottom: 6px !important;
                }
                .checklist-item {
                    color: #333 !important;
                    font-size: 0.75rem !important;
                    margin-bottom: 4px !important;
                }
                .checklist-item span {
                    color: #000 !important;
                }
                .voucher-note {
                    color: #555 !important;
                    border-top: 1px solid #ccc !important;
                    margin-top: 15px !important;
                    padding-top: 10px !important;
                    font-size: 0.7rem !important;
                }
                .action-bar, .no-print {
                    display: none !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="voucher-container">
            <div class="voucher-badge">${reservation.id}</div>
            
            <div class="header">
                <span class="header-star">✦</span>
                <h1>Leopard Trails</h1>
                <p>Jawai Wilderness Retreat</p>
            </div>
            
            <div class="grid">
                <!-- Left Box: Stay Specifics -->
                <div class="section-box">
                    <h3>Sanctuary Stay Spec</h3>
                    <div class="voucher-row">
                        <span>Sanctuary</span>
                        <span style="color: var(--accent-gold); font-weight:600;">${reservation.suite}</span>
                    </div>
                    <div class="voucher-row">
                        <span>Check-In</span>
                        <span>${reservation.checkIn}</span>
                    </div>
                    <div class="voucher-row">
                        <span>Check-Out</span>
                        <span>${reservation.checkOut}</span>
                    </div>
                    <div class="voucher-row">
                        <span>Nights</span>
                        <span>${reservation.nights} Nights</span>
                    </div>
                    <div class="voucher-row">
                        <span>Explorers</span>
                        <span>${reservation.guests} Guests</span>
                    </div>
                    <div class="voucher-row">
                        <span>Dietary</span>
                        <span>${reservation.dietary}</span>
                    </div>
                </div>
                
                <!-- Right Box: Guest Outpost details -->
                <div class="section-box">
                    <h3>Explorer Outpost Info</h3>
                    <div class="voucher-row">
                        <span>Full Name</span>
                        <span>${reservation.fullName}</span>
                    </div>
                    <div class="voucher-row">
                        <span>Email</span>
                        <span>${reservation.email}</span>
                    </div>
                    <div class="voucher-row">
                        <span>Phone</span>
                        <span>${reservation.phone}</span>
                    </div>
                    <div class="voucher-row" style="margin-top: 10px;">
                        <span style="display:block; margin-bottom:4px; font-size:0.8rem;">Special Requests:</span>
                        <p style="font-size:0.8rem; color: var(--text-secondary); line-height:1.4;">${reservation.specialRequests}</p>
                    </div>
                </div>
            </div>
            
            <!-- Experiences & Pricing Details -->
            <div class="grid">
                <div class="section-box">
                    <h3>Enhanced Adventures</h3>
                    ${addonsList}
                </div>
                
                <div class="section-box">
                    <h3>Expedition Invoice</h3>
                    <div class="voucher-row">
                        <span>Base Lodging (${reservation.nights} Nights)</span>
                        <span>${baseText}</span>
                    </div>
                    <div class="voucher-row">
                        <span>Experiences Add-ons</span>
                        <span>${addonsText}</span>
                    </div>
                    <div class="voucher-row">
                        <span>Luxury Tax & Service (18%)</span>
                        <span>${taxText}</span>
                    </div>
                    <div class="voucher-row total-row">
                        <span>Estimated Total</span>
                        <span>${totalText}</span>
                    </div>
                </div>
            </div>
            
            <!-- Pre Arrival Checklist -->
            <div class="checklist">
                <h4 class="checklist-title">✦ Pre-Arrival Outpost Checklist</h4>
                <div class="checklist-item">
                    <span>✦</span> Pack neutral tone clothing (beige, sage, sand, olive) to blend seamlessly during leopard safaris.
                </div>
                <div class="checklist-item">
                    <span>✦</span> Ensure camera lenses, chargers, and quality binoculars are in your hand luggage.
                </div>
                <div class="checklist-item">
                    <span>✦</span> Custom coordinates: Jawai Bandh area, Pali Valley, Rajasthan. Driving directions dispatched via WhatsApp.
                </div>
            </div>
            
            <div class="voucher-note">
                <p>This stays voucher is a confirmation receipt. The head concierge team has dispatched coordination drivers. Upon outpost arrival, customized itineraries and secure thali dining options will be settled. We look forward to welcoming you.</p>
            </div>
        </div>
        
        <!-- Bottom action bar -->
        <div class="action-bar no-print">
            <button class="btn filled" onclick="window.print()">Print Stay Voucher</button>
            <a href="http://127.0.0.1:8080" class="btn outline">Return to Sanctuary</a>
        </div>
        
        <script>
            // Automatic print trigger
            window.addEventListener('load', () => {
                setTimeout(() => {
                    window.print();
                }, 800);
            });
        </script>
    </body>
    </html>
    `;
    res.send(voucherHtml);
});

// API: List reservations (Optional Concierge view helper)
app.get('/api/reservations', (req, res) => {
    res.json(readDatabase());
});

app.listen(PORT, () => {
    console.log(`\n✦ Leopard Trails Luxury Backend activated.`);
    console.log(`✦ Server listening on: http://localhost:${PORT}`);
    console.log(`✦ Database persistent path: ${DB_FILE}\n`);
});
