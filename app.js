document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    // Navigation Scroll & Mobile Toggle
    // ----------------------------------------
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animation on toggle bars
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5deg, -5px)' : 'none';
    });

    // Close menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ----------------------------------------
    // Sliding Tab Indicators Initialization
    // ----------------------------------------
    function initSlidingTabs(tabsContainerSelector, btnSelector, tabActiveChangeCallback) {
        const containers = document.querySelectorAll(tabsContainerSelector);
        containers.forEach(container => {
            const activePill = document.createElement('div');
            activePill.className = 'tab-pill-indicator';
            container.appendChild(activePill);

            const buttons = container.querySelectorAll(btnSelector);
            
            function updatePillPosition(activeBtn) {
                activePill.style.width = `${activeBtn.offsetWidth}px`;
                activePill.style.height = `${activeBtn.offsetHeight}px`;
                activePill.style.left = `${activeBtn.offsetLeft}px`;
                activePill.style.top = `${activeBtn.offsetTop}px`;
            }

            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updatePillPosition(btn);
                    if (tabActiveChangeCallback) {
                        tabActiveChangeCallback(btn);
                    }
                });
            });

            // Initial alignment
            const initialActive = container.querySelector(`${btnSelector}.active`) || buttons[0];
            if (initialActive) {
                initialActive.classList.add('active');
                setTimeout(() => updatePillPosition(initialActive), 150);
            }

            window.addEventListener('resize', () => {
                const currentActive = container.querySelector(`${btnSelector}.active`);
                if (currentActive) {
                    updatePillPosition(currentActive);
                }
            });
        });
    }

    // Initialize Safari Sliding Tabs
    const safariPanes = document.querySelectorAll('.safari-pane');
    initSlidingTabs('.safari-tabs', '.tab-btn', (btn) => {
        safariPanes.forEach(p => p.classList.remove('active'));
        const tabId = btn.getAttribute('data-tab');
        const activePane = document.getElementById(`pane-${tabId}`);
        if (activePane) activePane.classList.add('active');
    });

    // Initialize Dining Sliding Tabs
    const diningPanes = document.querySelectorAll('.menu-pane');
    initSlidingTabs('.dining-tabs', '.tab-btn', (btn) => {
        diningPanes.forEach(p => p.classList.remove('active'));
        const menuId = btn.getAttribute('data-menu');
        const activePane = document.getElementById(`menu-${menuId}`);
        if (activePane) activePane.classList.add('active');
    });

    // ----------------------------------------
    // Luxury Suites Slider
    // ----------------------------------------
    const slider = document.getElementById('suites-slider');
    const nextBtn = document.getElementById('carousel-next');
    const prevBtn = document.getElementById('carousel-prev');
    let sliderIndex = 0;
    
    function getCardWidth() {
        const firstCard = slider ? slider.querySelector('.suite-card') : null;
        if (!firstCard) return 510; // fallback default
        const gap = parseFloat(window.getComputedStyle(slider).gap) || 30;
        return firstCard.offsetWidth + gap;
    }
    
    function updateSlider() {
        if (!slider) return;
        const cardWidth = getCardWidth();
        
        // Boundaries for responsiveness
        const visibleWidth = document.querySelector('.suites-carousel').offsetWidth;
        const totalSliderWidth = slider.scrollWidth;
        
        const nav = document.querySelector('.carousel-nav');
        if (totalSliderWidth <= visibleWidth) {
            slider.style.transform = 'translateX(0)';
            sliderIndex = 0;
            if (nav) nav.style.display = 'none';
            return;
        } else {
            if (nav) nav.style.display = 'flex';
        }

        const maxOffset = totalSliderWidth - visibleWidth;
        let offset = sliderIndex * cardWidth;
        
        if (offset > maxOffset) {
            offset = maxOffset;
            sliderIndex = Math.ceil(maxOffset / cardWidth);
        }
        
        slider.style.transform = `translateX(-${offset}px)`;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            const visibleWidth = document.querySelector('.suites-carousel').offsetWidth;
            const totalSliderWidth = slider.scrollWidth;
            if (sliderIndex * cardWidth < totalSliderWidth - visibleWidth) {
                sliderIndex++;
                updateSlider();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (sliderIndex > 0) {
                sliderIndex--;
                updateSlider();
            }
        });
    }

    // Touch Swipe Navigation for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        if (!slider) return;
        const threshold = 50; // swipe minimum distance in pixels
        const totalSliderWidth = slider.scrollWidth;
        const visibleWidth = document.querySelector('.suites-carousel').offsetWidth;
        const cardWidth = getCardWidth();
        
        if (touchStartX - touchEndX > threshold) {
            // Swiped Left -> Next card
            if (sliderIndex * cardWidth < totalSliderWidth - visibleWidth) {
                sliderIndex++;
                updateSlider();
            }
        } else if (touchEndX - touchStartX > threshold) {
            // Swiped Right -> Previous card
            if (sliderIndex > 0) {
                sliderIndex--;
                updateSlider();
            }
        }
    }

    window.addEventListener('resize', updateSlider);

    // ----------------------------------------
    // Dynamic Booking pricing & validation
    // ----------------------------------------
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const suiteSelect = document.getElementById('booking-suite');
    const guestSelect = document.getElementById('guests');
    const addonCheckboxes = document.querySelectorAll('.experience-addon');
    const currencySelect = document.getElementById('currency-selector');
    const summaryAddonsDetails = document.getElementById('summary-addons-details');
    
    // Summary targets
    const summarySuiteName = document.getElementById('summary-suite-name');
    const summaryNightlyRate = document.getElementById('summary-nightly-rate');
    const summaryNightsCount = document.getElementById('summary-nights-count');
    const summaryGuestsCount = document.getElementById('summary-guests-count');
    const summaryBaseTotal = document.getElementById('summary-base-total');
    const summaryExperienceTotal = document.getElementById('summary-experience-total');
    const summaryTaxTotal = document.getElementById('summary-tax-total');
    const summaryGrandTotal = document.getElementById('summary-grand-total');

    // Date pre-population (Today and Tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2); // default 2-night stay

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    checkInInput.value = formatDate(today);
    checkOutInput.value = formatDate(tomorrow);
    checkInInput.min = formatDate(today);
    
    // Quick booking bar sync
    const quickArrival = document.getElementById('quick-arrival');
    const quickDeparture = document.getElementById('quick-departure');
    const quickGuests = document.getElementById('quick-guests');
    const quickSuite = document.getElementById('quick-suite');
    
    quickArrival.value = formatDate(today);
    quickDeparture.value = formatDate(tomorrow);
    quickArrival.min = formatDate(today);

    // Currency Definitions & Conversion Multipliers
    const currencyRates = {
        INR: { factor: 1.0, symbol: '₹', locale: 'en-IN' },
        USD: { factor: 1 / 83.0, symbol: '$', locale: 'en-US' },
        EUR: { factor: 1 / 90.0, symbol: '€', locale: 'de-DE' },
        GBP: { factor: 1 / 105.0, symbol: '£', locale: 'en-GB' }
    };

    function formatCurrencyVal(val, currencyCode) {
        const spec = currencyRates[currencyCode] || currencyRates.INR;
        const converted = Math.round(val * spec.factor);
        return `${spec.symbol}${converted.toLocaleString(spec.locale)}`;
    }

    function updatePricing() {
        const checkInVal = new Date(checkInInput.value);
        const checkOutVal = new Date(checkOutInput.value);
        
        // Calculate nights
        let nights = 1;
        if (checkOutVal > checkInVal) {
            const timeDiff = Math.abs(checkOutVal.getTime() - checkInVal.getTime());
            nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        } else {
            // Auto fix checkout if invalid
            const newCheckout = new Date(checkInVal);
            newCheckout.setDate(newCheckout.getDate() + 1);
            checkOutInput.value = formatDate(newCheckout);
            nights = 1;
            showLuxuryToast('Checkout Adjusted', 'Checkout date was set to 1 night from check-in.');
        }

        // Selected suite rates
        const selectedOption = suiteSelect.options[suiteSelect.selectedIndex];
        const nightlyRate = parseInt(selectedOption.getAttribute('data-price')) || 80000;
        const suiteName = selectedOption.text.split(' — ')[0];

        // Guests adjustment
        const guestCount = parseInt(guestSelect.value) || 2;
        let lodgingRateModifier = 1.0;
        
        if (guestCount === 1) {
            lodgingRateModifier = 0.9; // 10% discount for solo explorers
        } else if (guestCount > 2) {
            lodgingRateModifier = 1.15; // 15% surcharge for additional bed
        }

        // Base totals
        const calculatedNightly = Math.round(nightlyRate * lodgingRateModifier);
        const baseLodgingTotal = calculatedNightly * nights;

        // Experiences Add-on totals & Detailed List rendering
        let experienceTotal = 0;
        if (summaryAddonsDetails) {
            summaryAddonsDetails.innerHTML = '';
        }
        
        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                const price = parseInt(cb.getAttribute('data-price')) || 0;
                experienceTotal += price;
                
                // Render detailed badge inside stay summary
                const labelText = cb.parentElement.textContent.trim().split(' (')[0];
                const addonItem = document.createElement('div');
                addonItem.className = 'summary-addon-item';
                
                const currCode = currencySelect ? currencySelect.value : 'INR';
                addonItem.innerHTML = `
                    <span>${labelText}</span>
                    <span>${formatCurrencyVal(price, currCode)}</span>
                `;
                if (summaryAddonsDetails) {
                    summaryAddonsDetails.appendChild(addonItem);
                }
            }
        });

        // 18% Luxury Tax & Service fee
        const taxRate = 0.18;
        const taxTotal = Math.round((baseLodgingTotal + experienceTotal) * taxRate);
        const grandTotal = baseLodgingTotal + experienceTotal + taxTotal;

        // Dynamic Currency Formatting
        const currentCurrency = currencySelect ? currencySelect.value : 'INR';

        // Update UI summary panel
        summarySuiteName.textContent = suiteName;
        summaryNightlyRate.textContent = formatCurrencyVal(calculatedNightly, currentCurrency);
        summaryNightsCount.textContent = `${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
        summaryGuestsCount.textContent = `${guestCount} ${guestCount === 1 ? 'Explorer' : 'Explorers'}`;
        summaryBaseTotal.textContent = formatCurrencyVal(baseLodgingTotal, currentCurrency);
        summaryExperienceTotal.textContent = formatCurrencyVal(experienceTotal, currentCurrency);
        summaryTaxTotal.textContent = formatCurrencyVal(taxTotal, currentCurrency);
        summaryGrandTotal.textContent = formatCurrencyVal(grandTotal, currentCurrency);
    }

    // Set up listeners for form changes
    checkInInput.addEventListener('change', () => {
        const checkInVal = new Date(checkInInput.value);
        const minCheckout = new Date(checkInVal);
        minCheckout.setDate(minCheckout.getDate() + 1);
        checkOutInput.min = formatDate(minCheckout);
        
        if (new Date(checkOutInput.value) <= checkInVal) {
            checkOutInput.value = formatDate(minCheckout);
        }
        updatePricing();
    });

    checkOutInput.addEventListener('change', updatePricing);
    suiteSelect.addEventListener('change', updatePricing);
    guestSelect.addEventListener('change', updatePricing);
    addonCheckboxes.forEach(cb => cb.addEventListener('change', updatePricing));
    if (currencySelect) {
        currencySelect.addEventListener('change', updatePricing);
    }

    // Handle "Select Sanctuary" button clicks on suites cards
    const selectSuiteBtns = document.querySelectorAll('.select-suite-btn');
    selectSuiteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const suiteType = btn.getAttribute('data-suite');
            suiteSelect.value = suiteType;
            
            // Scroll to reservation form
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            
            updatePricing();
            
            // Subtle flash animation on the summary card to draw focus
            const summaryCard = document.querySelector('.booking-summary-area');
            summaryCard.style.transition = 'none';
            summaryCard.style.boxShadow = '0 0 40px rgba(223, 178, 87, 0.4)';
            setTimeout(() => {
                summaryCard.style.transition = 'var(--transition-smooth)';
                summaryCard.style.boxShadow = 'none';
            }, 100);
        });
    });

    // Quick Booking Submit Logic (sync with main form)
    const quickBookingForm = document.getElementById('quick-booking-form');
    quickBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        checkInInput.value = quickArrival.value;
        checkOutInput.value = quickDeparture.value;
        guestSelect.value = quickGuests.value;
        suiteSelect.value = quickSuite.value;
        
        // Scroll to reservation form
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        
        updatePricing();
    });

    // ----------------------------------------
    // Modal confirmation logic
    // ----------------------------------------
    const reservationForm = document.getElementById('reservation-form');
    const confirmModal = document.getElementById('confirm-modal');
    const modalSuiteName = document.getElementById('modal-suite-name');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Offline Voucher HTML Generator Helper
    function getOfflineVoucherHtml(data) {
        const borderStar = "✦";
        const addonsList = data.addons.length > 0
            ? data.addons.map(a => `
                <div class="voucher-row">
                    <span>✦ ${a.name}</span>
                    <span>${a.priceFormatted}</span>
                </div>
              `).join('')
            : '<div style="color: #6a746e; font-style: italic;">No additional adventures selected</div>';

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Stay Outpost Voucher - ${data.id} (Offline Simulation)</title>
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
                .offline-banner {
                    background: rgba(223, 178, 87, 0.1);
                    border: 1px dashed var(--accent-gold);
                    padding: 10px 20px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                    text-align: center;
                    font-size: 0.85rem;
                    color: var(--accent-gold);
                    letter-spacing: 0.05em;
                    width: 100%;
                    max-width: 800px;
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
                    .offline-banner, .action-bar, .no-print {
                        display: none !important;
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
                }
            </style>
        </head>
        <body>
            <div class="offline-banner">
                ✦ HIGH-FIDELITY LOCAL SIMULATION ACTIVE ✦ Stay database and printable stay voucher calculated in-browser securely.
            </div>
            <div class="voucher-container">
                <div class="voucher-badge">${data.id}</div>
                
                <div class="header">
                    <span class="header-star">${borderStar}</span>
                    <h1>Leopard Trails</h1>
                    <p>Jawai Wilderness Retreat</p>
                </div>
                
                <div class="grid">
                    <div class="section-box">
                        <h3>Sanctuary Stay Spec</h3>
                        <div class="voucher-row">
                            <span>Sanctuary</span>
                            <span style="color: var(--accent-gold); font-weight:600;">${data.suiteName}</span>
                        </div>
                        <div class="voucher-row">
                            <span>Check-In</span>
                            <span>${data.checkIn}</span>
                        </div>
                        <div class="voucher-row">
                            <span>Check-Out</span>
                            <span>${data.checkOut}</span>
                        </div>
                        <div class="voucher-row">
                            <span>Nights</span>
                            <span>${data.nights} Nights</span>
                        </div>
                        <div class="voucher-row">
                            <span>Explorers</span>
                            <span>${data.guests} Guests</span>
                        </div>
                        <div class="voucher-row">
                            <span>Dietary</span>
                            <span>${data.dietary}</span>
                        </div>
                    </div>
                    
                    <div class="section-box">
                        <h3>Explorer Outpost Info</h3>
                        <div class="voucher-row">
                            <span>Full Name</span>
                            <span>${data.fullName}</span>
                        </div>
                        <div class="voucher-row">
                            <span>Email</span>
                            <span>${data.email}</span>
                        </div>
                        <div class="voucher-row">
                            <span>Phone</span>
                            <span>${data.phone}</span>
                        </div>
                        <div class="voucher-row" style="margin-top: 10px;">
                            <span style="display:block; margin-bottom:4px; font-size:0.8rem;">Special Requests:</span>
                            <p style="font-size:0.8rem; color: var(--text-secondary); line-height:1.4;">${data.specialRequests}</p>
                        </div>
                    </div>
                </div>
                
                <div class="grid">
                    <div class="section-box">
                        <h3>Enhanced Adventures</h3>
                        ${addonsList}
                    </div>
                    
                    <div class="section-box">
                        <h3>Expedition Invoice</h3>
                        <div class="voucher-row">
                            <span>Base Lodging (${data.nights} Nights)</span>
                            <span>${data.baseTotalFormatted}</span>
                        </div>
                        <div class="voucher-row">
                            <span>Experiences Add-ons</span>
                            <span>${data.experienceTotalFormatted}</span>
                        </div>
                        <div class="voucher-row">
                            <span>Luxury Tax & Service (18%)</span>
                            <span>${data.taxTotalFormatted}</span>
                        </div>
                        <div class="voucher-row total-row">
                            <span>Estimated Total</span>
                            <span>${data.grandTotalFormatted}</span>
                        </div>
                    </div>
                </div>
                
                <div class="checklist">
                    <h4 class="checklist-title">✦ Pre-Arrival Outpost Checklist</h4>
                    <div class="checklist-item">
                        <span>✦</span> Pack neutral clothing (khaki, sand, sage green) to blend in perfectly during safaris.
                    </div>
                    <div class="checklist-item">
                        <span>✦</span> Hand-carry camera telephotos, battery cells, and premium binoculars.
                    </div>
                    <div class="checklist-item">
                        <span>✦</span> Outpost coordinate briefings will be delivered via cellular templates.
                    </div>
                </div>
                
                <div class="voucher-note">
                    <p>This stays voucher is a confirmation receipt. The head concierge team has dispatched coordination drivers. Upon outpost arrival, customized itineraries and secure thali dining options will be settled. We look forward to welcoming you.</p>
                </div>
            </div>
            
            <div class="action-bar no-print">
                <button class="btn filled" onclick="window.print()">Print Stay Voucher</button>
                <button class="btn outline" onclick="window.close()">Close Document</button>
            </div>
            
            <script>
                window.addEventListener('load', () => {
                    setTimeout(() => { window.print(); }, 800);
                });
            </script>
        </body>
        </html>
        `;
    }

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Retrieve inputs
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const suite = suiteSelect.value;
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const guests = parseInt(guestSelect.value) || 2;
        const dietary = document.getElementById('dietary').value || "None specified";
        const specialRequests = document.getElementById('special-requests').value || "None specified";
        
        const currentCurrency = currencySelect ? currencySelect.value : 'INR';
        
        // Checked addons
        const activeAddons = [];
        addonCheckboxes.forEach(cb => {
            if (cb.checked) activeAddons.push(cb.value);
        });

        const selectedOption = suiteSelect.options[suiteSelect.selectedIndex];
        const suiteName = selectedOption.text.split(' — ')[0];

        // Prepare raw values for potential offline voucher rendering
        const nightsText = summaryNightsCount.textContent.split(' ')[0];
        const nights = parseInt(nightsText) || 1;

        const baseTotalVal = summaryBaseTotal.textContent;
        const experienceTotalVal = summaryExperienceTotal.textContent;
        const taxTotalVal = summaryTaxTotal.textContent;
        const grandTotalVal = summaryGrandTotal.textContent;

        const addonsData = [];
        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                const labelText = cb.parentElement.textContent.trim().split(' (')[0];
                addonsData.push({
                    name: labelText,
                    priceFormatted: formatCurrencyVal(parseInt(cb.getAttribute('data-price')), currentCurrency)
                });
            }
        });

        const offlineVoucherData = {
            id: `LTS-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`,
            fullName,
            email,
            phone,
            suiteName,
            checkIn,
            checkOut,
            nights,
            guests,
            dietary,
            specialRequests,
            addons: addonsData,
            baseTotalFormatted: baseTotalVal,
            experienceTotalFormatted: experienceTotalVal,
            taxTotalFormatted: taxTotalVal,
            grandTotalFormatted: grandTotalVal
        };

        const postData = {
            fullName,
            email,
            phone,
            suite,
            checkIn,
            checkOut,
            guests,
            dietary,
            addons: activeAddons,
            specialRequests,
            currency: currentCurrency
        };

        // Attempt API submit
        fetch('http://localhost:5000/api/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then(res => {
            if (!res.ok) throw new Error("API server returned non-200 response code.");
            return res.json();
        })
        .then(data => {
            if (data.success) {
                // Show modal
                modalSuiteName.textContent = suiteName;
                confirmModal.classList.add('active');
                
                // Google Analytics event tracking
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', {
                        'event_category': 'Engagement',
                        'event_label': 'Outpost Booking Form Submit',
                        'value': 1.0
                    });
                }
                
                showLuxuryToast('Request Transmitted', `Concierge service has scheduled a call for the ${suiteName}.`);
                showLuxuryToast('Voucher PERSISTED', `Chronicle stay record ${data.bookingId} registered. Opening stay voucher...`);
                
                // Open dynamic backend printable voucher
                setTimeout(() => {
                    window.open(`http://localhost:5000/api/voucher/${data.bookingId}`, '_blank');
                }, 1000);
            } else {
                throw new Error("API response declared success:false");
            }
        })
        .catch(err => {
            console.warn("✦ Reservation server offline or unreachable. Engaging high-fidelity client simulation fallback.", err);
            
            // Show modal
            modalSuiteName.textContent = suiteName;
            confirmModal.classList.add('active');
            
            // Google Analytics event tracking
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    'event_category': 'Engagement',
                    'event_label': 'Outpost Booking Form Submit',
                    'value': 1.0
                });
            }
            
            showLuxuryToast('Offline Simulation Active', `Concierge scheduled a local call. Stays voucher calculated in-browser.`);
            
            // Generate and open local offline fallback stays voucher
            const voucherHtml = getOfflineVoucherHtml(offlineVoucherData);
            setTimeout(() => {
                const voucherWindow = window.open('', '_blank');
                if (voucherWindow) {
                    voucherWindow.document.write(voucherHtml);
                    voucherWindow.document.close();
                } else {
                    showLuxuryToast('Popup Blocked', 'Please enable popup permits to view your stays voucher.');
                }
            }, 1000);
        });
    });

    closeModalBtn.addEventListener('click', () => {
        confirmModal.classList.remove('active');
        reservationForm.reset();
        
        // Reset check-in/out and pricing to defaults
        checkInInput.value = formatDate(today);
        checkOutInput.value = formatDate(tomorrow);
        updatePricing();
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && confirmModal.classList.contains('active')) {
            confirmModal.classList.remove('active');
            reservationForm.reset();
            updatePricing();
        }
    });

    // ----------------------------------------
    // Newsletter Submit
    // ----------------------------------------
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        showLuxuryToast('Expedition Registered', `✦ Welcome to the Chronicle, concierge service has registered: ${email}`);
        newsletterForm.reset();
    });

    // ----------------------------------------
    // Dynamic Gold Dust Particles Generator
    // ----------------------------------------
    const heroSection = document.getElementById('hero');
    const particleContainer = document.createElement('div');
    particleContainer.className = 'hero-particles';
    if (heroSection) {
        heroSection.appendChild(particleContainer);
        
        // Generate floating particles
        const particleCount = 28;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            
            // Random styling for authentic dispersion
            const size = Math.random() * 8 + 3; // 3px to 11px
            const left = Math.random() * 100; // 0% to 100%
            const delay = Math.random() * 15; // 0s to 15s delay
            const duration = Math.random() * 12 + 10; // 10s to 22s duration
            const opacity = Math.random() * 0.35 + 0.15;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.opacity = opacity;
            
            particleContainer.appendChild(particle);
        }
    }

    // ----------------------------------------
    // Throttled High-Performance Render Loop
    // ----------------------------------------
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('.hero-video');
    const heroBg = document.querySelector('.hero-bg');
    const mobileStickyBar = document.getElementById('mobile-sticky-bar');

    let lastScrollY = 0;
    let ticked = false;

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticked) {
            requestAnimationFrame(updateScrollAnimations);
            ticked = true;
        }
    }

    function updateScrollAnimations() {
        const scrolled = lastScrollY;
        
        // 1. Cinematic Slow Parallax Scroll Engine
        if (scrolled < window.innerHeight) {
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
            if (heroVideo) {
                heroVideo.style.transform = `translateY(${scrolled * 0.12}px) scale(${1 + (scrolled * 0.0001)})`;
            }
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrolled * 0.12}px) scale(${1.05 + (scrolled * 0.0001)})`;
            }
        }


        // 3. Mobile Sticky Booking Footer Trigger
        if (mobileStickyBar) {
            if (window.innerWidth <= 768) {
                if (scrolled > window.innerHeight - 150) {
                    mobileStickyBar.classList.add('active');
                } else {
                    mobileStickyBar.classList.remove('active');
                }
            } else {
                mobileStickyBar.classList.remove('active');
            }
        }

        ticked = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ----------------------------------------
    // Force Autoplay Safeguard & Diagnostic
    // ----------------------------------------
    const heroVideoEl = document.querySelector('.hero-video');
    if (heroVideoEl) {
        // Ensure video is muted to comply with autoplay policies
        heroVideoEl.muted = true;
        
        // Force play
        const playPromise = heroVideoEl.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("✦ Hero video autoplay initiated successfully.");
            }).catch(error => {
                console.warn("✦ Autoplay prevented, registering fallback interaction play triggers:", error);
                
                const forcePlayOnInteraction = () => {
                    heroVideoEl.play().then(() => {
                        console.log("✦ Hero video started playing after user interaction.");
                        removeInteractionListeners();
                    }).catch(err => {
                        console.error("✦ Force play failed on interaction:", err);
                    });
                };
                
                const removeInteractionListeners = () => {
                    document.removeEventListener('click', forcePlayOnInteraction);
                    document.removeEventListener('touchstart', forcePlayOnInteraction);
                    document.removeEventListener('scroll', forcePlayOnInteraction);
                };
                
                document.addEventListener('click', forcePlayOnInteraction);
                document.addEventListener('touchstart', forcePlayOnInteraction);
                document.addEventListener('scroll', forcePlayOnInteraction);
            });
        }
    }

    // ✦ Luxury Toast Notification System Helper
    function showLuxuryToast(title, message) {
        let container = document.querySelector('.luxury-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'luxury-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'luxury-toast';
        toast.innerHTML = `
            <div class="luxury-toast-icon">✦</div>
            <div class="luxury-toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;

        container.appendChild(toast);

        // Auto dismiss after 4.5 seconds
        setTimeout(() => {
            toast.classList.add('dismissing');
            toast.addEventListener('transitionend', () => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            });
        }, 4500);
    }

    // ----------------------------------------
    // Concierge Owner Realtime Dashboard Logic
    // ----------------------------------------
    const conciergeLoginForm = document.getElementById('concierge-login-form');
    const conciergeLockScreen = document.getElementById('concierge-lock-screen');
    const conciergeDashboard = document.getElementById('concierge-dashboard');
    const conciergeLogoutBtn = document.getElementById('concierge-logout-btn');
    const dbToggleSwitch = document.getElementById('db-toggle-switch');
    const dbToggleLabel = document.getElementById('db-toggle-label');
    const supabaseInputsPanel = document.getElementById('supabase-inputs-panel');
    const saveSupabaseBtn = document.getElementById('save-supabase-settings');
    const copySqlBtn = document.getElementById('copy-sql-schema-btn');
    const syncLabel = document.getElementById('sync-label');
    const tableBody = document.getElementById('dashboard-table-body');
    const logoutBtn = document.getElementById('concierge-logout-btn');

    let reservationsList = [];
    let supabaseClient = null;

    // Check authorization session status on load
    if (sessionStorage.getItem('conciergeAuthorized') === 'true') {
        if (conciergeLockScreen) conciergeLockScreen.style.display = 'none';
        if (conciergeDashboard) conciergeDashboard.style.display = 'block';
        initConciergeSystem();
    }

    // Login Form Authorization Handler
    if (conciergeLoginForm) {
        conciergeLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('concierge-user').value.trim();
            const pass = document.getElementById('concierge-pass').value.trim();

            if (user === 'concierge' && pass === 'jawai-luxury') {
                sessionStorage.setItem('conciergeAuthorized', 'true');
                if (conciergeLockScreen) conciergeLockScreen.style.display = 'none';
                if (conciergeDashboard) conciergeDashboard.style.display = 'block';
                showLuxuryToast('Access Granted', 'Welcome to the Outpost Control Center, Sir / Madam.');
                initConciergeSystem();
            } else {
                showLuxuryToast('Security Warning', 'Resort security key not recognized. Access denied.');
            }
        });
    }

    // Logout Handler
    if (conciergeLogoutBtn) {
        conciergeLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('conciergeAuthorized');
            showLuxuryToast('Access Revoked', 'Session destroyed. Lock screen re-engaged.');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }

    // SQL Schema Copier
    if (copySqlBtn) {
        copySqlBtn.addEventListener('click', () => {
            const schemaText = document.getElementById('sql-schema-box').innerText;
            navigator.clipboard.writeText(schemaText).then(() => {
                showLuxuryToast('Copied to Clipboard', 'SQL Schema copied successfully. Paste into Supabase SQL Editor.');
            }).catch(err => {
                console.error("Copy failed:", err);
            });
        });
    }

    function initConciergeSystem() {
        // Toggle DB sync settings
        const currentMode = localStorage.getItem('conciergeDbMode') || 'local';
        if (dbToggleSwitch) {
            dbToggleSwitch.checked = (currentMode === 'supabase');
            updateDbToggleState(dbToggleSwitch.checked);

            dbToggleSwitch.addEventListener('change', () => {
                updateDbToggleState(dbToggleSwitch.checked);
                loadStayChronicles();
            });
        }

        // Save Supabase Settings
        if (saveSupabaseBtn) {
            saveSupabaseBtn.addEventListener('click', () => {
                const url = document.getElementById('supabase-url').value.trim();
                const key = document.getElementById('supabase-key').value.trim();

                if (!url.startsWith('https://') || key.length < 20) {
                    showLuxuryToast('Connection Error', 'Please enter a valid Supabase project URL and Anon key.');
                    return;
                }

                localStorage.setItem('supabaseUrl', url);
                localStorage.setItem('supabaseKey', key);

                initializeSupabase(url, key);
            });
        }

        // Pre-populate Supabase settings
        const url = localStorage.getItem('supabaseUrl') || '';
        const key = localStorage.getItem('supabaseKey') || '';
        if (document.getElementById('supabase-url')) document.getElementById('supabase-url').value = url;
        if (document.getElementById('supabase-key')) document.getElementById('supabase-key').value = key;

        if (url && key && currentMode === 'supabase') {
            initializeSupabase(url, key);
        } else {
            loadStayChronicles();
        }

        // Refresh database every 8 seconds in the background
        setInterval(() => {
            if (sessionStorage.getItem('conciergeAuthorized') === 'true') {
                loadStayChronicles();
            }
        }, 8000);
    }

    function updateDbToggleState(isSupabase) {
        if (isSupabase) {
            localStorage.setItem('conciergeDbMode', 'supabase');
            if (dbToggleLabel) dbToggleLabel.innerText = "Realtime Supabase Database Sync Mode";
            if (supabaseInputsPanel) supabaseInputsPanel.style.display = 'block';
            if (syncLabel) syncLabel.innerText = "Supabase Cloud";
        } else {
            localStorage.setItem('conciergeDbMode', 'local');
            if (dbToggleLabel) dbToggleLabel.innerText = "Offline Local Server / Storage Mode";
            if (supabaseInputsPanel) supabaseInputsPanel.style.display = 'none';
            if (syncLabel) syncLabel.innerText = "Local Server";
            supabaseClient = null;
        }
    }

    function initializeSupabase(url, key) {
        try {
            if (window.supabase) {
                supabaseClient = window.supabase.createClient(url, key);
                showLuxuryToast('Supabase Synced', 'Realtime Supabase client initialized and connected.');
                loadStayChronicles();
            } else {
                showLuxuryToast('Library Missing', 'Supabase JS library not loaded. Check CDN script.');
            }
        } catch (err) {
            console.error("Supabase init error:", err);
            showLuxuryToast('Connection Failed', 'Failed to connect to Supabase. Check keys.');
        }
    }

    function loadStayChronicles() {
        const mode = localStorage.getItem('conciergeDbMode') || 'local';

        if (mode === 'supabase' && supabaseClient) {
            supabaseClient
                .from('reservations')
                .select('*')
                .order('timestamp', { ascending: false })
                .then(({ data, error }) => {
                    if (error) {
                        console.warn("Supabase fetch failed, falling back to Local Server:", error);
                        loadFromLocalServer();
                    } else {
                        reservationsList = data.map(item => ({
                            id: item.id,
                            fullName: item.full_name,
                            email: item.email,
                            phone: item.phone,
                            suite: item.suite,
                            checkIn: item.check_in,
                            checkOut: item.check_out,
                            nights: item.nights,
                            guests: item.guests,
                            dietary: item.dietary,
                            addons: Array.isArray(item.addons) ? item.addons : JSON.parse(item.addons || '[]'),
                            specialRequests: item.special_requests,
                            baseLodgingTotal: item.base_total,
                            experiencesTotal: item.experiences_total,
                            taxTotal: item.tax_total,
                            grandTotal: item.grand_total,
                            currency: item.currency,
                            status: item.status || 'Pending'
                        }));
                        renderDashboardTable();
                    }
                });
        } else {
            loadFromLocalServer();
        }
    }

    function loadFromLocalServer() {
        fetch('http://localhost:5000/api/reservations')
            .then(res => {
                if (!res.ok) throw new Error("Server offline");
                return res.json();
            })
            .then(data => {
                reservationsList = data;
                renderDashboardTable();
            })
            .catch(err => {
                console.warn("Express backend offline, falling back to LocalStorage:", err);
                const localData = localStorage.getItem('localReservationsChronicle');
                reservationsList = JSON.parse(localData || '[]');
                renderDashboardTable();
            });
    }

    function renderDashboardTable() {
        if (!tableBody) return;

        // Metric Statistics Calculation
        const totalCount = reservationsList.length;
        let revenueSum = 0;
        let vipCount = 0;

        reservationsList.forEach(r => {
            revenueSum += r.grandTotal || 0;
            if (r.grandTotal > 150000 || r.addons.length >= 3) {
                vipCount++;
            }
        });

        const revenueFormatted = revenueSum.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

        if (document.getElementById('stat-total-bookings')) document.getElementById('stat-total-bookings').innerText = totalCount;
        if (document.getElementById('stat-projected-revenue')) document.getElementById('stat-projected-revenue').innerText = revenueFormatted;
        if (document.getElementById('stat-vip-explorers')) document.getElementById('stat-vip-explorers').innerText = vipCount;

        if (totalCount === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 40px 0;">No active stays recorded inside the outpost chronicle database.</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = '';

        reservationsList.forEach(r => {
            const spec = currencyRates[r.currency] || currencyRates.INR;
            const convertedTotal = Math.round(r.grandTotal * spec.factor);
            const totalText = `${spec.symbol}${convertedTotal.toLocaleString(spec.locale)}`;

            const tr = document.createElement('tr');
            
            const badgeClass = r.status ? r.status.toLowerCase() : 'pending';

            tr.innerHTML = `
                <td style="font-weight: 600; color: var(--accent-gold);">
                    ${r.id}
                    <a href="#" class="no-print print-voucher-link" data-id="${r.id}" style="display: block; font-size: 0.68rem; color: var(--text-secondary); text-decoration: underline; margin-top: 4px;">Print Voucher</a>
                </td>
                <td>
                    <strong>${r.fullName}</strong><br>
                    <span style="font-size:0.75rem; color:var(--text-secondary);">${r.email}<br>${r.phone}</span>
                </td>
                <td><strong>${r.suite}</strong></td>
                <td>
                    <span>In: ${r.checkIn}</span><br>
                    <span>Out: ${r.checkOut}</span><br>
                    <span style="font-size:0.75rem; color:var(--text-secondary);">${r.nights} Nights | ${r.guests} Guests</span>
                </td>
                <td>
                    <strong>${totalText}</strong><br>
                    <span style="font-size:0.75rem; color:var(--text-secondary);">${r.currency}</span>
                </td>
                <td>
                    <span class="badge-status ${badgeClass}">${r.status || 'Pending'}</span>
                </td>
                <td>
                    <div class="dashboard-actions">
                        ${r.status === 'Pending' ? `<button class="luxury-btn filled approve-action-btn" data-id="${r.id}">Approve</button>` : ''}
                        ${r.status === 'Approved' ? `<button class="luxury-btn filled dispatch-action-btn" data-id="${r.id}" style="background-color:#87cefa; border-color:#87cefa; color:#000;">Dispatch</button>` : ''}
                        ${r.status === 'Dispatched' ? `<span style="font-size:0.7rem; color:var(--accent-sage);">Crew Active</span>` : ''}
                    </div>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        // Attach event listeners to Table Actions dynamically
        tableBody.querySelectorAll('.approve-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                updateReservationStatus(btn.getAttribute('data-id'), 'Approved');
            });
        });

        tableBody.querySelectorAll('.dispatch-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                updateReservationStatus(btn.getAttribute('data-id'), 'Dispatched');
            });
        });

        tableBody.querySelectorAll('.print-voucher-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const bookingId = link.getAttribute('data-id');
                const reservationItem = reservationsList.find(item => item.id === bookingId);
                if (reservationItem) {
                    const mode = localStorage.getItem('conciergeDbMode') || 'local';
                    // If backend is active, open live backend voucher, else open client offline fallback
                    fetch('http://localhost:5000/api/reservations')
                        .then(res => {
                            if (!res.ok) throw new Error("Offline");
                            window.open(`http://localhost:5000/api/voucher/${bookingId}`, '_blank');
                        })
                        .catch(() => {
                            // Offline fallback rendering
                            const addonsData = reservationItem.addons.map(a => ({
                                name: a.name,
                                priceFormatted: formatCurrencyVal(a.price, reservationItem.currency)
                            }));
                            const offlineVoucherData = {
                                id: reservationItem.id,
                                fullName: reservationItem.fullName,
                                email: reservationItem.email,
                                phone: reservationItem.phone,
                                suiteName: reservationItem.suite,
                                checkIn: reservationItem.checkIn,
                                checkOut: reservationItem.checkOut,
                                nights: reservationItem.nights,
                                guests: reservationItem.guests,
                                dietary: reservationItem.dietary,
                                specialRequests: reservationItem.specialRequests,
                                addons: addonsData,
                                baseTotalFormatted: formatCurrencyVal(reservationItem.baseLodgingTotal, reservationItem.currency),
                                experienceTotalFormatted: formatCurrencyVal(reservationItem.experiencesTotal, reservationItem.currency),
                                taxTotalFormatted: formatCurrencyVal(reservationItem.taxTotal, reservationItem.currency),
                                grandTotalFormatted: formatCurrencyVal(reservationItem.grandTotal, reservationItem.currency)
                            };
                            const voucherHtml = getOfflineVoucherHtml(offlineVoucherData);
                            const voucherWindow = window.open('', '_blank');
                            if (voucherWindow) {
                                voucherWindow.document.write(voucherHtml);
                                voucherWindow.document.close();
                            }
                        });
                }
            });
        });
    }

    function updateReservationStatus(bookingId, newStatus) {
        const mode = localStorage.getItem('conciergeDbMode') || 'local';
        const record = reservationsList.find(r => r.id === bookingId);

        if (!record) return;

        showLuxuryToast('Chronicle Updated', `Stays record ${bookingId} shifted to: ${newStatus}`);

        if (mode === 'supabase' && supabaseClient) {
            supabaseClient
                .from('reservations')
                .update({ status: newStatus })
                .eq('id', bookingId)
                .then(({ error }) => {
                    if (error) {
                        console.error("Supabase update error:", error);
                        showLuxuryToast('Sync Failed', 'Failed to update status in Supabase. Falling back.');
                        updateLocalServerStatus(bookingId, newStatus);
                    } else {
                        loadStayChronicles();
                    }
                });
        } else {
            updateLocalServerStatus(bookingId, newStatus);
        }
    }

    function updateLocalServerStatus(bookingId, newStatus) {
        // Since local Express endpoint is read-only list for simplify, we will update the array locally in fallback localStorage
        const localData = localStorage.getItem('localReservationsChronicle');
        let dbArray = JSON.parse(localData || '[]');
        const localIdx = dbArray.findIndex(r => r.id === bookingId);
        if (localIdx !== -1) {
            dbArray[localIdx].status = newStatus;
            localStorage.setItem('localReservationsChronicle', JSON.stringify(dbArray));
        }

        // Apply inside active runtime array
        const idx = reservationsList.findIndex(r => r.id === bookingId);
        if (idx !== -1) {
            reservationsList[idx].status = newStatus;
        }
        renderDashboardTable();
    }

    // Capture guest submissions in local localStorage chronicle fallback
    const originalSubmitHandler = reservationForm.onsubmit;
    reservationForm.addEventListener('submit', (e) => {
        // Save guest details to local storage chronicle immediately so local dashboard can see them even if backend Node API is down!
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const suite = suiteSelect.value;
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const guests = parseInt(guestSelect.value) || 2;
        const dietary = document.getElementById('dietary').value || "None specified";
        const specialRequests = document.getElementById('special-requests').value || "None specified";
        const currentCurrency = currencySelect ? currencySelect.value : 'INR';

        const baseTotal = parseInt(summaryBaseTotal.textContent.replace(/[^0-9]/g, '')) || 80000;
        const experiencesTotal = parseInt(summaryExperienceTotal.textContent.replace(/[^0-9]/g, '')) || 0;
        const taxTotal = parseInt(summaryTaxTotal.textContent.replace(/[^0-9]/g, '')) || 0;
        const grandTotal = parseInt(summaryGrandTotal.textContent.replace(/[^0-9]/g, '')) || 0;
        const nights = parseInt(summaryNightsCount.textContent) || 1;

        const activeAddons = [];
        const addonsData = [];
        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                activeAddons.push(cb.value);
                const labelText = cb.parentElement.textContent.trim().split(' (')[0];
                addonsData.push({ id: cb.value, name: labelText, price: parseInt(cb.getAttribute('data-price')) });
            }
        });

        const selectedOption = suiteSelect.options[suiteSelect.selectedIndex];
        const suiteName = selectedOption.text.split(' — ')[0];

        const randomSeq = Math.floor(1000 + Math.random() * 9000);
        const bookingId = `LT-2026-${randomSeq}`;

        const newRecord = {
            id: bookingId,
            fullName,
            email,
            phone,
            suite: suiteName,
            checkIn,
            checkOut,
            nights,
            guests,
            dietary,
            addons: addonsData,
            specialRequests,
            baseLodgingTotal: baseTotal,
            experiencesTotal,
            taxTotal,
            grandTotal,
            currency: currentCurrency,
            status: 'Pending',
            timestamp: new Date().toISOString()
        };

        // Write to LocalStorage list
        const chronicleData = localStorage.getItem('localReservationsChronicle');
        let dbArray = JSON.parse(chronicleData || '[]');
        dbArray.push(newRecord);
        localStorage.setItem('localReservationsChronicle', JSON.stringify(dbArray));

        // Push to Supabase if client is active
        if (localStorage.getItem('conciergeDbMode') === 'supabase' && supabaseClient) {
            supabaseClient
                .from('reservations')
                .insert([{
                    id: bookingId,
                    full_name: fullName,
                    email: email,
                    phone: phone,
                    suite: suiteName,
                    check_in: checkIn,
                    check_out: checkOut,
                    nights: nights,
                    guests: guests,
                    dietary: dietary,
                    addons: activeAddons,
                    special_requests: specialRequests,
                    base_total: baseTotal,
                    experiences_total: experiencesTotal,
                    tax_total: taxTotal,
                    grand_total: grandTotal,
                    currency: currentCurrency,
                    status: 'Pending',
                    timestamp: new Date().toISOString()
                }])
                .then(({ error }) => {
                    if (error) {
                        console.error("Supabase insert error:", error);
                        showLuxuryToast('Sync Warn', 'Supabase write failed, saved to Local Outpost instead.');
                    } else {
                        showLuxuryToast('Cloud Synced', 'Reservation written to Supabase in real-time.');
                        loadStayChronicles();
                    }
                });
        } else {
            // Reload local stay chronicles
            setTimeout(loadStayChronicles, 500);
        }
    });

    // Initial load updates
    updatePricing();
    setTimeout(updateSlider, 200); // give images a brief moment to calculate bounds
});
