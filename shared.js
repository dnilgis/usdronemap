/* =============================================
   US Drone Map - Shared JavaScript
   Version: 2.0.0
   Last Updated: 2026-01-11
   ============================================= */

// =============================================
// Configuration
// =============================================
const CONFIG = {
    PILOTS_VERSION: '20260111',
    SUPABASE_URL: 'https://xkwpjbdifnaytzuggdok.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrd3BqYmRpZm5heXR6dWdnZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4Mjg4MTYsImV4cCI6MjA4MzQwNDgxNn0.xwj09-LKxz0VwPkWq7YiiRTyOP7tOG5xwuTpKlBlN2o',
    GA_ID: 'G-WX7S46H7W1',
    COOKIE_CONSENT_KEY: 'usdm_cookie_consent',
    COOKIE_CONSENT_VERSION: '1'
};

// US States for validation
const US_STATES = new Set([
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
    'DC','PR','VI','GU','AS','MP'
]);

// All 50 states with names
const STATES_LIST = [
    { abbr: 'AL', name: 'Alabama' }, { abbr: 'AK', name: 'Alaska' },
    { abbr: 'AZ', name: 'Arizona' }, { abbr: 'AR', name: 'Arkansas' },
    { abbr: 'CA', name: 'California' }, { abbr: 'CO', name: 'Colorado' },
    { abbr: 'CT', name: 'Connecticut' }, { abbr: 'DE', name: 'Delaware' },
    { abbr: 'FL', name: 'Florida' }, { abbr: 'GA', name: 'Georgia' },
    { abbr: 'HI', name: 'Hawaii' }, { abbr: 'ID', name: 'Idaho' },
    { abbr: 'IL', name: 'Illinois' }, { abbr: 'IN', name: 'Indiana' },
    { abbr: 'IA', name: 'Iowa' }, { abbr: 'KS', name: 'Kansas' },
    { abbr: 'KY', name: 'Kentucky' }, { abbr: 'LA', name: 'Louisiana' },
    { abbr: 'ME', name: 'Maine' }, { abbr: 'MD', name: 'Maryland' },
    { abbr: 'MA', name: 'Massachusetts' }, { abbr: 'MI', name: 'Michigan' },
    { abbr: 'MN', name: 'Minnesota' }, { abbr: 'MS', name: 'Mississippi' },
    { abbr: 'MO', name: 'Missouri' }, { abbr: 'MT', name: 'Montana' },
    { abbr: 'NE', name: 'Nebraska' }, { abbr: 'NV', name: 'Nevada' },
    { abbr: 'NH', name: 'New Hampshire' }, { abbr: 'NJ', name: 'New Jersey' },
    { abbr: 'NM', name: 'New Mexico' }, { abbr: 'NY', name: 'New York' },
    { abbr: 'NC', name: 'North Carolina' }, { abbr: 'ND', name: 'North Dakota' },
    { abbr: 'OH', name: 'Ohio' }, { abbr: 'OK', name: 'Oklahoma' },
    { abbr: 'OR', name: 'Oregon' }, { abbr: 'PA', name: 'Pennsylvania' },
    { abbr: 'RI', name: 'Rhode Island' }, { abbr: 'SC', name: 'South Carolina' },
    { abbr: 'SD', name: 'South Dakota' }, { abbr: 'TN', name: 'Tennessee' },
    { abbr: 'TX', name: 'Texas' }, { abbr: 'UT', name: 'Utah' },
    { abbr: 'VT', name: 'Vermont' }, { abbr: 'VA', name: 'Virginia' },
    { abbr: 'WA', name: 'Washington' }, { abbr: 'WV', name: 'West Virginia' },
    { abbr: 'WI', name: 'Wisconsin' }, { abbr: 'WY', name: 'Wyoming' }
];

