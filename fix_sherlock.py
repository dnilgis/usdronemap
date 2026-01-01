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
geolocator = Nominatim(user_agent="drone_directory_sherlock_v2")

print("------------------------------------------------")
print(f"Starting SHERLOCK SCAN on {len(df)} pilots...")
print("If City is missing, we will search by Name or Business.")
print("------------------------------------------------")

count = 0
for index, row in df.iterrows():
    # Get all potential data points
    name = str(row.get('Name', '')).strip()
    business = str(row.get('Business', '')).strip()
    city = str(row.get('City', '')).strip()
    state = str(row.get('State', '')).strip()
    
    # Skip if state is missing
    if not state or state == "nan":
        continue

    # --- DETERMINE SEARCH STRATEGY ---
    search_query = ""
    strategy = ""

    if city and city != "nan":
        search_query = f"{city}, {state}, USA"
        strategy = "City"
    elif business and business != "nan":
        search_query = f"{business}, {state}, USA"
        strategy = "Business"
    else:
        search_query = f"{name}, {state}, USA"
        strategy = "Name"

    print(f"[{index+1}] Searching ({strategy}): {search_query}...", end="", flush=True)
    
    try:
        location = geolocator.geocode(search_query, timeout=10)
        
        if location:
            df.at[index, 'Coordinates'] = f"{location.latitude}, {location.longitude}"
            print(f" FOUND.")
            count += 1
        else:
            print(f" No match.")
            
    except Exception as e:
        print(f" Error.")
        time.sleep(1)

    # Save every 5 rows
    if index % 5 == 0:
        df.to_csv(input_file, index=False)

# Final Save
df.to_csv(input_file, index=False)
print("------------------------------------------------")
print(f"DONE! Sherlock found locations for {count} pilots.")
print("------------------------------------------------")