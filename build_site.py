import pandas as pd
import os
import re
from datetime import datetime

# CONFIGURATION
SITE_NAME = "Direct Drone Recovery"
DOMAIN = "https://your-username.github.io/direct-drone-recovery" # Change this later
INPUT_FILE = "drone_pilots_WITH_PHONES_FINAL.csv" # The output from V27
OUTPUT_DIR = "deploy_me"

def clean_text(text):
    return str(text).replace("nan", "").replace('"', '').strip()

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', str(text).lower()).strip('-')

def build_website():
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Missing '{INPUT_FILE}'. Run the V27 Deep Miner first!")
        return

    print("Reading database...")
    df = pd.read_csv(INPUT_FILE)
    
    # Create structure
    os.makedirs(f"{OUTPUT_DIR}/pilot", exist_ok=True)
    os.makedirs(f"{OUTPUT_DIR}/assets", exist_ok=True)

    # --- STEP 1: GENERATE HOMEPAGE (MAP) ---
    print("Building Homepage Map...")
    
    # Convert data to Javascript variable for the map
    map_data = []
    for _, row in df.iterrows():
        try:
            # Check if lat/lng exists (V21/V24 captured this)
            # If your CSV splits them, adjust here. Assuming "Coordinates" column "lat, lng"
            coords = str(row.get('Coordinates', '0,0')).split(',')
            if len(coords) == 2 and coords[0].strip() != '0':
                lat, lng = coords[0].strip(), coords[1].strip()
                slug = slugify(f"{row.get('Name')}-{row.get('City')}")
                
                pilot_info = {
                    "name": clean_text(row.get('Name')),
                    "phone": clean_text(row.get('Found_Phone', 'Click Profile')),
                    "lat": lat,
                    "lng": lng,
                    "url": f"pilot/{slug}.html"
                }
                map_data.append(pilot_info)
        except: continue

    js_array = str(map_data).replace("'", '"')

    index_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{SITE_NAME} - The Free Drone Directory</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body {{ margin: 0; font-family: sans-serif; }}
            #map {{ height: 100vh; width: 100%; }}
            .info-box {{ background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2); position: absolute; top: 10px; right: 10px; z-index: 1000; max-width: 300px; }}
            h1 {{ margin: 0 0 10px; font-size: 1.2rem; }}
            .btn {{ display: block; background: #e74c3c; color: white; text-align: center; padding: 10px; text-decoration: none; border-radius: 4px; margin-top: 5px; }}
        </style>
    </head>
    <body>
        <div class="info-box">
            <h1>🦌 {SITE_NAME}</h1>
            <p>Find a thermal drone pilot. No SMS walls. Direct phone numbers.</p>
            <p><strong>{len(df)} Pilots Available</strong></p>
        </div>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView([39.8283, -98.5795], 5); // Center USA
            L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
                attribution: '© OpenStreetMap contributors'
            }}).addTo(map);

            var pilots = {js_array};

            pilots.forEach(p => {{
                L.marker([p.lat, p.lng]).addTo(map)
                    .bindPopup(`<b>${{p.name}}</b><br><a href="${{p.url}}">View Profile & Phone</a>`);
            }});
        </script>
    </body>
    </html>
    """
    
    with open(f"{OUTPUT_DIR}/index.html", "w", encoding="utf-8") as f:
        f.write(index_html)

    # --- STEP 2: GENERATE SEO PROFILES ---
    print("Building SEO Profile Pages...")
    
    sitemap_links = []
    
    for _, row in df.iterrows():
        name = clean_text(row.get('Name'))
        city = clean_text(row.get('City'))
        state = clean_text(row.get('State'))
        bio = clean_text(row.get('Bio'))
        phone = clean_text(row.get('Found_Phone', 'Number Pending'))
        
        slug = slugify(f"{name}-{city}")
        filename = f"pilot/{slug}.html"
        
        # Keyword Stuffing for SEO
        title = f"{name} - Drone Deer Recovery in {city}, {state}"
        
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title}</title>
            <meta name="description" content="Hire {name} for thermal drone deer recovery in {city}, {state}. Call directly at {phone}. No middleman fees.">
            <style>
                body {{ font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }}
                .hero {{ background: #f4f4f4; padding: 40px; text-align: center; border-radius: 10px; }}
                .btn {{ background: #27ae60; color: white; padding: 15px 30px; text-decoration: none; font-size: 1.2rem; border-radius: 5px; display: inline-block; margin-top: 20px; }}
                .warning {{ background: #fff3cd; padding: 10px; border: 1px solid #ffeeba; border-radius: 5px; margin-top: 20px; font-size: 0.9rem; }}
            </style>
        </head>
        <body>
            <a href="../index.html">← Back to Map</a>
            <div class="hero">
                <h1>{name}</h1>
                <p>📍 {city}, {state}</p>
                <a href="tel:{phone}" class="btn">📞 Call Now: {phone}</a>
            </div>
            
            <h2>About {name}</h2>
            <p>{bio}</p>
            
            <div class="warning">
                <strong>Pilot Notice:</strong> Is this you? We listed you for free so hunters can call you directly. 
                <a href="#">Claim this profile</a> to update your info.
            </div>
        </body>
        </html>
        """
        
        with open(f"{OUTPUT_DIR}/{filename}", "w", encoding="utf-8") as f:
            f.write(html)
            sitemap_links.append(f"{DOMAIN}/{filename}")

    # --- STEP 3: SITEMAP ---
    print("Generating Sitemap...")
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for link in sitemap_links:
        sitemap += f"  <url><loc>{link}</loc></url>\n"
    sitemap += "</urlset>"
    
    with open(f"{OUTPUT_DIR}/sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap)

    print("\n" + "="*60)
    print("✅ SITE BUILT.")
    print(f"📂 Open the '{OUTPUT_DIR}' folder and double-click 'index.html' to test.")
    print("="*60)

if __name__ == "__main__":
    build_website()