#!/usr/bin/env node
/**
 * US Drone Map - Enhanced SEO Page Generator
 * Run: node generate-seo-pages.js
 */

const fs = require('fs');
const path = require('path');
const { STATES, TOP_HUNTING_STATES, SERVICES } = require('./state-data');

const CONFIG = {
    baseUrl: 'https://usdronemap.com',
    outputDir: './states',
    gaId: 'G-WX7S46H7W1',
    contactEmail: 'contact@usdronemap.com',
    lastMod: new Date().toISOString().split('T')[0]
};

// ============================================
// SHARED HTML COMPONENTS
// ============================================
function getHeader(relativePath = '../', activePage = '') {
    return `<a href="#main" class="skip-link">Skip to main content</a>
<header><div class="header-inner"><a href="${relativePath}index.html" class="logo">US<span>Drone</span>Map</a><nav><a href="${relativePath}index.html">Map</a><a href="${relativePath}directory.html">Directory</a><a href="${relativePath}ag-spraying.html"${activePage === 'ag' ? ' class="active"' : ''}>Ag Spraying</a><a href="${relativePath}deer-recovery.html"${activePage === 'deer' ? ' class="active"' : ''}>Deer Recovery</a><a href="${relativePath}game-recovery.html">Game Recovery</a><a href="${relativePath}verify.html" class="nav-cta">Get Verified</a></nav><button class="nav-toggle" id="navToggle" aria-label="Toggle navigation"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button></div></header>
<nav class="nav-mobile" id="navMobile"><a href="${relativePath}index.html">Map</a><a href="${relativePath}directory.html">Directory</a><a href="${relativePath}ag-spraying.html">Ag Spraying</a><a href="${relativePath}deer-recovery.html"${activePage === 'deer' ? ' class="active"' : ''}>Deer Recovery</a><a href="${relativePath}game-recovery.html">Game Recovery</a><a href="${relativePath}verify.html" class="nav-cta">Get Verified</a></nav>`;
}

function getFooter(relativePath = '../') {
    return `<div class="faa-disclaimer">All drone operations must comply with FAA regulations. Verify pilot credentials independently.</div>
<footer><div class="footer-inner"><div>© 2026 US Drone Map. All rights reserved.</div><div class="footer-links"><a href="${relativePath}privacy.html">Privacy</a><a href="${relativePath}terms.html">Terms</a><a href="${relativePath}cookie-policy.html">Cookies</a><a href="mailto:${CONFIG.contactEmail}">Contact</a></div></div></footer>
<div class="cookie-consent" id="cookieConsent"><div class="cookie-consent-inner"><p>We use cookies to improve your experience. <a href="${relativePath}cookie-policy.html">Learn more</a></p><div class="cookie-consent-buttons"><button class="btn-sm btn-decline" id="cookieDecline">Decline</button><button class="btn-sm btn-accept" id="cookieAccept">Accept</button></div></div></div>`;
}

function getScripts() {
    return `const CK='usdm_cookie_consent',CV='1';
const CC={hasConsent(){const c=localStorage.getItem(CK);if(!c)return null;try{const d=JSON.parse(c);return d.version===CV?d.accepted:null}catch{return null}},setConsent(a){localStorage.setItem(CK,JSON.stringify({accepted:a,version:CV,timestamp:new Date().toISOString()}));if(a&&typeof gtag==='function')gtag('consent','update',{'analytics_storage':'granted'});this.hide()},show(){document.getElementById('cookieConsent').classList.add('show')},hide(){document.getElementById('cookieConsent').classList.remove('show')},init(){if(this.hasConsent()===null)this.show();else if(this.hasConsent()&&typeof gtag==='function')gtag('consent','update',{'analytics_storage':'granted'})}};
const MN={isOpen:false,init(){const t=document.getElementById('navToggle'),m=document.getElementById('navMobile');if(t&&m)t.addEventListener('click',()=>{this.isOpen=!this.isOpen;m.classList.toggle('open',this.isOpen);document.body.style.overflow=this.isOpen?'hidden':''})}};`;
}

