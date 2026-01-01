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

# SAFETY 1: Clean column names (remove spaces)
df.columns = df.columns.str.strip()

# CHECK: Print columns to verify
print(f"Columns found: {list(df.columns)}")

# SAFETY 2: Check if City exists
if 'City' not in df.columns:
    print("CRITICAL ERROR: 'City' column is missing from CSV!")
    print("Trying to find it...")
    # Try to guess if it's named something else
    for col in df.columns:
        if "city" in col.lower():
            print(f"Found '{col}' - renaming to 'City'")
            df.rename(columns={col: 'City'}, inplace=True)

# Setup Geolocator
geolocator = Nominatim(user_agent="drone_directory_precision_v4")

print("------------------------------------------------")
print(f"Starting PRECISION FIX on {len(df)} pilots...")
print("------------------------------------------------")

count = 0
for index, row in df.iterrows():
    city = str(row.get('City', '')).strip()
    state = str(row.get('State', '')).strip()
    
    # Debug first row only
    if index == 0:
        print(f"TEST ROW 1: Name={row.get('Name')} | City={city} | State={state}")

    # Skip ONLY if truly empty
    if not city or city == "nan" or not state or state == "nan":
        continue

    search_query = f"{city}, {state}, USA"
    
    # Print progress without special characters
    print(f"[{index+1}] Finding: {search_query}...", end="", flush=True)
    
    try:
        location = geolocator.geocode(search_query, timeout=10)
        
        if location:
            df.at[index, 'Coordinates'] = f"{location.latitude}, {location.longitude}"
            print(f" OK.")
            count += 1
        else:
            print(f" No Match.")
            
    except Exception as e:
        print(f" Error.")
        time.sleep(1)

    # Save every 10 rows
    if index % 10 == 0:
        df.to_csv(input_file, index=False)

# Final Save
df.to_csv(input_file, index=False)
print("------------------------------------------------")
print(f"DONE! Updated {count} pilots.")
print("------------------------------------------------")