const fs = require('fs');
const path = require('path');

const LAYOUT_FILE = path.join(__dirname, 'layout.html');

// Helper to ensure target directories exist
function ensureDirExists(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirExists(dirname);
    fs.mkdirSync(dirname);
}

// Read layout template
const layout = fs.readFileSync(LAYOUT_FILE, 'utf8');

// Define site pages compile configurations
const pages = [
    // --- HOME ---
    {
        src: 'src/pages/index.html',
        dest: 'index.html',
        title: 'Leopard Trails Jawai | Ultra-Luxury Jawai Leopard Safari Resort',
        description: 'Where raw wilderness meets avant-garde luxury. Breathtaking leopard safaris, opulent plunge pool suites, and bespoke dining in the granite hills of Jawai, Rajasthan.',
        canonical: 'https://leopardtrailsjawai.com/',
        rel_path: '.',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Resort",
          "name": "Leopard Trails Jawai",
          "alternateName": "Leopard Trails Jawai Luxury Wilderness Outpost",
          "description": "Ultra-luxury glamping safari resort in Jawai, Rajasthan, featuring private heated plunge pool suites, expert-guided leopard tracking safaris, and organic bush dining.",
          "url": "https://leopardtrailsjawai.com/",
          "logo": "https://leopardtrailsjawai.com/assets/logo.png",
          "image": "https://leopardtrailsjawai.com/assets/hero.png",
          "telephone": "+919876543210",
          "email": "concierge@leopardtrailsjawai.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jawai Bandh Area, Pali District",
            "addressLocality": "Jawai",
            "addressRegion": "Rajasthan",
            "postalCode": "306126",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "25.1278",
            "longitude": "73.1594"
          },
          "priceRange": "$$$$",
          "starRating": {
            "@type": "Rating",
            "ratingValue": "5"
          },
          "amenityFeature": [
            {
              "@type": "LocationFeatureSpecification",
              "name": "Private Plunge Pool",
              "value": "true"
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Expert-Guided Safari Gypsies",
              "value": "true"
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Starlight Bush Dining",
              "value": "true"
            }
          ]
        }
        </script>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Leopard Trails Jawai",
          "url": "https://leopardtrailsjawai.com/"
        }
        </script>`
    },

    // --- SERVICE PAGES ---
    {
        src: 'src/pages/leopard-safari.html',
        dest: 'leopard-safari.html',
        title: 'Private Jawai Leopard Safari & Tracking | Leopard Trails',
        description: 'Track Jawai\'s famous rock-dwelling leopards in customized open 4x4 safari vehicles with our expert naturalists. 95% sighting success rate.',
        canonical: 'https://leopardtrailsjawai.com/leopard-safari.html',
        rel_path: '.',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Private Jawai Leopard Safari Tracking",
          "serviceType": "Wildlife Safari Tour",
          "provider": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          },
          "description": "Private, customized 4x4 open-jeep leopard safaris in the granite hills of Jawai. Guided by master trackers with a 95% sighting success rate."
        }
        </script>`
    },
    {
        src: 'src/pages/luxury-accommodation.html',
        dest: 'luxury-accommodation.html',
        title: 'Luxury Glamping Suites & Private Plunge Pools | Leopard Trails',
        description: 'Explore our three ultra-private glamping suites featuring heated plunge pools, panoramic glass walls, and vintage copper soaking tubs in Rajasthan.',
        canonical: 'https://leopardtrailsjawai.com/luxury-accommodation.html',
        rel_path: '.',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Luxury Glamping Accommodation",
          "serviceType": "Luxury Lodging",
          "provider": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          },
          "description": "Micro-exclusive luxury accommodation consisting of only three signature suites with private heated infinity pools and 270-degree wilderness views."
        }
        </script>`
    },
    {
        src: 'src/pages/rabari-cultural-walk.html',
        dest: 'rabari-cultural-walk.html',
        title: 'Rabari Tribe Cultural Heritage Walk | Leopard Trails Jawai',
        description: 'Experience a guided walking tour with traditional Rabari herdsmen. Learn about local history, wildlife tracking, and spiritual ecology in Jawai.',
        canonical: 'https://leopardtrailsjawai.com/rabari-cultural-walk.html',
        rel_path: '.',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Rabari Cultural Heritage Walk",
          "serviceType": "Cultural Tour Guide",
          "provider": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          },
          "description": "Authentic walking exchange with local Rabari herdsmen to discover the ancient pastoral customs, local temple histories, and wildlife co-existence."
        }
        </script>`
    },
    {
        src: 'src/pages/wilderness-dining.html',
        dest: 'wilderness-dining.html',
        title: 'Bespoke Starlight Bush Dining & Mewari Cuisine | Leopard Trails',
        description: 'Savor organic farm-to-table dining, open-fire bush barbecues, and crafted botanical cocktails under the clear night skies of Jawai, Rajasthan.',
        canonical: 'https://leopardtrailsjawai.com/wilderness-dining.html',
        rel_path: '.',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Wilderness Gastronomy & Bush Dining",
          "serviceType": "Fine Dining Experience",
          "provider": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          },
          "description": "Curated starlight bush dinners, stone-plank wood barbecues, and traditional Mewari-infused thalis prepared with organic local ingredients."
        }
        </script>`
    },
    {
        src: 'src/pages/granite-ridge-trekking.html',
        dest: 'granite-ridge-trekking.html',
        title: 'Granite Ridge Trekking & Champagne Sunset Sundowners | Leopard Trails',
        description: 'Hike through Jawai\'s ancient billion-year-old granite kopjes and cave temples. Enjoy private champagne sundowners on scenic cliff decks.',
        canonical: 'https://leopardtrailsjawai.com/granite-ridge-trekking.html',
        rel_path: '.',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Granite Ridge Trekking & Sundowners",
          "serviceType": "Guided Hiking Tour",
          "provider": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          },
          "description": "Guided geological and cave temple treks on Jawai\'s granite formations, ending with a private champagne bar and canapé sundowner."
        }
        </script>`
    },
    {
        src: 'src/pages/safari-booking-guide.html',
        dest: 'safari-booking-guide.html',
        title: 'Complete Jawai Safari Booking & Planning Guide 2026',
        description: 'How to book and plan your Jawai safari: timings, safari zones, pricing, clothing guidelines, and photography advice for luxury travelers.',
        canonical: 'https://leopardtrailsjawai.com/safari-booking-guide.html',
        rel_path: '.',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Safari Planning Consultation",
          "serviceType": "Travel Planning Guide",
          "provider": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          },
          "description": "Outpost trip preparation guides covering the best seasons for leopard tracking, clothing checklist, permit bookings, and camera focal lengths."
        }
        </script>`
    },
    {
        src: 'src/pages/eco-resort-conservation.html',
        dest: 'eco-resort-conservation.html',
        title: 'Eco-Luxury Lodging & Wildlife Conservation in Jawai',
        description: 'Learn about our eco-friendly solar-powered resort model, community partnerships, water recycling, and support for local leopard tracking research.',
        canonical: 'https://leopardtrailsjawai.com/eco-resort-conservation.html',
        rel_path: '.',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Eco-Conservation Program",
          "serviceType": "Sustainability Initiatives",
          "provider": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          },
          "description": "Conservation framework outlining solar grid infrastructure, zero waste policy, local employment, and support for leopard and avian habitat studies."
        }
        </script>`
    },

    // --- CASE STUDIES (EXPEDITIONS) ---
    {
        src: 'src/pages/expeditions/leopard-hills-journal.html',
        dest: 'expeditions/leopard-hills-journal.html',
        title: 'Wildlife Case Study: Tracking the Leopardess of Jawai | Leopard Trails',
        description: 'A 3-day wildlife case study detailing tracker research, visual scouting, camera configurations, and the successful encounter with a resident leopardess.',
        canonical: 'https://leopardtrailsjawai.com/expeditions/leopard-hills-journal.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Wildlife Case Study: Tracking the Leopardess of Jawai",
          "description": "Detailed journal of a 3-day expert tracking expedition on Jawai\'s granite rocks, detailing methodology and photography outcomes.",
          "image": "https://leopardtrailsjawai.com/assets/leopard.png",
          "author": {
            "@type": "Organization",
            "name": "Leopard Trails Concierge"
          },
          "publisher": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/expeditions/rabari-cultural-immersion.html',
        dest: 'expeditions/rabari-cultural-immersion.html',
        title: 'Cultural Case Study: Spiritual Co-existence with the Rabari | Leopard Trails',
        description: 'A cultural study documenting a 4-day immersive heritage experience. Walking trails with herdsmen, cave temple history, and community support.',
        canonical: 'https://leopardtrailsjawai.com/expeditions/rabari-cultural-immersion.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Cultural Case Study: Spiritual Co-existence with the Rabari",
          "description": "Documenting a guest heritage journey connecting with local Rabari shepherds to understand the conservation ethics and cave shrines of Pali district.",
          "image": "https://leopardtrailsjawai.com/assets/rabari.png",
          "author": {
            "@type": "Organization",
            "name": "Leopard Trails Concierge"
          },
          "publisher": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/expeditions/canopy-stargazing-honeymoon.html',
        dest: 'expeditions/canopy-stargazing-honeymoon.html',
        title: 'Bespoke Case Study: Stargazing Honeymoon at Obsidian Canopy | Leopard Trails',
        description: 'A hospitality case study highlighting a customized luxury honeymoon: vintage soaking tubs, private ridge dinners, telescope astronomy, and feedback.',
        canonical: 'https://leopardtrailsjawai.com/expeditions/canopy-stargazing-honeymoon.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Bespoke Case Study: Stargazing Honeymoon at Obsidian Canopy",
          "description": "Highlighting a tailored luxury honeymoon package at the Obsidian Canopy Tent, showcasing private astronomy configurations and custom sundowner arrangements.",
          "image": "https://leopardtrailsjawai.com/assets/suite_canopy.png",
          "author": {
            "@type": "Organization",
            "name": "Leopard Trails Concierge"
          },
          "publisher": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai",
            "url": "https://leopardtrailsjawai.com/"
          }
        }
        </script>`
    },

    // --- BLOG HOME ---
    {
        src: 'src/pages/blog/index.html',
        dest: 'blog/index.html',
        title: 'The Expedition Chronicle - Jawai Wildlife & Glamping Blog | Leopard Trails',
        description: 'Read the latest updates, guides, and wildlife tracking chronicles from Leopard Trails Jawai. Your ultimate resource for planning a luxury Rajasthan safari.',
        canonical: 'https://leopardtrailsjawai.com/blog/',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "The Expedition Chronicle",
          "description": "Official blog of Leopard Trails Jawai, focusing on wildlife tracking guides, culture, travel tips, and luxury safari news.",
          "publisher": {
            "@type": "Resort",
            "name": "Leopard Trails Jawai"
          }
        }
        </script>`
    },

    // --- BLOG ARTICLES ---
    {
        src: 'src/pages/blog/complete-guide-jawai-leopard-safari.html',
        dest: 'blog/complete-guide-jawai-leopard-safari.html',
        title: 'Complete Guide to Jawai Leopard Safari 2026: Booking & Timings',
        description: 'The ultimate guide to booking a leopard safari in Jawai, Rajasthan. Learn about sighting seasons, gypsy zones, booking guides, and safari hours.',
        canonical: 'https://leopardtrailsjawai.com/blog/complete-guide-jawai-leopard-safari.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "Complete Guide to Jawai Leopard Safari 2026: Booking & Timings",
          "description": "Comprehensive planning and permit booking resource for high-end travelers visiting the leopard hills of Rajasthan.",
          "datePublished": "2026-05-10T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Jatinder Singh",
            "jobTitle": "Lead Naturalist"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/why-leopards-coexist-with-rabari-tribe.html',
        dest: 'blog/why-leopards-coexist-with-rabari-tribe.html',
        title: 'Why Jawai\'s Leopards Live Harmoniously with the Rabari Tribe',
        description: 'Discover the fascinating story of spiritual symbiosis, pastoral traditions, and conservation ethics protecting Jawai\'s big cats.',
        canonical: 'https://leopardtrailsjawai.com/blog/why-leopards-coexist-with-rabari-tribe.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "Why Jawai's Leopards Live Harmoniously with the Rabari Tribe",
          "description": "Exploring the historical, cultural, and spiritual ties that lead to zero man-animal conflict in Pali district.",
          "datePublished": "2026-05-15T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Dr. Ramesh Chandra",
            "jobTitle": "Wildlife Conservationist"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/luxury-glamping-rajasthan-comparison.html',
        dest: 'blog/luxury-glamping-rajasthan-comparison.html',
        title: 'Top Luxury Glamping Resorts in Rajasthan: A Comparative Guide',
        description: 'Comparing high-end wilderness camps in Rajasthan: Leopard Trails Jawai vs Ranthambore vs Jaisalmer desert tents.',
        canonical: 'https://leopardtrailsjawai.com/blog/luxury-glamping-rajasthan-comparison.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "Top Luxury Glamping Resorts in Rajasthan: A Comparative Guide",
          "description": "Analysis of privacy levels, safari style, and luxury amenities across key Rajasthani wildlife outposts.",
          "datePublished": "2026-05-20T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Devika Sen",
            "jobTitle": "Luxury Travel Writer"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/how-to-reach-jawai-travel-guide.html',
        dest: 'blog/how-to-reach-jawai-travel-guide.html',
        title: 'How to Reach Jawai: Flight, Train, and Road Directions',
        description: 'Complete transportation guide to Jawai Bandh, Pali. Route options from Udaipur, Jodhpur, Jaipur, Delhi, and Mumbai.',
        canonical: 'https://leopardtrailsjawai.com/blog/how-to-reach-jawai-travel-guide.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "How to Reach Jawai: Flight, Train, and Road Directions",
          "description": "Travel logistics guide detailing nearby airports, luxury train berths, and highway routes for visiting Jawai.",
          "datePublished": "2026-05-24T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Vikram Rathore",
            "jobTitle": "Logistics Coordinator"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/what-to-pack-rajasthan-wildlife-safari.html',
        dest: 'blog/what-to-pack-rajasthan-wildlife-safari.html',
        title: 'What to Pack for a Rajasthan Wildlife Safari: Essential Outfit & Gear',
        description: 'A comprehensive checklist for safari travelers: clothing colors, sun protection, high-end lenses, binoculars, and field equipment.',
        canonical: 'https://leopardtrailsjawai.com/blog/what-to-pack-rajasthan-wildlife-safari.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "What to Pack for a Rajasthan Wildlife Safari: Essential Outfit & Gear",
          "description": "Packing manual focusing on weather-appropriate neutral linens, focal-length advice, and field gear.",
          "datePublished": "2026-05-28T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Aiswarya Roy",
            "jobTitle": "Travel Stylist"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/culinary-heritage-rajasthan-safari-dining.html',
        dest: 'blog/culinary-heritage-rajasthan-safari-dining.html',
        title: 'Mewari Spices and Wilderness Gastronomy: Farm-to-Table Safari Dining',
        description: 'Exploring the rich culinary heritage of Rajasthan. How we blend royal Mewari recipes with contemporary dining at our bush camp.',
        canonical: 'https://leopardtrailsjawai.com/blog/culinary-heritage-rajasthan-safari-dining.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "Mewari Spices and Wilderness Gastronomy: Farm-to-Table Safari Dining",
          "description": "A deep dive into regional culinary secrets, open-fire cooking, and local organic sourcing at our luxury outpost.",
          "datePublished": "2026-06-01T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Chef Ranveer Singh",
            "jobTitle": "Head Chef"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/wildlife-photography-tips-jawai-leopards.html',
        dest: 'blog/wildlife-photography-tips-jawai-leopards.html',
        title: 'Wildlife Photography Guide: Capturing Leopards on Jawai\'s Rocks',
        description: 'Learn the best camera setups, telephoto focal lengths, exposure tracking, and lighting advice for leopard photography in Rajasthan.',
        canonical: 'https://leopardtrailsjawai.com/blog/wildlife-photography-tips-jawai-leopards.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "Wildlife Photography Guide: Capturing Leopards on Jawai's Rocks",
          "description": "Technical photography guides for capturing predators against granite surfaces, covering ISO speeds and shutter settings.",
          "datePublished": "2026-06-04T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Amit Vardhan",
            "jobTitle": "Wildlife Photographer"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/comparing-ranthambore-vs-jawai-safari.html',
        dest: 'blog/comparing-ranthambore-vs-jawai-safari.html',
        title: 'Tiger Safaris vs Leopard Tracking: Ranthambore vs Jawai Compared',
        description: 'Helpful analysis for luxury wildlife enthusiasts: safari zone structures, sighting frequencies, jeep privacy, and crowds compared.',
        canonical: 'https://leopardtrailsjawai.com/blog/comparing-ranthambore-vs-jawai-safari.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "Tiger Safaris vs Leopard Tracking: Ranthambore vs Jawai Compared",
          "description": "Detailed wildlife comparison regarding private reserve style vs government park rules for international tourists.",
          "datePublished": "2026-06-08T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Jatinder Singh",
            "jobTitle": "Lead Naturalist"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/geological-marvels-jawai-granite-hills.html',
        dest: 'blog/geological-marvels-jawai-granite-hills.html',
        title: 'The Geological Story of Jawai: Billion-Year-Old Granite kopjes',
        description: 'Read the geological history of the Aravali range and Jawai\'s volcanic granite outcrops which create the perfect cave habitats for leopards.',
        canonical: 'https://leopardtrailsjawai.com/blog/geological-marvels-jawai-granite-hills.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "The Geological Story of Jawai: Billion-Year-Old Granite kopjes",
          "description": "Unveiling the tectonic history and natural cave formations that provide natural dens for leopards and local cave shrines.",
          "datePublished": "2026-06-12T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Prof. Harish Vyas",
            "jobTitle": "Geologist"
          }
        }
        </script>`
    },
    {
        src: 'src/pages/blog/eco-tourism-conservation-efforts-jawai.html',
        dest: 'blog/eco-tourism-conservation-efforts-jawai.html',
        title: 'How Eco-Tourism and Luxury Travel Protects Jawai\'s Leopards',
        description: 'How luxury wilderness hospitality funds local field trackers, rabies vaccine drives, and cattle compensation schemes in Rajasthan.',
        canonical: 'https://leopardtrailsjawai.com/blog/eco-tourism-conservation-efforts-jawai.html',
        rel_path: '..',
        schema: `<script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "How Eco-Tourism and Luxury Travel Protects Jawai's Leopards",
          "description": "A close look at conservation funding models, local employment ratios, and human-wildlife co-existence support frameworks.",
          "datePublished": "2026-06-15T08:00:00Z",
          "author": {
            "@type": "Person",
            "name": "Dr. Ramesh Chandra",
            "jobTitle": "Wildlife Conservationist"
          }
        }
        </script>`
    }
];

// Perform Compilation
console.log('✦ Initiating Leopard Trails Jawai HTML Compiler...');

let compiledCount = 0;

pages.forEach(page => {
    const srcPath = path.join(__dirname, page.src);
    const destPath = path.join(__dirname, page.dest);

    if (!fs.existsSync(srcPath)) {
        console.warn(`⚠️ Source file missing: ${page.src}`);
        return;
    }

    const content = fs.readFileSync(srcPath, 'utf8');

    // Perform token replacements
    let compiled = layout
        .replace(/\{\{title\}\}/g, page.title)
        .replace(/\{\{description\}\}/g, page.description)
        .replace(/\{\{canonical\}\}/g, page.canonical)
        .replace(/\{\{schema\}\}/g, page.schema || '')
        .replace(/\{\{rel_path\}\}/g, page.rel_path)
        .replace(/\{\{content\}\}/g, content);

    // Ensure output subfolders exist
    ensureDirExists(destPath);

    fs.writeFileSync(destPath, compiled, 'utf8');
    console.log(`  [✓] Compiled: ${page.src} -> ${page.dest}`);
    compiledCount++;
});

console.log(`✦ Compilation Completed. Total files processed: ${compiledCount}\n`);
