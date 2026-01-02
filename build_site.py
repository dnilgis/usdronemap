import csv
import os
import shutil
import re
import json
import random
from datetime import datetime

# --- CONFIGURATION ---
DB_FILE = "drone_pilots_WITH_PHONES_FINAL" 
if not os.path.exists(DB_FILE) and os.path.exists(DB_FILE + ".csv"):
    DB_FILE = DB_FILE + ".csv"

BRAND_NAME = "Direct Drone Recovery"
TAGLINE = "Find thermal, ag, and photo drone pilots directly. No fees. No Middleman."
DOMAIN = "https://uniteddroneops.com" # Update to your live URL

def clean_slug(text):
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def get_jitter():
    return random.uniform(-0.04, 0.04)

# --- THE CLEAN LIGHT-THEME TEMPLATE ---
index_html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{brand} | Find Local Pilots</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <style>
        body, html {{ margin: 0; padding: 0; height: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow: hidden; }}
        #map {{ height: 100vh; width: 100vw; z-index: 1; }}

        /* FLOATING INFO BOX - TOP RIGHT */
        .info-box {{
            position: absolute;
            top: 20px;
            right: 20px;
            width: 300px;
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            z-index: 1000;
            border: 1px solid #e0e0e0;
        }}

        .info-box h1 {{ margin: 0 0 5px 0; font-size: 1.2rem; display: flex; align-items: center; gap: 8px; color: #333; }}
        .info-box p {{ font-size: 0.85rem; color: #666; margin: 10px 0; line-height: 1.4; }}
        .pilot-count {{ font-weight: bold; color: #d32f2f; }}

        .filter-label {{ font-size: 0.75rem; font-weight: bold; color: #444; text-transform: uppercase; display: block; margin-bottom: 5px; }}
        .service-select {{ width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 15px; font-size: 0.9rem; }}

        .btn {{
            display: block;
            width: 100%;
            padding: 10px 0;
            margin-bottom: 10px;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            font-size: 0.9rem;
            transition: opacity 0.2s;
        }}
        .btn-blue {{ background: #3b82f6; color: white; }}
        .btn-green {{ background: #10b981; color: white; }}
        .btn:hover {{ opacity: 0.9; }}

        @media (max-width: 600px) {{
            .info-box {{ width: calc(100% - 40px); top: 10px; right: 20px; padding: 15px; }}
        }}
    </style>
</head>
<body>

<div class="info-box">
    <h1>🦌 {brand}</h1>
    <div style="text-align:center; font-size: 0.8rem; margin-bottom: 10px;">
        <span class="pilot-count">{count} Pilots Available</span>
    </div>
    <p>{tagline}</p>
    
    <span class="filter-label">Filter by Service:</span>
    <select class="service-select" id="serviceFilter">
        <option>Show All Services</option>
        <option>Thermal Recovery</option>
        <option>Agriculture</option>
        <option>Photo/Video</option>
    </select>

    <a href="#" class="btn btn-blue" onclick="alert('Locating you...'); return false;">📍 Find Near Me</a>
    <a href="mailto:ops@uniteddroneops.com" class="btn btn-green">➕ Add Me To Map</a>
</div>

<div id="map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
    var map = L.map('map', {{ zoomControl: false }}).setView([39.8283, -98.5795], 5);
    
    // Light-themed, high-contrast map tiles
    L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
        attribution: '&copy; OpenStreetMap contributors'
    }}).addTo(map);

    var pilots = {json_data};

    // Use standard Blue Pins
    pilots.forEach(p => {{
        L.marker([p.lat, p.lng]).addTo(map)
            .bindPopup('<b>' + p.name + '</b><br>' + p.city + ', ' + p.state + '<br><a href="' + p.url + '">View Details</a>');
    }});
</script>
</body>
</html>
"""

# --- PILOT PROFILE TEMPLATE ---
profile_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{name} | {brand}</title>
    <style>
        body {{ font-family: sans-serif; background: #f4f4f9; display: flex; justify-content: center; padding: 40px; }}
        .card {{ background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; width: 100%; }}
        h1 {{ color: #333; margin-top: 0; }}
        .meta {{ color: #666; margin-bottom: 20px; }}
        .phone {{ font-size: 1.5rem; font-weight: bold; color: #3b82f6; text-decoration: none; }}
        .back-link {{ display: block; margin-top: 30px; color: #666; text-decoration: none; font-size: 0.9rem; }}
    </style>
</head>
<body>
    <div class="card">
        <h1>{name}</h1>
        <p class="meta">{city}, {state}</p>
        <p>{bio}</p>
        <p>Contact this pilot directly:</p>
        <a href="tel:{phone}" class="phone">{phone}</a>
        <a href="../index.html" class="back-link">&larr; Back to Map</a>
    </div>
</body>
</html>
"""

def run_build():
    print("--- RESTORING ORIGINAL VISUALS ---")
    if not os.path.exists("pilot"): os.makedirs("pilot")
    map_data = []
    
    try:
        with open(DB_FILE, newline='', encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                f, l = row.get('First Name', '').strip(), row.get('Last Name', '').strip()
                name, city, state = f"{f} {l}", row.get('city', '').strip(), row.get('state', '').strip()
                phone, bio = row.get('Phone', '').strip(), row.get('Bio', 'Available for drone missions.')
                
                slug = clean_slug(f"{name}-{city}-{state}")
                url = f"pilot/{slug}.html"
                lat, lng = row.get('latitude'), row.get('longitude')
                
                if lat and lng and str(lat) != 'nan' and str(lat) != '':
                    # Fixed dictionary logic to prevent unhashable type error
                    pilot_entry = {
                        "name": name, 
                        "lat": float(lat) + get_jitter(), 
                        "lng": float(lng) + get_jitter(), 
                        "city": city, 
                        "state": state, 
                        "url": url
                    }
                    map_data.append(pilot_entry)

                with open(url, "w", encoding="utf-8") as p:
                    p.write(profile_template.format(name=name, city=city, state=state, brand=BRAND_NAME, bio=bio, phone=phone))

        with open("index.html", "w", encoding="utf-8") as f:
            f.write(index_html.format(brand=BRAND_NAME, tagline=TAGLINE, count=len(map_data), json_data=json.dumps(map_data)))
            
        print(f"SUCCESS: {len(map_data)} pilots mapped with restored visuals.")

    except Exception as e:
        print(f"Build failed: {e}")

if __name__ == "__main__":
    run_build()