// =============================================
// Cookie Consent Management
// =============================================
const CookieConsent = {
    hasConsent() {
        const consent = localStorage.getItem(CONFIG.COOKIE_CONSENT_KEY);
        if (!consent) return null;
        try {
            const data = JSON.parse(consent);
            if (data.version !== CONFIG.COOKIE_CONSENT_VERSION) return null;
            return data.accepted;
        } catch {
            return null;
        }
    },
    
    setConsent(accepted) {
        localStorage.setItem(CONFIG.COOKIE_CONSENT_KEY, JSON.stringify({
            accepted,
            version: CONFIG.COOKIE_CONSENT_VERSION,
            timestamp: new Date().toISOString()
        }));
        
        if (accepted) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        this.hideBanner();
    },
    
    enableAnalytics() {
        // Enable Google Analytics if consent given
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    },
    
    disableAnalytics() {
        // Disable Google Analytics
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        // Clear existing cookies
        document.cookie.split(';').forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            if (name.startsWith('_ga') || name.startsWith('_gid')) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
            }
        });
    },
    
    showBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.add('show');
        }
    },
    
    hideBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.remove('show');
        }
    },
    
    init() {
        const consent = this.hasConsent();
        
        if (consent === null) {
            // No consent recorded, show banner
            this.showBanner();
            // Default to denied until consent given
            if (typeof gtag === 'function') {
                gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                });
            }
        } else if (consent === true) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
    }
};

// =============================================
// Mobile Navigation
// =============================================
const MobileNav = {
    toggle: null,
    menu: null,
    isOpen: false,
    
    init() {
        this.toggle = document.getElementById('navToggle');
        this.menu = document.getElementById('navMobile');
        
        if (!this.toggle || !this.menu) return;
        
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.nav-mobile') && !e.target.closest('.nav-toggle')) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Close menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    },
    
    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    },
    
    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('open');
        this.toggle.setAttribute('aria-expanded', 'true');
        this.toggle.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        `;
        document.body.style.overflow = 'hidden';
    },
    
    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('open');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.toggle.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        `;
        document.body.style.overflow = '';
    }
};

// =============================================
// FAQ Accordion
// =============================================
const FAQAccordion = {
    init() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.faq-item');
                const wasOpen = item.classList.contains('open');
                
                // Close all other items
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                
                // Toggle current item
                if (!wasOpen) {
                    item.classList.add('open');
                }
            });
            
            // Keyboard accessibility
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
};

// =============================================
// Pilot Data Utilities
// =============================================
const PilotUtils = {
    // Decode base64 encoded data
    decodeData(encoded) {
        if (!encoded) return '';
        try {
            return atob(encoded);
        } catch (e) {
            return encoded;
        }
    },
    
    // Transform raw pilot data to standardized format
    transformPilot(p) {
        return {
            verified: p.v === true,
            industry: p.i || '',
            latitude: p.la,
            longitude: p.lo,
            company: p.c || 'Unknown',
            city: p.ct || '',
            state: p.st || '',
            phoneEncoded: p.pe || '',
            emailEncoded: p.ee || '',
            phone: p.p || '',
            email: p.e || '',
            website: p.w || '',
            model: p.m || '',
            manufacturer: p.mf || '',
            fleet: p.f || ''
        };
    },
    
    // Create URL-safe slug from text
    slugify(text) {
        return (text || '')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    },
    
    // Format phone number for display
    formatPhone(phone) {
        if (!phone) return '';
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return phone;
    },
    
    // Calculate distance between two coordinates (Haversine formula)
    getDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
    
    // Fetch pilots data
    async fetchPilots() {
        try {
            const res = await fetch(`pilots.json?v=${CONFIG.PILOTS_VERSION}`);
            const rawData = await res.json();
            const pilotsArray = Array.isArray(rawData) ? rawData : (rawData.pilots || []);
            return pilotsArray.map(this.transformPilot);
        } catch (err) {
            console.error('Error fetching pilots:', err);
            return [];
        }
    }
};

