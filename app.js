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
    // Safari Tabs Switcher
    // ----------------------------------------
    const safariTabBtns = document.querySelectorAll('.safari-tabs .tab-btn');
    const safariPanes = document.querySelectorAll('.safari-pane');

    safariTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            safariTabBtns.forEach(b => b.classList.remove('active'));
            safariPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`pane-${tabId}`).classList.add('active');
        });
    });

    // ----------------------------------------
    // Live Leopard Sighting Radar Interaction
    // ----------------------------------------
    const footprintMarkers = document.querySelectorAll('.footprint-marker');
    const radarLogCards = document.querySelectorAll('.radar-log-card');

    footprintMarkers.forEach(marker => {
        // Trigger active log card on hover or click
        const activateLog = () => {
            const logId = marker.getAttribute('data-log');
            
            // Remove active status from all logs & markers
            radarLogCards.forEach(card => card.classList.remove('active'));
            
            // Activate the corresponding log card
            const targetCard = document.getElementById(logId);
            if (targetCard) {
                targetCard.classList.add('active');
                
                // Smoothly scroll log card into view inside scroll container if needed
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        };

        marker.addEventListener('mouseenter', activateLog);
        marker.addEventListener('click', activateLog);
    });

    // Mirror interaction: hover log cards to spotlight footprint markers
    radarLogCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            radarLogCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const logId = card.getAttribute('id');
            const targetMarker = document.querySelector(`.footprint-marker[data-log="${logId}"]`);
            
            if (targetMarker) {
                // Apply spotlight scale effect
                footprintMarkers.forEach(m => m.style.transform = 'none');
                targetMarker.style.transform = 'scale(1.4)';
                targetMarker.style.backgroundColor = 'var(--text-primary)';
                targetMarker.style.boxShadow = '0 0 25px rgba(var(--accent-gold-rgb), 1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const logId = card.getAttribute('id');
            const targetMarker = document.querySelector(`.footprint-marker[data-log="${logId}"]`);
            if (targetMarker) {
                targetMarker.style.transform = 'none';
                targetMarker.style.backgroundColor = 'var(--accent-gold)';
                targetMarker.style.boxShadow = 'none';
            }
        });
    });

    // ----------------------------------------
    // Dining Menu Tabs Switcher
    // ----------------------------------------
    const diningTabBtns = document.querySelectorAll('.dining-tabs .tab-btn');
    const diningPanes = document.querySelectorAll('.menu-pane');

    diningTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            diningTabBtns.forEach(b => b.classList.remove('active'));
            diningPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const menuId = btn.getAttribute('data-menu');
            document.getElementById(`menu-${menuId}`).classList.add('active');
        });
    });

    // ----------------------------------------
    // Luxury Suites Slider
    // ----------------------------------------
    const slider = document.getElementById('suites-slider');
    const nextBtn = document.getElementById('carousel-next');
    const prevBtn = document.getElementById('carousel-prev');
    let sliderIndex = 0;
    
    function updateSlider() {
        const cardWidth = 510; // card min-width (480) + gap (30)
        
        // Boundaries for responsiveness
        const visibleWidth = document.querySelector('.suites-carousel').offsetWidth;
        const totalSliderWidth = slider.scrollWidth;
        
        if (totalSliderWidth <= visibleWidth) {
            slider.style.transform = 'translateX(0)';
            return;
        }

        const maxOffset = totalSliderWidth - visibleWidth;
        let offset = sliderIndex * cardWidth;
        
        if (offset > maxOffset) {
            offset = maxOffset;
            sliderIndex = Math.ceil(maxOffset / cardWidth);
        }
        
        slider.style.transform = `translateX(-${offset}px)`;
    }

    nextBtn.addEventListener('click', () => {
        const visibleWidth = document.querySelector('.suites-carousel').offsetWidth;
        const totalSliderWidth = slider.scrollWidth;
        if (sliderIndex * 510 < totalSliderWidth - visibleWidth) {
            sliderIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (sliderIndex > 0) {
            sliderIndex--;
            updateSlider();
        }
    });

    window.addEventListener('resize', updateSlider);

    // ----------------------------------------
    // Dynamic Booking pricing & validation
    // ----------------------------------------
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const suiteSelect = document.getElementById('booking-suite');
    const guestSelect = document.getElementById('guests');
    const addonCheckboxes = document.querySelectorAll('.experience-addon');
    
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

        // Experiences Add-on totals
        let experienceTotal = 0;
        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                experienceTotal += parseInt(cb.getAttribute('data-price')) || 0;
            }
        });

        // 18% Luxury Tax & Service fee
        const taxRate = 0.18;
        const taxTotal = Math.round((baseLodgingTotal + experienceTotal) * taxRate);
        const grandTotal = baseLodgingTotal + experienceTotal + taxTotal;

        // Update UI summary panel
        summarySuiteName.textContent = suiteName;
        summaryNightlyRate.textContent = `₹${calculatedNightly.toLocaleString('en-IN')}`;
        summaryNightsCount.textContent = `${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
        summaryGuestsCount.textContent = `${guestCount} ${guestCount === 1 ? 'Explorer' : 'Explorers'}`;
        summaryBaseTotal.textContent = `₹${baseLodgingTotal.toLocaleString('en-IN')}`;
        summaryExperienceTotal.textContent = `₹${experienceTotal.toLocaleString('en-IN')}`;
        summaryTaxTotal.textContent = `₹${taxTotal.toLocaleString('en-IN')}`;
        summaryGrandTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
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

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get customer name & suite
        const selectedOption = suiteSelect.options[suiteSelect.selectedIndex];
        const suiteName = selectedOption.text.split(' — ')[0];

        modalSuiteName.textContent = suiteName;
        confirmModal.classList.add('active');
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
        alert(`✦ Welcome to the Chronicle expedition, concierge service has registered: ${email}`);
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
    // Cinematic Slow Parallax Scroll Engine
    // ----------------------------------------
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('.hero-video');
    const heroBg = document.querySelector('.hero-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            // Translate elements at different speeds
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
    });

    // ----------------------------------------
    // Scroll-Linked 4x4 Gypsy Jeep Tracker
    // ----------------------------------------
    const safariSection = document.getElementById('safaris');
    const jeepIcon = document.getElementById('safari-jeep-icon');
    const jeepDust = jeepIcon ? jeepIcon.querySelector('.jeep-dust') : null;
    
    window.addEventListener('scroll', () => {
        if (!safariSection || !jeepIcon) return;
        
        const rect = safariSection.getBoundingClientRect();
        const sectionHeight = safariSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        const startScroll = rect.top - viewportHeight;
        const scrollDistance = sectionHeight + viewportHeight;
        
        if (rect.top < viewportHeight && rect.bottom > 0) {
            const scrollPercent = Math.min(Math.max(-startScroll / scrollDistance, 0), 1);
            
            // Track dimensions
            const routeMap = safariSection.querySelector('.safari-route-map');
            if (routeMap) {
                const trackWidth = routeMap.offsetWidth - 110;
                const translateVal = scrollPercent * trackWidth;
                jeepIcon.style.transform = `translateX(${translateVal}px)`;
                if (jeepDust) {
                    jeepDust.style.opacity = '1';
                }
            }
        } else {
            if (jeepDust) {
                jeepDust.style.opacity = '0';
            }
        }
    });

    // ----------------------------------------
    // Mobile Sticky Booking Footer Trigger
    // ----------------------------------------
    const mobileStickyBar = document.getElementById('mobile-sticky-bar');
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && mobileStickyBar) {
            if (window.scrollY > window.innerHeight - 150) {
                mobileStickyBar.classList.add('active');
            } else {
                mobileStickyBar.classList.remove('active');
            }
        } else if (mobileStickyBar) {
            mobileStickyBar.classList.remove('active');
        }
    });

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

    // Initial load updates
    updatePricing();
    setTimeout(updateSlider, 200); // give images a brief moment to calculate bounds
});
