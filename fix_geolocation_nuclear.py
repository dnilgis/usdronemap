import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import time
import os
import glob

# --- CONFIGURATION ---
OUTPUT_FILE = "pilots_geocoded.csv"
USER_AGENT = "drone_recovery_network_nuclear_v1"
# ---------------------

def get_coordinates(location_name, attempt=1, max_attempts=3):
    geolocator = Nominatim(user_agent=USER_AGENT)
    try:
        location = geolocator.geocode(location_name, country_codes='us', timeout=10)
        if location:
            return location.latitude, location.longitude
        return None, None
    except (GeocoderTimedOut, GeocoderServiceError):
        if attempt <= max_attempts:
            time.sleep(2 * attempt)
            return get_coordinates(location_name, attempt + 1, max_attempts)
        return None, None

def find_csv_file():
    # Find any CSV file that isn't our output file
    files = [f for f in glob.glob("*.csv") if "geocoded" not in f]
    
    if not files:
        return None
    
    # If multiple exist, pick the largest one (most likely the database)
    files.sort(key=lambda x: os.path.getsize(x), reverse=True)
    return files[0]

def run_nuclear_fix():
    print("--- INITIATING NUCLEAR GEOLOCATION FIX (SMART MODE) ---")
    
    # 1. Auto-Detect Input File
    input_file = find_csv_file()
    
    if not input_file:
        print("CRITICAL ERROR: No CSV file found in this folder.")
        print("Please drag your pilot database file into this folder.")
        return

    print(f"Target Acquired: Using database '{input_file}'")

    # 2. Load Data
    try:
        df = pd.read_csv(input_file)
        print(f"Loaded {len(df)} pilots.")
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    # 3. Ensure Columns Exist
    if 'latitude' not in df.columns: df['latitude'] = None
    if 'longitude' not in df.columns: df['longitude'] = None

    # 4. Processing Loop
    updated_count = 0
    
    for index, row in df.iterrows():
        # Skip if already done
        if pd.notna(row['latitude']) and row['latitude'] != "":
            continue

        # Construct Location String
        # Try different column names for city/state
        city = row.get('city') or row.get('City') or ''
        state = row.get('state') or row.get('State') or ''
        
        loc_str = f"{city}, {state}"
        if len(loc_str) < 4: 
            continue 

        print(f"[{index+1}/{len(df)}] Pinging satellite for: {loc_str}...")
        
        lat, lon = get_coordinates(loc_str)
        
        if lat:
            df.at[index, 'latitude'] = lat
            df.at[index, 'longitude'] = lon
            updated_count += 1
            print(f"   >>> ACQUIRED: {lat}, {lon}")
        else:
            print("   >>> FAILED: Location not found.")

        time.sleep(1.1)

        if updated_count % 10 == 0:
            df.to_csv(OUTPUT_FILE, index=False)

    df.to_csv(OUTPUT_FILE, index=False)
    print(f"\n--- MISSION COMPLETE ---\nUpdated {updated_count} pilots.\nSaved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    run_nuclear_fix()