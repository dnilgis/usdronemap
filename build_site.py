import pandas as pd
import os
import re
import json

# --- CONFIGURATION ---
SITE_NAME = "National Drone Directory"
SITE_EMOJI = "🚁"
CONTACT_EMAIL = "dnilgis@gmail.com"  # <--- FIXED
INPUT_FILE = "drone_pilots_WITH_PHONES_FINAL.csv"
OUTPUT_DIR = "deploy_me"

def clean_text(text):
    if pd.isna(text): return ""
    return str(text).strip()

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', str(text).lower()).strip('-')

# --- LOGIC: FORCE TAGS ---
def get_services(row):
    text = (str(row.get('Name', '')) + " " + str(row.get('Bio', '')) + " " + str(row.get('City', ''))).lower()
    services = ["🦌 Deer Recovery"] # Default for everyone
    if any(x in text for x in ['ag', 'farm', 'crop', 'spray']): services.append("🌾 Agriculture")
    if any(x in text for x in ['photo', 'video', 'real estate']): services.append("📸 Photography")
    if any(x in text for x in ['thermal', 'heat', 'sar']): services.append("🔥 Thermal")
    return list(set(services))

def run_build():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: '{INPUT_FILE}' not found.")
        return

    print("Reading database...")
    df = pd.read_csv(INPUT_FILE)
    
    print("Building Website...")
    os.makedirs(f"{OUTPUT_DIR}/pilot", exist_ok=True)
    
    map_data = []
    
    # 1. BUILD MAP DATA
    for _, row in df.iterrows():
        try:
            coords = str(row.get('Coordinates', '0,0')).split(',')
            if len(coords) == 2:
                lat, lng = coords[0].strip(), coords[1].strip()
                name = clean_text(row.get('Name'))
                city = clean_text(row.get('City'))
                service_list = get_services(row)
                slug = slugify(f"{name}-{city}")
                raw_services = [s.split(' ')[1] if ' ' in s else s for s in service_list]

                pilot_info = {
                    "name": name,
                    "phone": clean_text(row.get('Found_Phone', 'Click for #')),
                    "lat": lat,
                    "lng": lng,
                    "services": raw_services, 
                    "display_services": service_list,
                    "url": f"pilot/{slug}.html"
                }
                map_data.append(pilot_info)
        except: continue

    js_array = json.dumps(map_data)

    # --- FOOTER HTML (Reused everywhere) ---
    footer_html = f"""
    <div style="margin-top: 50px; padding: 20px; border-top: 1px solid #ddd; text-align: center; color: #777; font-size: 0.8rem; background: #f9f9f9;">
        <p>&copy; 2024 {SITE_NAME}. All rights reserved.</p>
        <p><strong>Disclaimer:</strong> This directory is a connector service. We do not employ these pilots and are not liable for their services. <br>Always verify licensing and insurance before hiring.</p>
        <p><a href="mailto:{CONTACT_EMAIL}" style="color:#555;">Contact Support</a></p>
    </div>
    """

    # --- HOMEPAGE ---
    index_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{SITE_NAME} | Find Local Pilots</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body {{ margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; overflow: hidden; }}
            #map {{ height: 100vh; width: 100%; z-index: 1; }}
            
            .info-box {{
                background: white; padding: 25px; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15); position: absolute; top: 20px; right: 20px;
                z-index: 1000; width: 320px; max-width: 90%;
                border: 1px solid #e1e4e8;
            }}
            
            h1 {{ margin: 0 0 5px; font-size: 1.5rem; color: #111; letter-spacing: -0.5px; }}
            .subtitle {{ font-size: 0.9rem; color: #666; margin-bottom: 20px; line-height: 1.4; }}
            
            select {{ width: 100%; padding: 12px; border: 2px solid #eee; border-radius: 8px; font-size: 15px; margin-bottom: 10px; background: #fff; cursor: pointer; }}
            
            .btn {{ display: block; width: 100%; padding: 14px 0; text-align: center; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px; cursor: pointer; border: none; font-size: 15px; transition: 0.2s; }}
            .btn-locate {{ background: #007aff; color: white; }}
            .btn-locate:hover {{ background: #0062cc; }}
            .btn-add {{ background: #34c759; color: white; }}
            .btn-add:hover {{ background: #28a745; }}
            
            .trust-badge {{ margin-top: 15px; font-size: 0.75rem; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }}
            
            .badge {{ display: inline-block; background: #f1f3f5; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; margin-right: 4px; color: #555; border: 1px solid #ddd; }}
        </style>
    </head>
    <body>
        <div class="info-box">
            <h1>{SITE_EMOJI} {SITE_NAME}</h1>
            <p class="subtitle">The largest free directory of independent drone operators. <strong>{len(map_data)}</strong> Verified Pilots.</p>
            
            <select id="serviceFilter" onchange="filterMap()">
                <option value="All">Filter by Service...</option>
                <option value="Deer">🦌 Deer Recovery</option>
                <option value="Agriculture">🌾 Agriculture</option>
                <option value="Photography">📸 Photography</option>
                <option value="Thermal">🔥 Thermal Imaging</option>
            </select>

            <button class="btn btn-locate" onclick="locateUser()">📍 Find Near Me</button>
            <a href="add-pilot.html" class="btn btn-add">➕ Add My Business</a>
            
            <div class="trust-badge">
                🔒 Verified Direct Connections <br> 🇺🇸 Nationwide Coverage
            </div>
        </div>

        <div id="map"></div>
        
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView([39.8283, -98.5795], 5);
            L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{ attribution: '© OpenStreetMap' }}).addTo(map);
            var allPilots = {js_array};
            var markers = [];
            
            var droneIcon = L.divIcon({{
                className: 'custom-drone',
                html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="background:white; border-radius:50%; border:2px solid #333; padding:2px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 9V5"></path><path d="M12 15v4"></path>
                        <path d="M9 12H5"></path><path d="M15 12h4"></path>
                        <circle cx="12" cy="3" r="1" fill="#333"></circle><circle cx="12" cy="21" r="1" fill="#333"></circle>
                        <circle cx="3" cy="12" r="1" fill="#333"></circle><circle cx="21" cy="12" r="1" fill="#333"></circle>
                       </svg>`,
                iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -20]
            }});

            function renderMap(pilots) {{
                markers.forEach(m => map.removeLayer(m));
                markers = [];
                pilots.forEach(p => {{
                    var servicesHtml = p.display_services.map(s => `<span class='badge'>${{s}}</span>`).join("");
                    var marker = L.marker([p.lat, p.lng], {{icon: droneIcon}})
                        .bindPopup(`<b>${{p.name}}</b><br>${{servicesHtml}}<br><br><a href="${{p.url}}">View Profile</a>`);
                    marker.addTo(map);
                    markers.push(marker);
                }});
            }}
            renderMap(allPilots);

            function filterMap() {{
                var cat = document.getElementById('serviceFilter').value;
                if(cat === "All") {{ renderMap(allPilots); return; }}
                var filtered = allPilots.filter(p => p.services.some(s => s.includes(cat)));
                renderMap(filtered);
            }}

            function locateUser() {{
                if (!navigator.geolocation) {{ alert("Geolocation not supported"); return; }}
                navigator.geolocation.getCurrentPosition(pos => {{
                    var lat = pos.coords.latitude;
                    var lng = pos.coords.longitude;
                    map.flyTo([lat, lng], 10);
                    L.circleMarker([lat, lng], {{color: 'blue', radius: 15}}).addTo(map).bindPopup("You").openPopup();
                }});
            }}
        </script>
    </body>
    </html>
    """
    with open(f"{OUTPUT_DIR}/index.html", "w", encoding="utf-8") as f:
        f.write(index_html)
    
    # --- ADD PILOT PAGE (SIMPLE & FOOLPROOF) ---
    add_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Join the Directory</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8f9fa; padding: 40px; color: #333; }}
            .card {{ max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; }}
            h1 {{ color: #111; margin-bottom: 10px; }}
            p {{ color: #666; line-height: 1.6; }}
            .email-box {{ background: #e8f5e9; color: #2e7d32; padding: 15px; border-radius: 8px; font-weight: bold; font-family: monospace; font-size: 1.2rem; margin: 20px 0; border: 1px solid #c8e6c9; }}
            .btn {{ display: inline-block; background: #34c759; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; margin-top: 10px; transition: 0.2s; }}
            .btn:hover {{ background: #28a745; transform: translateY(-2px); }}
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🚀 Get Listed</h1>
            <p>Join the fastest-growing network of independent drone pilots. Listings are currently <strong>free</strong> for early adopters.</p>
            
            <p>To apply, simply email us your:</p>
            <ul style="text-align:left; display:inline-block; color:#555;">
                <li>Business Name</li>
                <li>City & State</li>
                <li>Phone Number</li>
                <li>Primary Services (Deer, Ag, Photo)</li>
            </ul>

            <br>
            <a href="mailto:{CONTACT_EMAIL}?subject=New Pilot Listing&body=Hi, please list my business:%0D%0A%0D%0AName:%0D%0ACity/State:%0D%0APhone:%0D%0AServices:" class="btn">Click to Email Application</a>

            <p style="margin-top: 30px; font-size: 0.9rem;">Button not working? Send your info manually to:</p>
            <div class="email-box">{CONTACT_EMAIL}</div>
            
            <br>
            <a href="index.html" style="color:#888; text-decoration:none;">← Return to Map</a>
        </div>
        {footer_html}
    </body>
    </html>
    """
    with open(f"{OUTPUT_DIR}/add-pilot.html", "w", encoding="utf-8") as f:
        f.write(add_html)

    # --- PROFILES (WITH WORKING CLAIM BUTTON) ---
    print("Generating Professional Profiles...")
    for _, row in df.iterrows():
        name = clean_text(row.get('Name'))
        city = clean_text(row.get('City'))
        state = clean_text(row.get('State'))
        phone = clean_text(row.get('Found_Phone', 'Number Pending'))
        bio = clean_text(row.get('Bio'))
        slug = slugify(f"{name}-{city}")
        service_tags = "".join([f"<span class='tag'>{s}</span>" for s in get_services(row)])
        
        # PRE-FILLED CLAIM SUBJECT
        claim_subject = f"Claim Profile: {name} ({city})"
        
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{name} | Drone Pilot</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f4f9; color: #333; margin: 0; padding: 20px; }}
                .container {{ max-width: 700px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }}
                .back-link {{ text-decoration: none; color: #666; font-size: 0.9rem; margin-bottom: 20px; display: inline-block; }}
                h1 {{ margin: 0 0 5px; color: #111; font-size: 2rem; }}
                .location {{ color: #666; font-size: 1.2rem; margin-bottom: 25px; display: block; }}
                .tag {{ display: inline-block; background: #eef2f5; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; color: #444; margin-right: 8px; margin-bottom: 8px; border: 1px solid #e1e4e8; }}
                
                .cta-section {{ background: #f8fff9; border: 2px solid #34c759; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }}
                .phone-btn {{ display: inline-block; background: #34c759; color: white; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: bold; font-size: 1.4rem; box-shadow: 0 4px 10px rgba(52, 199, 89, 0.3); transition: 0.2s; }}
                .phone-btn:hover {{ transform: scale(1.05); }}
                
                .bio {{ line-height: 1.8; color: #555; border-top: 1px solid #eee; padding-top: 25px; margin-bottom: 40px; }}
                
                .claim-box {{ background: #fffbf0; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #ffe082; font-size: 0.95rem; }}
                .claim-link {{ color: #b07d00; font-weight: bold; text-decoration: none; border-bottom: 1px dotted #b07d00; }}
            </style>
        </head>
        <body>
            <div class="container">
                <a href="../index.html" class="back-link">← Back to Map</a>
                <h1>{name}</h1>
                <span class="location">📍 {city}, {state}</span>
                <div>{service_tags}</div>
                
                <div class="cta-section">
                    <p style="margin-top:0; color:#28a745; font-weight:bold; letter-spacing: 1px; text-transform: uppercase; font-size: 0.8rem;">Direct Contact Number</p>
                    <a href="tel:{phone}" class="phone-btn">📞 {phone}</a>
                    <p style="margin-bottom:0; font-size:0.8rem; color:#888; margin-top:15px;">Zero Fees • Direct Connection</p>
                </div>
                
                <div class="bio">
                    <strong>About this Operator:</strong><br>
                    {bio if bio and str(bio) != 'nan' else "This pilot is a registered operator serving the " + city + " region. Specializing in thermal recovery and aerial imaging."}
                </div>
                
                <div class="claim-box">
                    <strong>Is this your business?</strong><br>
                    <a href="mailto:{CONTACT_EMAIL}?subject={claim_subject}&body=I am the owner of this business and would like to claim/edit my profile." class="claim-link">Claim This Profile to Add Photos & Links</a>
                </div>
            </div>
            {footer_html}
        </body>
        </html>
        """
        with open(f"{OUTPUT_DIR}/pilot/{slug}.html", "w", encoding="utf-8") as f:
            f.write(html)

    print("SITE BUILD COMPLETE.")

if __name__ == "__main__":
    run_build()