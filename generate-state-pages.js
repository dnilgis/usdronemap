#!/usr/bin/env node
/**
 * US Drone Map - Programmatic SEO Page Generator
 * 
 * Generates static HTML pages for:
 * - 50 state landing pages (e.g., wisconsin.html)
 * - State + Service combo pages (e.g., wisconsin-deer-recovery.html)
 * - sitemap.xml with all pages
 * 
 * Run: node generate-state-pages.js
 * Output: ./states/ directory with all HTML files + sitemap.xml
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    baseUrl: 'https://usdronemap.com',
    outputDir: './states',
    gaId: 'G-WX7S46H7W1',
    contactEmail: 'contact@usdronemap.com',
    lastMod: new Date().toISOString().split('T')[0] // YYYY-MM-DD
};

// All 50 US States with SEO data
const STATES = [
    { abbr: 'AL', name: 'Alabama', capital: 'Montgomery', region: 'Southeast' },
    { abbr: 'AK', name: 'Alaska', capital: 'Juneau', region: 'Pacific' },
    { abbr: 'AZ', name: 'Arizona', capital: 'Phoenix', region: 'Southwest' },
    { abbr: 'AR', name: 'Arkansas', capital: 'Little Rock', region: 'South' },
    { abbr: 'CA', name: 'California', capital: 'Sacramento', region: 'Pacific' },
    { abbr: 'CO', name: 'Colorado', capital: 'Denver', region: 'Mountain' },
    { abbr: 'CT', name: 'Connecticut', capital: 'Hartford', region: 'Northeast' },
    { abbr: 'DE', name: 'Delaware', capital: 'Dover', region: 'Mid-Atlantic' },
    { abbr: 'FL', name: 'Florida', capital: 'Tallahassee', region: 'Southeast' },
    { abbr: 'GA', name: 'Georgia', capital: 'Atlanta', region: 'Southeast' },
    { abbr: 'HI', name: 'Hawaii', capital: 'Honolulu', region: 'Pacific' },
    { abbr: 'ID', name: 'Idaho', capital: 'Boise', region: 'Pacific Northwest' },
    { abbr: 'IL', name: 'Illinois', capital: 'Springfield', region: 'Midwest' },
    { abbr: 'IN', name: 'Indiana', capital: 'Indianapolis', region: 'Midwest' },
    { abbr: 'IA', name: 'Iowa', capital: 'Des Moines', region: 'Midwest' },
    { abbr: 'KS', name: 'Kansas', capital: 'Topeka', region: 'Midwest' },
    { abbr: 'KY', name: 'Kentucky', capital: 'Frankfort', region: 'South' },
    { abbr: 'LA', name: 'Louisiana', capital: 'Baton Rouge', region: 'South' },
    { abbr: 'ME', name: 'Maine', capital: 'Augusta', region: 'Northeast' },
    { abbr: 'MD', name: 'Maryland', capital: 'Annapolis', region: 'Mid-Atlantic' },
    { abbr: 'MA', name: 'Massachusetts', capital: 'Boston', region: 'Northeast' },
    { abbr: 'MI', name: 'Michigan', capital: 'Lansing', region: 'Midwest' },
    { abbr: 'MN', name: 'Minnesota', capital: 'Saint Paul', region: 'Midwest' },
    { abbr: 'MS', name: 'Mississippi', capital: 'Jackson', region: 'South' },
    { abbr: 'MO', name: 'Missouri', capital: 'Jefferson City', region: 'Midwest' },
    { abbr: 'MT', name: 'Montana', capital: 'Helena', region: 'Mountain' },
    { abbr: 'NE', name: 'Nebraska', capital: 'Lincoln', region: 'Midwest' },
    { abbr: 'NV', name: 'Nevada', capital: 'Carson City', region: 'Mountain' },
    { abbr: 'NH', name: 'New Hampshire', capital: 'Concord', region: 'Northeast' },
    { abbr: 'NJ', name: 'New Jersey', capital: 'Trenton', region: 'Mid-Atlantic' },
    { abbr: 'NM', name: 'New Mexico', capital: 'Santa Fe', region: 'Southwest' },
    { abbr: 'NY', name: 'New York', capital: 'Albany', region: 'Mid-Atlantic' },
    { abbr: 'NC', name: 'North Carolina', capital: 'Raleigh', region: 'Southeast' },
    { abbr: 'ND', name: 'North Dakota', capital: 'Bismarck', region: 'Midwest' },
    { abbr: 'OH', name: 'Ohio', capital: 'Columbus', region: 'Midwest' },
    { abbr: 'OK', name: 'Oklahoma', capital: 'Oklahoma City', region: 'South' },
    { abbr: 'OR', name: 'Oregon', capital: 'Salem', region: 'Pacific Northwest' },
    { abbr: 'PA', name: 'Pennsylvania', capital: 'Harrisburg', region: 'Mid-Atlantic' },
    { abbr: 'RI', name: 'Rhode Island', capital: 'Providence', region: 'Northeast' },
    { abbr: 'SC', name: 'South Carolina', capital: 'Columbia', region: 'Southeast' },
    { abbr: 'SD', name: 'South Dakota', capital: 'Pierre', region: 'Midwest' },
    { abbr: 'TN', name: 'Tennessee', capital: 'Nashville', region: 'South' },
    { abbr: 'TX', name: 'Texas', capital: 'Austin', region: 'South' },
    { abbr: 'UT', name: 'Utah', capital: 'Salt Lake City', region: 'Mountain' },
    { abbr: 'VT', name: 'Vermont', capital: 'Montpelier', region: 'Northeast' },
    { abbr: 'VA', name: 'Virginia', capital: 'Richmond', region: 'Mid-Atlantic' },
    { abbr: 'WA', name: 'Washington', capital: 'Olympia', region: 'Pacific Northwest' },
    { abbr: 'WV', name: 'West Virginia', capital: 'Charleston', region: 'Mid-Atlantic' },
    { abbr: 'WI', name: 'Wisconsin', capital: 'Madison', region: 'Midwest' },
    { abbr: 'WY', name: 'Wyoming', capital: 'Cheyenne', region: 'Mountain' }
];

// Services with SEO-optimized descriptions
const SERVICES = [
    {
        slug: 'agriculture',
        name: 'Agricultural Drone Services',
        shortName: 'Ag Spraying',
        keywords: ['crop spraying', 'precision agriculture', 'farm drone', 'aerial application'],
        description: 'Professional drone crop spraying, seeding, and precision agriculture services',
        icon: '🌾',
        color: '#166534'
    },
    {
        slug: 'deer-recovery',
        name: 'Deer Recovery Services',
        shortName: 'Deer Recovery',
        keywords: ['thermal drone', 'deer tracking', 'wounded deer', 'game recovery'],
        description: 'Thermal drone deer recovery to locate wounded deer quickly',
        icon: '🦌',
        color: '#78350f'
    },
    {
        slug: 'game-recovery',
        name: 'Game Recovery Services',
        shortName: 'Game Recovery',
        keywords: ['big game', 'elk recovery', 'bear recovery', 'thermal imaging'],
        description: 'Thermal drone services for all big game recovery including elk, bear, and hog',
        icon: '🎯',
        color: '#1e3a2f'
    },
    {
        slug: 'inspection',
        name: 'Drone Inspection Services',
        shortName: 'Inspections',
        keywords: ['roof inspection', 'tower inspection', 'infrastructure', 'solar panel'],
        description: 'Professional drone inspections for roofs, towers, bridges, and infrastructure',
        icon: '🔍',
        color: '#1e40af'
    },
    {
        slug: 'survey',
        name: 'Drone Survey & Mapping',
        shortName: 'Survey/Mapping',
        keywords: ['aerial survey', 'photogrammetry', 'topographic', 'land survey'],
        description: 'Precision drone surveying, mapping, and photogrammetry services',
        icon: '📐',
        color: '#7c3aed'
    },
    {
        slug: 'photography',
        name: 'Aerial Photography & Video',
        shortName: 'Photo/Video',
        keywords: ['real estate drone', 'wedding drone', 'event photography', 'aerial video'],
        description: 'Professional aerial photography and videography for real estate, events, and more',
        icon: '📷',
        color: '#dc2626'
    }
];

// ============================================
// TEMPLATE GENERATORS
// ============================================

function generateStatePageHTML(state) {
    const slug = state.name.toLowerCase().replace(/\s+/g, '-');
    const title = `${state.name} Drone Pilots | Find Drone Services in ${state.abbr}`;
    const description = `Find licensed drone pilots in ${state.name}. Browse ${state.region} drone services for agriculture, inspections, photography, deer recovery & more. FAA Part 107 certified.`;
    const h1 = `Drone Pilots in ${state.name}`;
    const canonicalUrl = `${CONFIG.baseUrl}/states/${slug}.html`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','${CONFIG.gaId}');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${state.name} drone pilot, ${state.name} drone services, drone ${state.abbr}, aerial services ${state.name}, FAA Part 107 ${state.name}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${CONFIG.baseUrl}/og-state-${slug}.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="geo.region" content="US-${state.abbr}">
    <meta name="geo.placename" content="${state.name}">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23f97316'/></svg>">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "${title}",
        "description": "${description}",
        "url": "${canonicalUrl}",
        "isPartOf": {
            "@type": "WebSite",
            "name": "US Drone Map",
            "url": "${CONFIG.baseUrl}"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "${CONFIG.baseUrl}"},
                {"@type": "ListItem", "position": 2, "name": "States", "item": "${CONFIG.baseUrl}/states/"},
                {"@type": "ListItem", "position": 3, "name": "${state.name}", "item": "${canonicalUrl}"}
            ]
        },
        "about": {
            "@type": "Service",
            "serviceType": "Drone Services",
            "areaServed": {
                "@type": "State",
                "name": "${state.name}",
                "containedInPlace": {"@type": "Country", "name": "United States"}
            }
        }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Drone Services in ${state.name}",
        "description": "Available drone services in ${state.name}",
        "itemListElement": [
            ${SERVICES.map((s, i) => `{"@type": "ListItem", "position": ${i + 1}, "name": "${s.name}", "url": "${CONFIG.baseUrl}/states/${slug}-${s.slug}.html"}`).join(',\n            ')}
        ]
    }
    </script>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',-apple-system,sans-serif;background:#f5f5f5;color:#1a1a1a;line-height:1.6}
        .skip-link{position:absolute;top:-40px;left:0;background:#f97316;color:#fff;padding:8px 16px;z-index:10001;text-decoration:none}.skip-link:focus{top:0}
        header{background:#fff;border-bottom:1px solid #e5e5e5;padding:14px 24px;position:sticky;top:0;z-index:1000}.header-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
        .logo{font-size:1.5rem;font-weight:800;color:#1a1a1a;text-decoration:none}.logo span{color:#f97316}
        nav{display:flex;gap:8px}nav a{color:#666;text-decoration:none;font-weight:500;font-size:.9rem;padding:8px 16px;border-radius:6px}nav a:hover{color:#1a1a1a;background:#f5f5f5}.nav-cta{background:#f97316!important;color:#fff!important}
        .nav-toggle{display:none;background:none;border:none;padding:8px;cursor:pointer}.nav-toggle svg{width:24px;height:24px}
        .nav-mobile{display:none;position:fixed;top:60px;left:0;right:0;bottom:0;background:#fff;padding:16px;z-index:999;flex-direction:column;gap:8px}.nav-mobile.open{display:flex}.nav-mobile a{display:block;padding:14px 16px;color:#1a1a1a;text-decoration:none;font-weight:500;border-radius:8px}
        .hero{background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);color:#fff;padding:80px 24px;text-align:center;position:relative}
        .hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");opacity:.5}
        .hero-inner{max-width:900px;margin:0 auto;position:relative;z-index:1}
        .hero-badge{display:inline-block;background:rgba(255,255,255,.15);padding:8px 16px;border-radius:50px;font-size:.9rem;font-weight:600;margin-bottom:24px;border:1px solid rgba(255,255,255,.2)}
        h1{font-size:3rem;font-weight:800;margin-bottom:20px;line-height:1.1}.hero p{font-size:1.25rem;opacity:.85;margin-bottom:32px;max-width:650px;margin-left:auto;margin-right:auto}
        .hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:8px;font-weight:600;text-decoration:none;transition:all .2s;min-height:44px}
        .btn-primary{background:#f97316;color:#fff;box-shadow:0 4px 14px rgba(249,115,22,.4)}.btn-primary:hover{background:#ea580c;transform:translateY(-2px)}
        .btn-secondary{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.3)}.btn-secondary:hover{background:rgba(255,255,255,.15)}
        .breadcrumb{max-width:1200px;margin:0 auto;padding:16px 24px;font-size:.85rem;color:#666}.breadcrumb a{color:#666;text-decoration:none}.breadcrumb a:hover{color:#f97316}.breadcrumb span{margin:0 8px}
        section{padding:60px 24px}.section-inner{max-width:1200px;margin:0 auto}
        h2{font-size:2rem;font-weight:800;margin-bottom:16px;text-align:center}
        .section-subtitle{text-align:center;color:#666;font-size:1.1rem;margin-bottom:40px;max-width:600px;margin-left:auto;margin-right:auto}
        .services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:40px}
        .service-card{background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:24px;text-decoration:none;color:inherit;transition:all .2s}.service-card:hover{border-color:#f97316;box-shadow:0 4px 12px rgba(249,115,22,.1);transform:translateY(-2px)}
        .service-icon{width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:16px}
        .service-card h3{font-size:1.1rem;font-weight:700;margin-bottom:8px}.service-card p{color:#666;font-size:.9rem;line-height:1.6}
        .cta-section{background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px;padding:60px 40px;text-align:center;color:#fff;margin:40px auto;max-width:1000px}
        .cta-section h2{color:#fff;margin-bottom:16px}.cta-section p{opacity:.9;margin-bottom:24px;max-width:500px;margin-left:auto;margin-right:auto}
        .cta-section .btn-primary{background:#fff;color:#f97316}.cta-section .btn-primary:hover{background:#fafafa}
        .stats-section{background:#fff;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center}
        .stat-item .stat-num{font-size:2.5rem;font-weight:800;color:#f97316}.stat-item .stat-label{color:#666;font-size:.9rem;margin-top:4px}
        .nearby-states{margin-top:40px;padding-top:40px;border-top:1px solid #e5e5e5}
        .nearby-states h3{font-size:1.25rem;font-weight:700;margin-bottom:16px;text-align:center}
        .states-list{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
        .states-list a{padding:8px 16px;background:#f5f5f5;border-radius:6px;text-decoration:none;color:#666;font-size:.9rem;transition:all .2s}.states-list a:hover{background:#fff7ed;color:#f97316}
        .faa-disclaimer{font-size:.75rem;color:#999;text-align:center;padding:16px;background:#fafafa;border-top:1px solid #e5e5e5}
        footer{background:#fff;border-top:1px solid #e5e5e5;padding:20px 24px}.footer-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;font-size:.85rem;color:#666}footer a{color:#666;text-decoration:none}footer a:hover{color:#f97316}.footer-links{display:flex;gap:20px}
        .cookie-consent{position:fixed;bottom:0;left:0;right:0;background:#1a1a1a;color:#fff;padding:16px 24px;z-index:9999;display:none}.cookie-consent.show{display:block}.cookie-consent-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.cookie-consent p{flex:1;font-size:.9rem}.cookie-consent a{color:#f97316}.cookie-consent-buttons{display:flex;gap:12px}.cookie-consent .ccbtn{padding:10px 20px;border-radius:6px;font-weight:600;cursor:pointer;border:none}.cookie-consent .btn-accept{background:#f97316;color:#fff}.cookie-consent .btn-decline{background:transparent;color:#fff;border:1px solid #666}
        @media(max-width:768px){header{padding:12px 16px}.logo{font-size:1.25rem}nav a:not(.nav-cta){display:none}.nav-toggle{display:block}h1{font-size:2rem}.hero{padding:48px 20px}.hero p{font-size:1rem}.services-grid{grid-template-columns:1fr}.stats-grid{grid-template-columns:repeat(2,1fr)}.footer-inner{flex-direction:column;gap:12px;text-align:center}.footer-links{flex-wrap:wrap;justify-content:center}}
    </style>
</head>
<body>
    <a href="#main" class="skip-link">Skip to main content</a>
    <header><div class="header-inner"><a href="../index.html" class="logo">US<span>Drone</span>Map</a><nav><a href="../index.html">Map</a><a href="../directory.html">Directory</a><a href="../ag-spraying.html">Ag Spraying</a><a href="../deer-recovery.html">Deer Recovery</a><a href="../verify.html" class="nav-cta">Get Verified</a></nav><button class="nav-toggle" id="navToggle" aria-label="Menu"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button></div></header>
    <nav class="nav-mobile" id="navMobile"><a href="../index.html">Map</a><a href="../directory.html">Directory</a><a href="../ag-spraying.html">Ag Spraying</a><a href="../deer-recovery.html">Deer Recovery</a><a href="../verify.html" class="nav-cta">Get Verified</a></nav>
    
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a><span>›</span>
        <a href="index.html">States</a><span>›</span>
        <strong>${state.name}</strong>
    </nav>
    
    <main id="main">
        <section class="hero">
            <div class="hero-inner">
                <div class="hero-badge">📍 ${state.region} Region</div>
                <h1>${h1}</h1>
                <p>Find FAA-certified drone pilots across ${state.name} for agriculture, inspections, photography, deer recovery, and more. All pilots are Part 107 licensed and insured.</p>
                <div class="hero-buttons">
                    <a href="../directory.html?state=${state.abbr}" class="btn btn-primary">Browse ${state.name} Pilots</a>
                    <a href="../index.html?state=${state.abbr}" class="btn btn-secondary">View on Map</a>
                </div>
            </div>
        </section>
        
        <section class="stats-section">
            <div class="section-inner">
                <div class="stats-grid">
                    <div class="stat-item"><div class="stat-num" id="pilotCount">--</div><div class="stat-label">Pilots in ${state.abbr}</div></div>
                    <div class="stat-item"><div class="stat-num" id="verifiedCount">--</div><div class="stat-label">Verified</div></div>
                    <div class="stat-item"><div class="stat-num">${SERVICES.length}</div><div class="stat-label">Services</div></div>
                    <div class="stat-item"><div class="stat-num">100%</div><div class="stat-label">Part 107</div></div>
                </div>
            </div>
        </section>
        
        <section>
            <div class="section-inner">
                <h2>Drone Services in ${state.name}</h2>
                <p class="section-subtitle">Professional drone services available from certified pilots across ${state.name}</p>
                <div class="services-grid">
                    ${SERVICES.map(s => `
                    <a href="${slug}-${s.slug}.html" class="service-card">
                        <div class="service-icon" style="background:${s.color}15;color:${s.color}">${s.icon}</div>
                        <h3>${s.name}</h3>
                        <p>${s.description} in ${state.name}. Find local pilots near you.</p>
                    </a>`).join('')}
                </div>
            </div>
        </section>
        
        <section>
            <div class="section-inner">
                <div class="cta-section">
                    <h2>Are You a ${state.name} Drone Pilot?</h2>
                    <p>Get verified and reach more customers searching for drone services in ${state.name}.</p>
                    <a href="../verify.html" class="btn btn-primary">Get Verified - $149/year</a>
                </div>
                
                <div class="nearby-states">
                    <h3>Browse Other States</h3>
                    <div class="states-list">
                        ${STATES.filter(s => s.abbr !== state.abbr).slice(0, 10).map(s => 
                            `<a href="${s.name.toLowerCase().replace(/\s+/g, '-')}.html">${s.name}</a>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <div class="faa-disclaimer">All drone operations must comply with FAA regulations. Verify pilot credentials and Part 107 certification independently.</div>
    <footer><div class="footer-inner"><div>© 2026 US Drone Map. All rights reserved.</div><div class="footer-links"><a href="../privacy.html">Privacy</a><a href="../terms.html">Terms</a><a href="../cookie-policy.html">Cookies</a><a href="mailto:${CONFIG.contactEmail}">Contact</a></div></div></footer>
    <div class="cookie-consent" id="cookieConsent"><div class="cookie-consent-inner"><p>We use cookies to improve your experience. <a href="../cookie-policy.html">Learn more</a></p><div class="cookie-consent-buttons"><button class="ccbtn btn-decline" id="cookieDecline">Decline</button><button class="ccbtn btn-accept" id="cookieAccept">Accept</button></div></div></div>
    <script>
        const ST='${state.abbr}';
        const CC={hasConsent(){const c=localStorage.getItem('usdm_cookie_consent');if(!c)return null;try{const d=JSON.parse(c);return d.version==='1'?d.accepted:null}catch{return null}},setConsent(a){localStorage.setItem('usdm_cookie_consent',JSON.stringify({accepted:a,version:'1',timestamp:new Date().toISOString()}));if(a&&typeof gtag==='function')gtag('consent','update',{'analytics_storage':'granted'});this.hide()},show(){document.getElementById('cookieConsent').classList.add('show')},hide(){document.getElementById('cookieConsent').classList.remove('show')},init(){if(this.hasConsent()===null)this.show();else if(this.hasConsent()&&typeof gtag==='function')gtag('consent','update',{'analytics_storage':'granted'})}};
        const MN={isOpen:false,init(){const t=document.getElementById('navToggle'),m=document.getElementById('navMobile');if(t&&m)t.addEventListener('click',()=>{this.isOpen=!this.isOpen;m.classList.toggle('open',this.isOpen);document.body.style.overflow=this.isOpen?'hidden':''})}};
        async function loadStats(){try{const r=await fetch('../pilots.json?v=20260112');const d=await r.json();const pilots=(Array.isArray(d)?d:(d.pilots||[]));const stPilots=pilots.filter(p=>p.st===ST);document.getElementById('pilotCount').textContent=stPilots.length;document.getElementById('verifiedCount').textContent=stPilots.filter(p=>p.v).length}catch(e){console.log('Stats error:',e)}}
        document.addEventListener('DOMContentLoaded',()=>{CC.init();MN.init();loadStats();document.getElementById('cookieAccept').addEventListener('click',()=>CC.setConsent(true));document.getElementById('cookieDecline').addEventListener('click',()=>CC.setConsent(false))});
    </script>
</body>
</html>`;
}

function generateServicePageHTML(state, service) {
    const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
    const slug = `${stateSlug}-${service.slug}`;
    const title = `${service.name} in ${state.name} | ${state.abbr} Drone Pilots`;
    const description = `Find ${service.shortName.toLowerCase()} drone services in ${state.name}. ${service.description}. Licensed Part 107 pilots available now.`;
    const h1 = `${service.name} in ${state.name}`;
    const canonicalUrl = `${CONFIG.baseUrl}/states/${slug}.html`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','${CONFIG.gaId}');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${service.keywords.map(k => `${k} ${state.name}`).join(', ')}, drone ${state.abbr}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="geo.region" content="US-${state.abbr}">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23f97316'/></svg>">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "${service.name}",
        "description": "${description}",
        "serviceType": "${service.shortName}",
        "areaServed": {
            "@type": "State",
            "name": "${state.name}",
            "containedInPlace": {"@type": "Country", "name": "United States"}
        },
        "provider": {
            "@type": "Organization",
            "name": "US Drone Map",
            "url": "${CONFIG.baseUrl}"
        }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "${CONFIG.baseUrl}"},
            {"@type": "ListItem", "position": 2, "name": "States", "item": "${CONFIG.baseUrl}/states/"},
            {"@type": "ListItem", "position": 3, "name": "${state.name}", "item": "${CONFIG.baseUrl}/states/${stateSlug}.html"},
            {"@type": "ListItem", "position": 4, "name": "${service.shortName}", "item": "${canonicalUrl}"}
        ]
    }
    </script>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',-apple-system,sans-serif;background:#f5f5f5;color:#1a1a1a;line-height:1.6}
        .skip-link{position:absolute;top:-40px;left:0;background:#f97316;color:#fff;padding:8px 16px;z-index:10001;text-decoration:none}.skip-link:focus{top:0}
        header{background:#fff;border-bottom:1px solid #e5e5e5;padding:14px 24px;position:sticky;top:0;z-index:1000}.header-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
        .logo{font-size:1.5rem;font-weight:800;color:#1a1a1a;text-decoration:none}.logo span{color:#f97316}
        nav{display:flex;gap:8px}nav a{color:#666;text-decoration:none;font-weight:500;font-size:.9rem;padding:8px 16px;border-radius:6px}nav a:hover{color:#1a1a1a;background:#f5f5f5}.nav-cta{background:#f97316!important;color:#fff!important}
        .nav-toggle{display:none;background:none;border:none;padding:8px;cursor:pointer}.nav-toggle svg{width:24px;height:24px}
        .nav-mobile{display:none;position:fixed;top:60px;left:0;right:0;bottom:0;background:#fff;padding:16px;z-index:999;flex-direction:column;gap:8px}.nav-mobile.open{display:flex}.nav-mobile a{display:block;padding:14px 16px;color:#1a1a1a;text-decoration:none;font-weight:500;border-radius:8px}
        .hero{background:linear-gradient(135deg,${service.color} 0%,${service.color}dd 100%);color:#fff;padding:80px 24px;text-align:center;position:relative}
        .hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");opacity:.5}
        .hero-inner{max-width:900px;margin:0 auto;position:relative;z-index:1}
        .hero-badge{display:inline-block;background:rgba(255,255,255,.15);padding:8px 16px;border-radius:50px;font-size:.9rem;font-weight:600;margin-bottom:24px;border:1px solid rgba(255,255,255,.2)}
        h1{font-size:2.5rem;font-weight:800;margin-bottom:20px;line-height:1.1}.hero p{font-size:1.1rem;opacity:.9;margin-bottom:32px;max-width:650px;margin-left:auto;margin-right:auto}
        .hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:8px;font-weight:600;text-decoration:none;transition:all .2s;min-height:44px}
        .btn-primary{background:#fff;color:${service.color};box-shadow:0 4px 14px rgba(0,0,0,.2)}.btn-primary:hover{transform:translateY(-2px)}
        .btn-secondary{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.3)}.btn-secondary:hover{background:rgba(255,255,255,.15)}
        .breadcrumb{max-width:1200px;margin:0 auto;padding:16px 24px;font-size:.85rem;color:#666}.breadcrumb a{color:#666;text-decoration:none}.breadcrumb a:hover{color:#f97316}.breadcrumb span{margin:0 8px}
        section{padding:60px 24px}.section-inner{max-width:1000px;margin:0 auto}
        h2{font-size:1.75rem;font-weight:800;margin-bottom:16px}
        .content-section{background:#fff;border-radius:12px;padding:32px;margin-bottom:24px;border:1px solid #e5e5e5}
        .content-section p{color:#555;margin-bottom:16px;line-height:1.8}.content-section p:last-child{margin-bottom:0}
        .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-top:24px}
        .feature{display:flex;align-items:flex-start;gap:12px}.feature-icon{width:40px;height:40px;background:${service.color}15;color:${service.color};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .feature h4{font-size:.95rem;font-weight:600;margin-bottom:4px}.feature p{font-size:.85rem;color:#666}
        .cta-section{background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px;padding:48px 32px;text-align:center;color:#fff;margin-top:40px}
        .cta-section h2{color:#fff;font-size:1.5rem;margin-bottom:12px}.cta-section p{opacity:.9;margin-bottom:20px}
        .cta-section .btn-primary{background:#fff;color:#f97316}.cta-section .btn-primary:hover{background:#fafafa}
        .other-services{margin-top:40px;padding-top:40px;border-top:1px solid #e5e5e5}
        .other-services h3{font-size:1.1rem;font-weight:700;margin-bottom:16px}
        .services-list{display:flex;flex-wrap:wrap;gap:12px}
        .services-list a{padding:10px 16px;background:#f5f5f5;border-radius:6px;text-decoration:none;color:#666;font-size:.9rem;transition:all .2s}.services-list a:hover{background:#fff7ed;color:#f97316}
        .faa-disclaimer{font-size:.75rem;color:#999;text-align:center;padding:16px;background:#fafafa;border-top:1px solid #e5e5e5}
        footer{background:#fff;border-top:1px solid #e5e5e5;padding:20px 24px}.footer-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;font-size:.85rem;color:#666}footer a{color:#666;text-decoration:none}footer a:hover{color:#f97316}.footer-links{display:flex;gap:20px}
        .cookie-consent{position:fixed;bottom:0;left:0;right:0;background:#1a1a1a;color:#fff;padding:16px 24px;z-index:9999;display:none}.cookie-consent.show{display:block}.cookie-consent-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.cookie-consent p{flex:1;font-size:.9rem}.cookie-consent a{color:#f97316}.cookie-consent-buttons{display:flex;gap:12px}.cookie-consent .ccbtn{padding:10px 20px;border-radius:6px;font-weight:600;cursor:pointer;border:none}.cookie-consent .btn-accept{background:#f97316;color:#fff}.cookie-consent .btn-decline{background:transparent;color:#fff;border:1px solid #666}
        @media(max-width:768px){header{padding:12px 16px}.logo{font-size:1.25rem}nav a:not(.nav-cta){display:none}.nav-toggle{display:block}h1{font-size:1.75rem}.hero{padding:48px 20px}.hero p{font-size:1rem}.content-section{padding:24px}.features-grid{grid-template-columns:1fr}.footer-inner{flex-direction:column;gap:12px;text-align:center}.footer-links{flex-wrap:wrap;justify-content:center}}
    </style>
</head>
<body>
    <a href="#main" class="skip-link">Skip to main content</a>
    <header><div class="header-inner"><a href="../index.html" class="logo">US<span>Drone</span>Map</a><nav><a href="../index.html">Map</a><a href="../directory.html">Directory</a><a href="../ag-spraying.html">Ag Spraying</a><a href="../deer-recovery.html">Deer Recovery</a><a href="../verify.html" class="nav-cta">Get Verified</a></nav><button class="nav-toggle" id="navToggle" aria-label="Menu"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button></div></header>
    <nav class="nav-mobile" id="navMobile"><a href="../index.html">Map</a><a href="../directory.html">Directory</a><a href="../ag-spraying.html">Ag Spraying</a><a href="../deer-recovery.html">Deer Recovery</a><a href="../verify.html" class="nav-cta">Get Verified</a></nav>
    
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a><span>›</span>
        <a href="index.html">States</a><span>›</span>
        <a href="${stateSlug}.html">${state.name}</a><span>›</span>
        <strong>${service.shortName}</strong>
    </nav>
    
    <main id="main">
        <section class="hero">
            <div class="hero-inner">
                <div class="hero-badge">${service.icon} ${state.name}</div>
                <h1>${h1}</h1>
                <p>${service.description}. Connect with licensed drone pilots in ${state.name} today.</p>
                <div class="hero-buttons">
                    <a href="../directory.html?state=${state.abbr}&service=${encodeURIComponent(service.shortName)}" class="btn btn-primary">Find ${service.shortName} Pilots</a>
                    <a href="${stateSlug}.html" class="btn btn-secondary">All ${state.abbr} Services</a>
                </div>
            </div>
        </section>
        
        <section>
            <div class="section-inner">
                <div class="content-section">
                    <h2>About ${service.name} in ${state.name}</h2>
                    <p>${service.description} across ${state.name}. Our directory features FAA Part 107 certified drone pilots who specialize in ${service.shortName.toLowerCase()} services throughout the ${state.region} region.</p>
                    <p>Whether you need ${service.keywords.slice(0, 3).join(', ')}, or other ${service.shortName.toLowerCase()} drone services, you'll find qualified professionals ready to help. All pilots maintain proper licensing and insurance for commercial drone operations in ${state.name}.</p>
                    
                    <div class="features-grid">
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div><h4>Part 107 Certified</h4><p>All pilots FAA licensed</p></div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div><h4>Insured Operations</h4><p>Liability coverage included</p></div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div><h4>Local ${state.abbr} Pilots</h4><p>Based in ${state.name}</p></div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">✓</div>
                            <div><h4>Professional Equipment</h4><p>Commercial-grade drones</p></div>
                        </div>
                    </div>
                </div>
                
                <div class="cta-section">
                    <h2>Ready to Find a ${service.shortName} Pilot?</h2>
                    <p>Browse our directory of verified ${state.name} drone pilots specializing in ${service.shortName.toLowerCase()}.</p>
                    <a href="../directory.html?state=${state.abbr}&service=${encodeURIComponent(service.shortName)}" class="btn btn-primary">Browse ${state.abbr} Pilots</a>
                </div>
                
                <div class="other-services">
                    <h3>Other Drone Services in ${state.name}</h3>
                    <div class="services-list">
                        ${SERVICES.filter(s => s.slug !== service.slug).map(s => 
                            `<a href="${stateSlug}-${s.slug}.html">${s.icon} ${s.shortName}</a>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <div class="faa-disclaimer">All drone operations must comply with FAA regulations. Verify pilot credentials and Part 107 certification independently.</div>
    <footer><div class="footer-inner"><div>© 2026 US Drone Map. All rights reserved.</div><div class="footer-links"><a href="../privacy.html">Privacy</a><a href="../terms.html">Terms</a><a href="../cookie-policy.html">Cookies</a><a href="mailto:${CONFIG.contactEmail}">Contact</a></div></div></footer>
    <div class="cookie-consent" id="cookieConsent"><div class="cookie-consent-inner"><p>We use cookies to improve your experience. <a href="../cookie-policy.html">Learn more</a></p><div class="cookie-consent-buttons"><button class="ccbtn btn-decline" id="cookieDecline">Decline</button><button class="ccbtn btn-accept" id="cookieAccept">Accept</button></div></div></div>
    <script>
        const CC={hasConsent(){const c=localStorage.getItem('usdm_cookie_consent');if(!c)return null;try{const d=JSON.parse(c);return d.version==='1'?d.accepted:null}catch{return null}},setConsent(a){localStorage.setItem('usdm_cookie_consent',JSON.stringify({accepted:a,version:'1',timestamp:new Date().toISOString()}));if(a&&typeof gtag==='function')gtag('consent','update',{'analytics_storage':'granted'});this.hide()},show(){document.getElementById('cookieConsent').classList.add('show')},hide(){document.getElementById('cookieConsent').classList.remove('show')},init(){if(this.hasConsent()===null)this.show();else if(this.hasConsent()&&typeof gtag==='function')gtag('consent','update',{'analytics_storage':'granted'})}};
        const MN={isOpen:false,init(){const t=document.getElementById('navToggle'),m=document.getElementById('navMobile');if(t&&m)t.addEventListener('click',()=>{this.isOpen=!this.isOpen;m.classList.toggle('open',this.isOpen);document.body.style.overflow=this.isOpen?'hidden':''})}};
        document.addEventListener('DOMContentLoaded',()=>{CC.init();MN.init();document.getElementById('cookieAccept').addEventListener('click',()=>CC.setConsent(true));document.getElementById('cookieDecline').addEventListener('click',()=>CC.setConsent(false))});
    </script>
</body>
</html>`;
}

function generateStatesIndexHTML() {
    const title = 'Drone Pilots by State | US Drone Map Directory';
    const description = 'Find drone pilots in all 50 US states. Browse our nationwide directory of FAA Part 107 certified drone service providers.';
    const canonicalUrl = `${CONFIG.baseUrl}/states/`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','${CONFIG.gaId}');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23f97316'/></svg>">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',-apple-system,sans-serif;background:#f5f5f5;color:#1a1a1a;line-height:1.6}
        header{background:#fff;border-bottom:1px solid #e5e5e5;padding:14px 24px;position:sticky;top:0;z-index:1000}.header-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
        .logo{font-size:1.5rem;font-weight:800;color:#1a1a1a;text-decoration:none}.logo span{color:#f97316}
        nav{display:flex;gap:8px}nav a{color:#666;text-decoration:none;font-weight:500;font-size:.9rem;padding:8px 16px;border-radius:6px}nav a:hover{color:#1a1a1a;background:#f5f5f5}.nav-cta{background:#f97316!important;color:#fff!important}
        .nav-toggle{display:none;background:none;border:none;padding:8px;cursor:pointer}.nav-toggle svg{width:24px;height:24px}
        .nav-mobile{display:none;position:fixed;top:60px;left:0;right:0;bottom:0;background:#fff;padding:16px;z-index:999;flex-direction:column;gap:8px}.nav-mobile.open{display:flex}.nav-mobile a{display:block;padding:14px 16px;color:#1a1a1a;text-decoration:none;font-weight:500;border-radius:8px}
        main{max-width:1200px;margin:0 auto;padding:48px 24px}
        h1{font-size:2.5rem;font-weight:800;text-align:center;margin-bottom:16px}
        .subtitle{text-align:center;color:#666;font-size:1.1rem;margin-bottom:48px}
        .states-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
        .state-card{display:block;padding:20px;background:#fff;border:1px solid #e5e5e5;border-radius:10px;text-decoration:none;color:inherit;transition:all .2s}.state-card:hover{border-color:#f97316;box-shadow:0 4px 12px rgba(249,115,22,.1)}
        .state-card h2{font-size:1.1rem;font-weight:700;margin-bottom:4px;color:#1a1a1a}.state-card p{font-size:.85rem;color:#666}
        footer{background:#fff;border-top:1px solid #e5e5e5;padding:20px 24px;margin-top:48px}.footer-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;font-size:.85rem;color:#666}footer a{color:#666;text-decoration:none}footer a:hover{color:#f97316}.footer-links{display:flex;gap:20px}
        @media(max-width:768px){header{padding:12px 16px}.logo{font-size:1.25rem}nav a:not(.nav-cta){display:none}.nav-toggle{display:block}h1{font-size:2rem}main{padding:32px 16px}.states-grid{grid-template-columns:repeat(2,1fr)}.footer-inner{flex-direction:column;gap:12px;text-align:center}}
    </style>
</head>
<body>
    <header><div class="header-inner"><a href="../index.html" class="logo">US<span>Drone</span>Map</a><nav><a href="../index.html">Map</a><a href="../directory.html">Directory</a><a href="../verify.html" class="nav-cta">Get Verified</a></nav><button class="nav-toggle" id="navToggle" aria-label="Menu"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button></div></header>
    <nav class="nav-mobile" id="navMobile"><a href="../index.html">Map</a><a href="../directory.html">Directory</a><a href="../verify.html" class="nav-cta">Get Verified</a></nav>
    <main>
        <h1>Drone Pilots by State</h1>
        <p class="subtitle">Browse drone service providers across all 50 US states</p>
        <div class="states-grid">
            ${STATES.map(s => `
            <a href="${s.name.toLowerCase().replace(/\s+/g, '-')}.html" class="state-card">
                <h2>${s.name}</h2>
                <p>${s.region} Region</p>
            </a>`).join('')}
        </div>
    </main>
    <footer><div class="footer-inner"><div>© 2026 US Drone Map.</div><div class="footer-links"><a href="../privacy.html">Privacy</a><a href="../terms.html">Terms</a><a href="mailto:${CONFIG.contactEmail}">Contact</a></div></div></footer>
    <script>const MN={isOpen:false,init(){const t=document.getElementById('navToggle'),m=document.getElementById('navMobile');if(t&&m)t.addEventListener('click',()=>{this.isOpen=!this.isOpen;m.classList.toggle('open',this.isOpen)})}};document.addEventListener('DOMContentLoaded',()=>MN.init());</script>
</body>
</html>`;
}

function generateSitemap(pages) {
    const urls = pages.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>${p.changefreq || 'weekly'}</changefreq>
    <priority>${p.priority || '0.7'}</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url>
    <loc>${CONFIG.baseUrl}/</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${CONFIG.baseUrl}/directory.html</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${CONFIG.baseUrl}/ag-spraying.html</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${CONFIG.baseUrl}/deer-recovery.html</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${CONFIG.baseUrl}/game-recovery.html</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${CONFIG.baseUrl}/pet-recovery.html</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${CONFIG.baseUrl}/verify.html</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${CONFIG.baseUrl}/states/</loc>
    <lastmod>${CONFIG.lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- State & Service Pages -->
${urls}
</urlset>`;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generate() {
    console.log('🚀 US Drone Map - Programmatic SEO Generator\n');
    
    // Create output directory
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    const sitemapPages = [];
    let totalPages = 0;
    
    // Generate states index
    console.log('📄 Generating states index...');
    fs.writeFileSync(
        path.join(CONFIG.outputDir, 'index.html'),
        generateStatesIndexHTML()
    );
    totalPages++;
    
    // Generate state pages
    console.log('📄 Generating 50 state pages...');
    STATES.forEach(state => {
        const slug = state.name.toLowerCase().replace(/\s+/g, '-');
        const filename = `${slug}.html`;
        
        fs.writeFileSync(
            path.join(CONFIG.outputDir, filename),
            generateStatePageHTML(state)
        );
        
        sitemapPages.push({
            url: `${CONFIG.baseUrl}/states/${filename}`,
            priority: '0.8',
            changefreq: 'weekly'
        });
        
        totalPages++;
    });
    
    // Generate state + service combo pages
    console.log('📄 Generating state + service combo pages...');
    STATES.forEach(state => {
        const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
        
        SERVICES.forEach(service => {
            const filename = `${stateSlug}-${service.slug}.html`;
            
            fs.writeFileSync(
                path.join(CONFIG.outputDir, filename),
                generateServicePageHTML(state, service)
            );
            
            sitemapPages.push({
                url: `${CONFIG.baseUrl}/states/${filename}`,
                priority: '0.7',
                changefreq: 'weekly'
            });
            
            totalPages++;
        });
    });
    
    // Generate sitemap
    console.log('🗺️  Generating sitemap.xml...');
    fs.writeFileSync(
        path.join(CONFIG.outputDir, '..', 'sitemap.xml'),
        generateSitemap(sitemapPages)
    );
    
    console.log(`\n✅ Generation complete!`);
    console.log(`   📁 Output: ${CONFIG.outputDir}`);
    console.log(`   📄 Total pages: ${totalPages}`);
    console.log(`   🗺️  Sitemap entries: ${sitemapPages.length + 8}`);
    console.log(`\n   State pages: 50`);
    console.log(`   Service combo pages: ${50 * SERVICES.length}`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Copy ./states/ folder to your repo`);
    console.log(`   2. Copy sitemap.xml to your repo root`);
    console.log(`   3. Submit sitemap to Google Search Console`);
}

// Run generator
generate();
