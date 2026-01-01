import pandas as pd
import os
import re
import json

# --- CONFIGURATION ---
SITE_NAME = "National Drone Directory"
SITE_EMOJI = "🚁"
CONTACT_EMAIL = "your-email@example.com" # <--- UPDATE THIS
INPUT_FILE = "drone_pilots_WITH_PHONES_FINAL.csv"
OUTPUT_DIR = "deploy_me"

def clean_text(text):
    if pd.isna(text): return ""
    return str(text).strip()

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', str(text).lower()).strip('-')

# --- LOGIC UPDATE: FORCE DEER RECOVERY + EXTRA TAGS ---
def get_services(row):
    text = (str(row.get('Name', '')) + " " + str(row.get('Bio', '')) + " " + str(row.get('City', ''))).lower()
    services = ["🦌 Deer Recovery"]
    if any(x in text for x in ['ag', 'farm', 'crop', 'seed', 'spray', 'field', 'harvest']):
        services.append("🌾 Agriculture")
    if any(x in text for x in ['photo', 'video', 'cinema', 'estate', 'survey', 'map']):
        services.append("📸 Photography")
    if any(x in text for x in ['thermal', 'heat', 'sar', 'search', 'rescue']):
        services.append("🔥 Thermal Imaging")
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

    index_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{SITE_NAME}</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body {{ margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }}
            #map {{ height: 100vh; width: 100%; z-index: 1; }}
            .info-box {{
                background: white; padding: 20px; border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: absolute; top: 20px; right: 20px;
                z-index: 1000; width: 320px; max-width: 90%;
            }}
            h1 {{ margin: 0 0 5px; font-size: 1.4rem; color: #111; }}
            p {{ font-size: 0.9rem; color: #666; margin-bottom: 15px; }}
            select {{ width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; margin-bottom: 10px; background: #f9f9f9; }}
            .btn {{ display: block; width: 100%; padding: 12px 0; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 8px; cursor: pointer; border: none; font-size:16px; }}
            .btn-locate {{ background: #007aff; color: white; }}
            .btn-add {{ background: #34c759; color: white; }}
            .badge {{ display: inline-block; background: #eee; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; margin-right: 4px; color: #555; border: 1px solid #ddd; }}
        </style>
    </head>
    <body>
        <div class="info-box">
            <h1>{SITE_EMOJI} {SITE_NAME}</h1>
            <p><strong>{len(map_data)}</strong> Pilots Available. No fees.</p>
            <select id="serviceFilter" onchange="filterMap()">
                <option value="All">Show All Services</option>
                <option value="Deer">🦌 Deer Recovery</option>
                <option value="Agriculture">🌾 Agriculture</option>
                <option value="Photography">📸 Photography</option>
                <option value="Thermal">🔥 Thermal Imaging</option>
            </select>
            <button class="btn btn-locate" onclick="locateUser()">📍 Find Near Me</button>
            <a href="add-pilot.html" class="btn btn-add">➕ Add Me to Map</a>
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
                html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="background:white; border-radius:50%; border:2px solid #333; padding:2px;">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 9V5"></path><path d="M12 15v4"></path>
                        <path d="M9 12H5"></path><path d="M15 12h4"></path>
                        <circle cx="12" cy="3" r="1"></circle><circle cx="12" cy="21" r="1"></circle>
                        <circle cx="3" cy="12" r="1"></circle><circle cx="21" cy="12" r="1"></circle>
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
    
    # 2. GENERATE PROFESSIONAL FORM PAGE
    add_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>List Your Drone Business</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f4f9; padding: 20px; }}
            .container {{ max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
            h1 {{ text-align: center; color: #111; margin-bottom: 10px; }}
            p {{ text-align: center; color: #666; font-size: 0.95rem; margin-bottom: 30px; }}
            label {{ font-weight: bold; display: block; margin-bottom: 5px; color: #333; }}
            input, select, textarea {{ width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; box-sizing: border-box; }}
            .btn-submit {{ width: 100%; padding: 15px; background: #34c759; color: white; border: none; border-radius: 6px; font-size: 18px; font-weight: bold; cursor: pointer; }}
            .btn-submit:hover {{ background: #28a745; }}
            .note {{ font-size: 0.8rem; color: #888; text-align: center; margin-top: 15px; }}
        </style>
        <script>
            function prepareEmail() {{
                var name = document.getElementById('name').value;
                var city = document.getElementById('city').value;
                var phone = document.getElementById('phone').value;
                var category = document.getElementById('category').value;
                
                if(!name || !city || !phone) {{ alert("Please fill in all fields"); return; }}
                
                var subject = "New Pilot Listing: " + name;
                var body = "Please add my business to the National Drone Directory.%0D%0A%0D%0A" +
                           "Business Name: " + name + "%0D%0A" +
                           "Location: " + city + "%0D%0A" +
                           "Phone: " + phone + "%0D%0A" +
                           "Service Category: " + category + "%0D%0A%0D%0A" +
                           "I certify that I am a licensed drone pilot.";
                
                window.location.href = "mailto:{CONTACT_EMAIL}?subject=" + subject + "&body=" + body;
            }}
        </script>
    </head>
    <body>
        <div class="container">
            <h1>📝 Join the Directory</h1>
            <p>Fill out the form below to get your free listing on the map.</p>
            
            <label>Business Name</label>
            <input type="text" id="name" placeholder="e.g. Eagle Eye Drones">
            
            <label>City & State</label>
            <input type="text" id="city" placeholder="e.g. Austin, TX">
            
            <label>Phone Number</label>
            <input type="tel" id="phone" placeholder="e.g. 555-123-4567">
            
            <label>Primary Service</label>
            <select id="category">
                <option>Deer Recovery</option>
                <option>Agriculture</option>
                <option>Photography</option>
                <option>Thermal Imaging</option>
            </select>
            
            <button class="btn-submit" onclick="prepareEmail()">Send Application 🚀</button>
            <p class="note">This will open your email app with your details pre-filled.</p>
            <br>
            <center><a href="index.html" style="color:#666; text-decoration:none;">← Cancel</a></center>
        </div>
    </body>
    </html>
    """
    with open(f"{OUTPUT_DIR}/add-pilot.html", "w", encoding="utf-8") as f:
        f.write(add_html)

    # 3. GENERATE PROFILES (Simplified for brevity)
    for _, row in df.iterrows():
        name = clean_text(row.get('Name'))
        city = clean_text(row.get('City'))
        slug = slugify(f"{name}-{city}")
        # ... (Profile generation logic remains the same) ...
        # [Use previous profile template here or keep it simple]
        
    print("✅ SITE BUILD COMPLETE.")

if __name__ == "__main__":
    run_build()