// ============================================
// STATE DEER RECOVERY PAGE
// ============================================
function generateStateDeerRecoveryPage(state) {
    const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
    const title = `Deer Recovery Drone Services in ${state.name} | Thermal Tracking ${state.abbr}`;
    const description = `Find thermal drone deer recovery in ${state.name}. Gun season ${state.hunting.gunStart} - ${state.hunting.gunEnd}. Professional pilots locate wounded deer in ${state.hunting.terrain.split(',')[0].toLowerCase()}.`;
    const nearbyStates = STATES.filter(s => s.region === state.region && s.abbr !== state.abbr).slice(0, 6);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','${CONFIG.gaId}');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="deer recovery ${state.name}, thermal drone ${state.abbr}, wounded deer tracking, deer finder ${state.name}">
    <link rel="canonical" href="${CONFIG.baseUrl}/states/${stateSlug}-deer-recovery.html">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta name="geo.region" content="US-${state.abbr}">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23f97316'/></svg>">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Service","name":"Deer Recovery Drone Services in ${state.name}","serviceType":"Drone Deer Recovery","areaServed":{"@type":"State","name":"${state.name}"}}</script>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',-apple-system,sans-serif;background:#f5f5f5;color:#1a1a1a;line-height:1.6}
        .skip-link{position:absolute;top:-40px;left:0;background:#f97316;color:#fff;padding:8px 16px;z-index:10001}.skip-link:focus{top:0}
        header{background:#fff;border-bottom:1px solid #e5e5e5;padding:14px 24px;position:sticky;top:0;z-index:1000}.header-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
        .logo{font-size:1.5rem;font-weight:800;color:#1a1a1a;text-decoration:none}.logo span{color:#f97316}
        nav{display:flex;gap:8px}nav a{color:#666;text-decoration:none;font-weight:500;font-size:.9rem;padding:8px 16px;border-radius:6px}nav a:hover{color:#1a1a1a;background:#f5f5f5}nav a.active{color:#f97316;background:#fff7ed}.nav-cta{background:#f97316!important;color:#fff!important}
        .nav-toggle{display:none;background:none;border:none;padding:8px;cursor:pointer}.nav-toggle svg{width:24px;height:24px}
        .nav-mobile{display:none;position:fixed;top:60px;left:0;right:0;bottom:0;background:#fff;padding:16px;z-index:999;flex-direction:column;gap:8px}.nav-mobile.open{display:flex}.nav-mobile a{display:block;padding:14px 16px;color:#1a1a1a;text-decoration:none;font-weight:500;border-radius:8px}
        .breadcrumb{max-width:1200px;margin:0 auto;padding:16px 24px;font-size:.85rem;color:#666}.breadcrumb a{color:#666;text-decoration:none}.breadcrumb a:hover{color:#f97316}.breadcrumb span{margin:0 8px}
        .hero{background:linear-gradient(135deg,#78350f,#92400e 50%,#b45309);color:#fff;padding:80px 24px;text-align:center}.hero-inner{max-width:800px;margin:0 auto}
        .hero-badge{display:inline-block;background:rgba(255,255,255,.15);padding:8px 16px;border-radius:50px;font-size:.85rem;font-weight:600;margin-bottom:20px}
        .hero h1{font-size:2.5rem;font-weight:800;margin-bottom:16px}.hero p{font-size:1.1rem;opacity:.9;margin-bottom:32px}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:8px;font-weight:600;text-decoration:none;transition:all .2s}
        .btn-primary{background:#f97316;color:#fff}.btn-primary:hover{background:#ea580c}
        .btn-secondary{background:rgba(255,255,255,.1);color:#fff;border:2px solid rgba(255,255,255,.3)}
        .hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
        section{padding:60px 24px}.section-inner{max-width:1200px;margin:0 auto}
        .season-box{background:#fff7ed;border:2px solid #f97316;border-radius:12px;padding:24px;margin:40px 0}
        .season-box h3{color:#78350f;margin-bottom:16px}
        .season-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
        .season-item{background:#fff;padding:16px;border-radius:8px}
        .season-item .label{font-size:.8rem;color:#666;text-transform:uppercase}
        .season-item .value{font-size:1.1rem;font-weight:600;color:#1a1a1a;margin-top:4px}
        .info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:40px}
        .info-card{background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:24px}
        .info-card h3{color:#78350f;margin-bottom:12px}
        .info-card p{color:#555;font-size:.95rem;line-height:1.7}
        .terrain-section{background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e5e5;margin:40px 0}
        .terrain-section h3{margin-bottom:16px}
        .terrain-section p{color:#555;line-height:1.8;margin-bottom:16px}
        .counties-section h3{margin-bottom:16px}
        .counties-grid{display:flex;flex-wrap:wrap;gap:12px}
        .county-tag{background:#f5f5f5;padding:10px 16px;border-radius:6px;font-size:.9rem;color:#555}
        .county-tag:hover{background:#fff7ed;color:#f97316}
        .tips-section{background:#1a1a1a;color:#fff;border-radius:12px;padding:32px;margin:40px 0}
        .tips-section h3{color:#f97316;margin-bottom:20px}
        .tips-list{list-style:none}
        .tips-list li{padding:12px 0;border-bottom:1px solid #333;display:flex;align-items:flex-start;gap:12px}
        .tips-list li:last-child{border-bottom:none}
        .tips-list .icon{color:#f97316;font-size:1.2rem}
        .tips-list p{color:#ccc;font-size:.95rem}
        .cta-section{background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px;padding:48px;text-align:center;color:#fff;margin:40px 0}
        .cta-section h2{color:#fff;margin-bottom:12px}
        .cta-section p{opacity:.9;margin-bottom:24px}
        .cta-section .btn-primary{background:#fff;color:#f97316}
        .nearby-section{margin-top:40px;padding-top:40px;border-top:1px solid #e5e5e5}
        .nearby-section h3{text-align:center;margin-bottom:24px}
        .nearby-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px}
        .nearby-link{display:block;padding:16px;background:#fff;border:1px solid #e5e5e5;border-radius:8px;text-decoration:none;color:#1a1a1a;text-align:center}
        .nearby-link:hover{border-color:#f97316;background:#fff7ed}
        .nearby-link .state{font-weight:600}
        .nearby-link .season{font-size:.8rem;color:#666;margin-top:4px}
        .faa-disclaimer{font-size:.75rem;color:#999;text-align:center;padding:16px;background:#fafafa;border-top:1px solid #e5e5e5}
        footer{background:#fff;border-top:1px solid #e5e5e5;padding:20px 24px}.footer-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;font-size:.85rem;color:#666}footer a{color:#666;text-decoration:none}footer a:hover{color:#f97316}.footer-links{display:flex;gap:20px}
        .cookie-consent{position:fixed;bottom:0;left:0;right:0;background:#1a1a1a;color:#fff;padding:16px 24px;z-index:9999;display:none}.cookie-consent.show{display:block}.cookie-consent-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.cookie-consent p{flex:1;font-size:.9rem}.cookie-consent a{color:#f97316}.cookie-consent-buttons{display:flex;gap:12px}.cookie-consent .btn-sm{padding:10px 20px;font-size:.85rem;border-radius:6px;cursor:pointer;border:none}.cookie-consent .btn-accept{background:#f97316;color:#fff}.cookie-consent .btn-decline{background:transparent;color:#fff;border:1px solid #666}
        @media(max-width:768px){header{padding:12px 16px}.logo{font-size:1.25rem}nav a:not(.nav-cta){display:none}.nav-toggle{display:block}.hero{padding:48px 20px}.hero h1{font-size:1.75rem}.season-grid{grid-template-columns:1fr}.info-grid{grid-template-columns:1fr}.footer-inner{flex-direction:column;gap:12px;text-align:center}.footer-links{flex-wrap:wrap;justify-content:center}.cookie-consent-inner{flex-direction:column;text-align:center}}
    </style>
</head>
<body>
    ${getHeader('../', 'deer')}
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>›</span><a href="../deer-recovery.html">Deer Recovery</a><span>›</span><strong>${state.name}</strong></nav>
    <main id="main">
        <section class="hero"><div class="hero-inner">
            <div class="hero-badge">🦌 ${state.name} Deer Recovery</div>
            <h1>Drone Deer Recovery in ${state.name}</h1>
            <p>Thermal imaging drones locate wounded deer across ${state.name}'s ${state.hunting.terrain.split(',')[0].toLowerCase()}. Professional pilots with Part 107 certification.</p>
            <div class="hero-buttons">
                <a href="../directory.html?state=${state.abbr}&service=Game%20Recovery" class="btn btn-primary">Find ${state.abbr} Recovery Pilots</a>
                <a href="../verify.html" class="btn btn-secondary">List Your Service</a>
            </div>
        </div></section>
        <section><div class="section-inner">
            <div class="season-box">
                <h3>🗓️ ${state.name} Deer Hunting Seasons</h3>
                <div class="season-grid">
                    <div class="season-item"><div class="label">Archery Season</div><div class="value">${state.hunting.archeryStart} - ${state.hunting.archeryEnd}</div></div>
                    <div class="season-item"><div class="label">Gun Season</div><div class="value">${state.hunting.gunStart} - ${state.hunting.gunEnd}</div></div>
                    <div class="season-item"><div class="label">Average Temps</div><div class="value">${state.hunting.avgTemp}</div></div>
                    <div class="season-item"><div class="label">Best Thermal Time</div><div class="value">Evening & Early AM</div></div>
                </div>
            </div>
            <div class="info-grid">
                <div class="info-card"><h3>🌡️ Why Thermal Works in ${state.abbr}</h3><p>Thermal cameras detect the heat signature of deer even through ${state.hunting.terrain.includes('swamp') || state.hunting.terrain.includes('bottom') ? 'dense vegetation and standing water' : 'thick brush and timber'}. ${state.hunting.bestTime}</p></div>
                <div class="info-card"><h3>📋 ${state.name} Drone Regulations</h3><p>${state.hunting.droneRegs}</p></div>
                <div class="info-card"><h3>💡 Recovery Tips</h3><p>${state.hunting.notes}</p></div>
            </div>
            <div class="terrain-section">
                <h3>🌲 ${state.name} Hunting Terrain</h3>
                <p>${state.hunting.terrain}. Each terrain type presents unique tracking challenges that thermal drones overcome.</p>
                <p>Traditional blood tracking becomes difficult or impossible in many ${state.name} conditions. Thermal drone recovery offers a reliable alternative when visual tracking fails.</p>
            </div>
            <div class="counties-section">
                <h3>🎯 Top Hunting Counties in ${state.name}</h3>
                <div class="counties-grid">${state.hunting.topCounties.map(c => `<span class="county-tag">${c} County</span>`).join('')}</div>
            </div>
            <div class="tips-section">
                <h3>When to Call a Recovery Pilot</h3>
                <ul class="tips-list">
                    <li><span class="icon">⏱️</span><p><strong>2-12 hours after the shot</strong> is the ideal window for thermal detection.</p></li>
                    <li><span class="icon">🌡️</span><p><strong>${state.hunting.avgTemp}</strong> provides good thermal contrast during ${state.name}'s hunting season.</p></li>
                    <li><span class="icon">🌙</span><p><strong>Evening and early morning</strong> flights are most effective when ambient temps are cooler.</p></li>
                    <li><span class="icon">📍</span><p><strong>Mark your last blood</strong> and have GPS coordinates ready when you call.</p></li>
                </ul>
            </div>
            <div class="cta-section">
                <h2>Don't Lose Your ${state.name} Buck</h2>
                <p>Connect with certified thermal drone operators in ${state.abbr} today.</p>
                <a href="../directory.html?state=${state.abbr}&service=Game%20Recovery" class="btn btn-primary">Find Recovery Pilots Near You</a>
            </div>
            <div class="nearby-section">
                <h3>Deer Recovery in Nearby States</h3>
                <div class="nearby-grid">${nearbyStates.map(s => `<a href="${s.name.toLowerCase().replace(/\s+/g, '-')}-deer-recovery.html" class="nearby-link"><div class="state">${s.name}</div><div class="season">Gun: ${s.hunting.gunStart}</div></a>`).join('')}</div>
            </div>
        </div></section>
    </main>
    ${getFooter('../')}
    <script>${getScripts()}document.addEventListener('DOMContentLoaded',()=>{CC.init();MN.init();document.getElementById('cookieAccept').addEventListener('click',()=>CC.setConsent(true));document.getElementById('cookieDecline').addEventListener('click',()=>CC.setConsent(false))});</script>
</body>
</html>`;
}

// ============================================
// COUNTY PAGE
// ============================================
function generateCountyPage(state, county) {
    const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
    const countySlug = county.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const title = `Deer Recovery Drone Services in ${county} County, ${state.abbr}`;
    const description = `Find thermal drone deer recovery in ${county} County, ${state.name}. Local pilots locate wounded deer using thermal imaging during ${state.abbr} hunting season.`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaId}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','${CONFIG.gaId}');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="deer recovery ${county} County, thermal drone ${county} ${state.abbr}, wounded deer tracking ${state.name}">
    <link rel="canonical" href="${CONFIG.baseUrl}/states/${stateSlug}/${countySlug}-deer-recovery.html">
    <meta name="geo.region" content="US-${state.abbr}">
    <meta name="geo.placename" content="${county} County, ${state.name}">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23f97316'/></svg>">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',-apple-system,sans-serif;background:#f5f5f5;color:#1a1a1a;line-height:1.6}
        .skip-link{position:absolute;top:-40px;left:0;background:#f97316;color:#fff;padding:8px 16px;z-index:10001}.skip-link:focus{top:0}
        header{background:#fff;border-bottom:1px solid #e5e5e5;padding:14px 24px;position:sticky;top:0;z-index:1000}.header-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
        .logo{font-size:1.5rem;font-weight:800;color:#1a1a1a;text-decoration:none}.logo span{color:#f97316}
        nav{display:flex;gap:8px}nav a{color:#666;text-decoration:none;font-weight:500;font-size:.9rem;padding:8px 16px;border-radius:6px}nav a:hover{color:#1a1a1a;background:#f5f5f5}nav a.active{color:#f97316}.nav-cta{background:#f97316!important;color:#fff!important}
        .nav-toggle{display:none;background:none;border:none;padding:8px;cursor:pointer}.nav-toggle svg{width:24px;height:24px}
        .nav-mobile{display:none;position:fixed;top:60px;left:0;right:0;bottom:0;background:#fff;padding:16px;z-index:999;flex-direction:column;gap:8px}.nav-mobile.open{display:flex}.nav-mobile a{display:block;padding:14px 16px;color:#1a1a1a;text-decoration:none;font-weight:500;border-radius:8px}
        .breadcrumb{max-width:1200px;margin:0 auto;padding:16px 24px;font-size:.85rem;color:#666}.breadcrumb a{color:#666;text-decoration:none}.breadcrumb a:hover{color:#f97316}.breadcrumb span{margin:0 8px}
        .hero{background:linear-gradient(135deg,#78350f,#92400e);color:#fff;padding:60px 24px;text-align:center}.hero-inner{max-width:800px;margin:0 auto}
        .hero-badge{display:inline-block;background:rgba(255,255,255,.15);padding:8px 16px;border-radius:50px;font-size:.85rem;font-weight:600;margin-bottom:16px}
        .hero h1{font-size:2rem;font-weight:800;margin-bottom:12px}.hero p{font-size:1rem;opacity:.9;margin-bottom:24px}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:8px;font-weight:600;text-decoration:none}.btn-primary{background:#f97316;color:#fff}
        .content{background:#fff;border-radius:12px;padding:32px;margin:40px auto;max-width:800px;border:1px solid #e5e5e5}
        .content h2{font-size:1.5rem;margin-bottom:16px}.content p{color:#555;line-height:1.8;margin-bottom:16px}
        .info-box{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:24px 0}.info-box h3{color:#78350f;font-size:1rem;margin-bottom:8px}.info-box p{color:#555;font-size:.9rem;margin:0}
        .cta-box{background:#f97316;color:#fff;border-radius:12px;padding:32px;text-align:center;margin:32px 0}.cta-box h3{margin-bottom:12px}.cta-box p{opacity:.9;margin-bottom:20px}.cta-box .btn{background:#fff;color:#f97316}
        .other-counties{margin-top:32px;padding-top:32px;border-top:1px solid #e5e5e5}.other-counties h3{margin-bottom:16px}
        .counties-list{display:flex;flex-wrap:wrap;gap:12px}.counties-list a{padding:10px 16px;background:#f5f5f5;border-radius:6px;text-decoration:none;color:#555;font-size:.9rem}.counties-list a:hover{background:#fff7ed;color:#f97316}
        .faa-disclaimer{font-size:.75rem;color:#999;text-align:center;padding:16px;background:#fafafa;border-top:1px solid #e5e5e5}
        footer{background:#fff;border-top:1px solid #e5e5e5;padding:20px 24px}.footer-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;font-size:.85rem;color:#666}footer a{color:#666;text-decoration:none}footer a:hover{color:#f97316}.footer-links{display:flex;gap:20px}
        .cookie-consent{position:fixed;bottom:0;left:0;right:0;background:#1a1a1a;color:#fff;padding:16px 24px;z-index:9999;display:none}.cookie-consent.show{display:block}.cookie-consent-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.cookie-consent p{flex:1;font-size:.9rem}.cookie-consent a{color:#f97316}.cookie-consent-buttons{display:flex;gap:12px}.cookie-consent .btn-sm{padding:10px 20px;font-size:.85rem;border-radius:6px;cursor:pointer;border:none}.cookie-consent .btn-accept{background:#f97316;color:#fff}.cookie-consent .btn-decline{background:transparent;color:#fff;border:1px solid #666}
        @media(max-width:768px){header{padding:12px 16px}.logo{font-size:1.25rem}nav a:not(.nav-cta){display:none}.nav-toggle{display:block}.content{padding:24px;margin:20px 16px}.footer-inner{flex-direction:column;gap:12px;text-align:center}}
    </style>
</head>
<body>
    ${getHeader('../../', 'deer')}
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../../index.html">Home</a><span>›</span><a href="../../deer-recovery.html">Deer Recovery</a><span>›</span><a href="../${stateSlug}-deer-recovery.html">${state.name}</a><span>›</span><strong>${county} County</strong></nav>
    <main id="main">
        <section class="hero"><div class="hero-inner">
            <div class="hero-badge">🦌 ${county} County, ${state.abbr}</div>
            <h1>Deer Recovery in ${county} County, ${state.name}</h1>
            <p>Professional thermal drone services for wounded deer recovery in ${county} County.</p>
            <a href="../../directory.html?state=${state.abbr}&service=Game%20Recovery" class="btn btn-primary">Find Local Pilots</a>
        </div></section>
        <section><div class="content">
            <h2>Thermal Drone Recovery in ${county} County</h2>
            <p>${county} County is one of ${state.name}'s top deer hunting destinations. The local terrain includes ${state.hunting.terrain.toLowerCase()}, which can make traditional blood tracking challenging.</p>
            <p>Thermal drone recovery services in ${county} County use advanced thermal imaging cameras to detect the heat signature of deer, even through thick cover or in low-light conditions.</p>
            <div class="info-box"><h3>🗓️ ${state.name} Hunting Season</h3><p>Archery: ${state.hunting.archeryStart} - ${state.hunting.archeryEnd} | Gun: ${state.hunting.gunStart} - ${state.hunting.gunEnd}</p></div>
            <div class="info-box"><h3>🌡️ Best Conditions for Recovery</h3><p>${state.hunting.bestTime}</p></div>
            <div class="cta-box"><h3>Need Deer Recovery in ${county} County?</h3><p>Connect with certified thermal drone pilots serving ${county} County and surrounding areas.</p><a href="../../directory.html?state=${state.abbr}&service=Game%20Recovery" class="btn">Browse ${state.abbr} Pilots</a></div>
            <div class="other-counties"><h3>Other ${state.name} Counties</h3><div class="counties-list">${state.hunting.topCounties.filter(c => c !== county).map(c => `<a href="${c.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-deer-recovery.html">${c} County</a>`).join('')}</div></div>
        </div></section>
    </main>
    ${getFooter('../../')}
    <script>${getScripts()}document.addEventListener('DOMContentLoaded',()=>{CC.init();MN.init();document.getElementById('cookieAccept').addEventListener('click',()=>CC.setConsent(true));document.getElementById('cookieDecline').addEventListener('click',()=>CC.setConsent(false))});</script>
</body>
</html>`;
}

// ============================================
// SITEMAP
// ============================================
function generateSitemap(pages) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${CONFIG.baseUrl}/</loc><lastmod>${CONFIG.lastMod}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${CONFIG.baseUrl}/directory.html</loc><lastmod>${CONFIG.lastMod}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${CONFIG.baseUrl}/deer-recovery.html</loc><lastmod>${CONFIG.lastMod}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${CONFIG.baseUrl}/ag-spraying.html</loc><lastmod>${CONFIG.lastMod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${CONFIG.baseUrl}/game-recovery.html</loc><lastmod>${CONFIG.lastMod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${CONFIG.baseUrl}/verify.html</loc><lastmod>${CONFIG.lastMod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${CONFIG.baseUrl}/states/</loc><lastmod>${CONFIG.lastMod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
${pages.map(p => `  <url><loc>${p.url}</loc><lastmod>${CONFIG.lastMod}</lastmod><changefreq>${p.changefreq || 'weekly'}</changefreq><priority>${p.priority || '0.7'}</priority></url>`).join('\n')}
</urlset>`;
}

// ============================================
// MAIN
// ============================================
function generate() {
    console.log('🚀 US Drone Map - Enhanced SEO Generator\n');
    
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    const sitemapPages = [];
    let totalPages = 0;
    
    // State deer recovery pages
    console.log('📄 Generating 50 state deer recovery pages...');
    STATES.forEach(state => {
        const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
        fs.writeFileSync(path.join(CONFIG.outputDir, `${stateSlug}-deer-recovery.html`), generateStateDeerRecoveryPage(state));
        sitemapPages.push({ url: `${CONFIG.baseUrl}/states/${stateSlug}-deer-recovery.html`, priority: '0.8' });
        totalPages++;
    });
    
    // County pages for top states
    console.log('📄 Generating county pages for top 10 hunting states...');
    let countyPages = 0;
    STATES.filter(s => TOP_HUNTING_STATES.includes(s.abbr)).forEach(state => {
        const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
        const stateDir = path.join(CONFIG.outputDir, stateSlug);
        if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
        
        state.hunting.topCounties.forEach(county => {
            const countySlug = county.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            fs.writeFileSync(path.join(stateDir, `${countySlug}-deer-recovery.html`), generateCountyPage(state, county));
            sitemapPages.push({ url: `${CONFIG.baseUrl}/states/${stateSlug}/${countySlug}-deer-recovery.html`, priority: '0.6', changefreq: 'monthly' });
            totalPages++;
            countyPages++;
        });
    });
    
    // Sitemap
    console.log('🗺️  Generating sitemap.xml...');
    fs.writeFileSync('sitemap.xml', generateSitemap(sitemapPages));
    
    console.log(`\n✅ Done! Generated ${totalPages} pages (50 states + ${countyPages} counties)`);
    console.log(`   Sitemap: ${sitemapPages.length + 7} URLs`);
}

generate();