// =============================================
// Input Sanitization (XSS Prevention)
// =============================================
const Sanitize = {
    // Escape HTML entities
    html(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    // Validate and sanitize URL parameter
    urlParam(param) {
        if (!param) return '';
        // Remove potentially dangerous characters
        return param.replace(/[<>"'&]/g, '');
    },
    
    // Validate email format
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate phone format
    isValidPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
    }
};

// =============================================
// View Counter (Supabase)
// =============================================
const ViewCounter = {
    async getVisitorHash() {
        const data = navigator.userAgent + screen.width + screen.height + new Date().toDateString();
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
    },
    
    async trackView(pilotId) {
        try {
            const visitorHash = await this.getVisitorHash();
            
            await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/profile_views`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': CONFIG.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    pilot_id: pilotId,
                    visitor_hash: visitorHash
                })
            });
        } catch (err) {
            console.log('View tracking error:', err);
        }
    },
    
    async getViewCount(pilotId) {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const res = await fetch(
                `${CONFIG.SUPABASE_URL}/rest/v1/profile_views?pilot_id=eq.${encodeURIComponent(pilotId)}&viewed_at=gte.${thirtyDaysAgo.toISOString()}&select=id`,
                {
                    headers: {
                        'apikey': CONFIG.SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                        'Prefer': 'count=exact'
                    }
                }
            );
            
            const count = res.headers.get('content-range');
            if (count) {
                const total = count.split('/')[1];
                return parseInt(total) || 0;
            }
            return 0;
        } catch (err) {
            console.log('View count error:', err);
            return null;
        }
    }
};

// =============================================
// Populate State Grid Helper
// Links to STATIC state pages for SEO (not query params)
// =============================================
function populateStateGrid(containerId, service = null, showCounts = false, stateCounts = {}) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    
    // Convert service to slug format for static page URLs
    const serviceSlugMap = {
        'Agriculture': 'agriculture',
        'Ag Spraying': 'agriculture',
        'Deer Recovery': 'deer-recovery',
        'Game Recovery': 'game-recovery',
        'Inspection': 'inspection',
        'Survey/Engineering': 'survey',
        'Survey': 'survey',
        'Photo/Video': 'photography',
        'Photography': 'photography'
    };
    
    const serviceSlug = service ? serviceSlugMap[service] || service.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null;
    
    grid.innerHTML = STATES_LIST.map(s => {
        const count = stateCounts[s.abbr] || 0;
        const countText = showCounts && count > 0 
            ? `<span class="count">${count} pilots</span>` 
            : '<span class="count">View pilots</span>';
        
        // Generate static page URL
        const stateSlug = s.name.toLowerCase().replace(/\s+/g, '-');
        const href = serviceSlug 
            ? `states/${stateSlug}-${serviceSlug}.html`
            : `states/${stateSlug}.html`;
        
        return `
            <a href="${href}" class="state-link">
                ${s.name}
                ${countText}
            </a>
        `;
    }).join('');
}

// =============================================
// Get Static State Page URL Helper
// Use this anywhere you need to link to a state page
// =============================================
function getStatePageUrl(stateAbbr, service = null) {
    const state = STATES_LIST.find(s => s.abbr === stateAbbr);
    if (!state) return `directory.html?state=${stateAbbr}`;
    
    const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
    
    if (!service) {
        return `states/${stateSlug}.html`;
    }
    
    const serviceSlugMap = {
        'Agriculture': 'agriculture',
        'Ag Spraying': 'agriculture', 
        'Deer Recovery': 'deer-recovery',
        'Game Recovery': 'game-recovery',
        'Inspection': 'inspection',
        'Survey/Engineering': 'survey',
        'Photo/Video': 'photography'
    };
    
    const serviceSlug = serviceSlugMap[service] || service.toLowerCase().replace(/\s+/g, '-');
    return `states/${stateSlug}-${serviceSlug}.html`;
}

// =============================================
// Initialize on DOM Ready
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cookie consent
    CookieConsent.init();
    
    // Initialize mobile navigation
    MobileNav.init();
    
    // Initialize FAQ accordions
    FAQAccordion.init();
    
    // Set up cookie consent button handlers
    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => CookieConsent.setConsent(true));
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => CookieConsent.setConsent(false));
    }
});

// =============================================
// Export for module usage
// =============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        US_STATES,
        STATES_LIST,
        CookieConsent,
        MobileNav,
        FAQAccordion,
        PilotUtils,
        Sanitize,
        ViewCounter,
        populateStateGrid
    };
}
