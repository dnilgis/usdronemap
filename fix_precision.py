import pandas as pd
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import time

# CONFIGURATION
input_file = "drone_pilots_WITH_PHONES_FINAL.csv"

print(f"Reading {input_file}...")
try:
    df = pd.read_csv(input_file)
except FileNotFoundError:
    print("Error: CSV file not found.")
    exit()

# Setup Geolocator
geolocator = Nominatim(user_agent="drone_directory_precision_v3")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1.5)

print("------------------------------------------------")
print(f"Starting PRECISION FIX on {len(df)} pilots...")
print("This will take about 10-15 minutes. Please wait.")
print("------------------------------------------------")

count = 0
for index, row in df.iterrows():
    city = str(row.get('City', '')).strip()
    state = str(row.get('State', '')).strip()
    
    if not city or city == "nan" or not state or state == "nan":
        continue

    search_query = f"{city}, {state}, USA"
    
    print(f"[{index+1}/{len(df)}] Locating: {search_query}...", end="", flush=True)
    
    try:
        location = geolocator.geocode(search_query, timeout=10)
        
        if location:
            df.at[index, 'Coordinates'] = f"{location.latitude}, {location.longitude}"
            print(f" Fixed.")
            count += 1
        else:
            print(" City not found (Keeping State center).")
            
    except Exception as e:
        print(f" Error: {e}")

    if index % 10 == 0:
        df.to_csv(input_file, index=False)

df.to_csv(input_file, index=False)
print("------------------------------------------------")
print(f"DONE! Updated {count} pilots with exact city locations.")
print("------------------------------------------------")