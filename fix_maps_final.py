import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import time
import os

# CONFIGURATION
input_file = "drone_pilots_WITH_PHONES_FINAL.csv"

# LOAD DATA
print(f"Reading {input_file}...")
try:
    df = pd.read_csv(input_file)
except FileNotFoundError:
    print("Error: CSV file not found.")
    exit()

# Ensure Coordinates column exists
if 'Coordinates' not in df.columns:
    df['Coordinates'] = "0,0"

# SETUP GEOLOCATOR
geolocator = Nominatim(user_agent="drone_pilot_locator_final_v3")

def get_location(row):
    # If we already have good coordinates, keep them!
    current = str(row.get('Coordinates', '0,0'))
    if current != "0,0" and "," in current and "nan" not in current:
        return current

    # Prepare search
    city = str(row.get('City', '')).replace("nan", "").strip()
    state = str(row.get('State', '')).replace("nan", "").strip()
    
    if not city or not state:
        return "0,0"

    # Strategy 1: City + State
    search1 = f"{city}, {state}, USA"
    try:
        loc = geolocator.geocode(search1, timeout=5)
        if loc:
            return f"{loc.latitude}, {loc.longitude}"
    except:
        pass
    
    time.sleep(0.5) # Be polite to server

    # Strategy 2: State Center (Fallback)
    search2 = f"{state}, USA"
    try:
        loc = geolocator.geocode(search2, timeout=5)
        if loc:
            return f"{loc.latitude}, {loc.longitude}"
    except:
        pass

    return "0,0"

print("------------------------------------------------")
print(f"Starting GPS Search for {len(df)} pilots...")
print("Saving progress every 10 rows...")
print("------------------------------------------------")

# Iterate and save incrementally
for index, row in df.iterrows():
    new_coords = get_location(row)
    df.at[index, 'Coordinates'] = new_coords
    
    # Progress Bar & Save
    if index % 10 == 0:
        print(f"Processed {index}/{len(df)} pilots... (Saved)")
        df.to_csv(input_file, index=False)

# Final Save
df.to_csv(input_file, index=False)
print("------------------------------------------------")
print("COMPLETED! All pilots located.")
print("------------------------------------------------")