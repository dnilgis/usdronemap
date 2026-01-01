import pandas as pd
import random

# CONFIGURATION
input_file = "drone_pilots_WITH_PHONES_FINAL.csv"

# MANUAL STATE CENTERS (Lat, Lng)
state_centers = {
    'AL': (32.806671, -86.791130), 'AK': (61.370716, -152.404419), 'AZ': (33.729759, -111.431221),
    'AR': (34.969704, -92.373123), 'CA': (36.116203, -119.681564), 'CO': (39.059811, -105.311104),
    'CT': (41.597782, -72.755371), 'DE': (39.318523, -75.507141), 'DC': (38.897438, -77.026817),
    'FL': (27.766279, -81.686783), 'GA': (33.040619, -83.643074), 'HI': (21.094318, -157.498337),
    'ID': (44.240459, -114.478828), 'IL': (40.349457, -88.986137), 'IN': (39.849426, -86.258278),
    'IA': (42.011539, -93.210526), 'KS': (38.526600, -96.726486), 'KY': (37.668140, -84.670067),
    'LA': (31.169546, -91.867805), 'ME': (44.693947, -69.381927), 'MD': (39.063946, -76.802101),
    'MA': (42.230171, -71.530106), 'MI': (43.326618, -84.536095), 'MN': (45.694454, -93.900192),
    'MS': (32.741646, -89.678696), 'MO': (38.456085, -92.288368), 'MT': (46.921925, -110.454353),
    'NE': (41.125370, -98.268082), 'NV': (38.313515, -117.055374), 'NH': (43.452492, -71.563896),
    'NJ': (40.298904, -74.521011), 'NM': (34.840515, -106.248482), 'NY': (42.165726, -74.948051),
    'NC': (35.630066, -79.806419), 'ND': (47.528912, -99.784012), 'OH': (40.388783, -82.764915),
    'OK': (35.565342, -96.928917), 'OR': (44.572021, -122.070938), 'PA': (40.590752, -77.209755),
    'RI': (41.680893, -71.511780), 'SC': (33.856892, -80.945007), 'SD': (44.299782, -99.438828),
    'TN': (35.747845, -86.692345), 'TX': (31.054487, -97.563461), 'UT': (40.150032, -111.862434),
    'VT': (44.045876, -72.710686), 'VA': (37.769337, -78.169968), 'WA': (47.400902, -121.490494),
    'WV': (38.491226, -80.954453), 'WI': (44.268543, -89.616508), 'WY': (42.755966, -107.302490)
}

print(f"Reading {input_file}...")
try:
    df = pd.read_csv(input_file)
except FileNotFoundError:
    print("Error: CSV file not found.")
    exit()

print("------------------------------------------------")
print("Applying SMART SCATTER to 389 pilots...")
print("Spreading pins out so they don't stack.")
print("------------------------------------------------")

count = 0
for index, row in df.iterrows():
    # If coordinates are missing or generic (we want to re-scatter everyone to be safe)
    state = str(row.get('State', '')).strip().upper()
    
    if state in state_centers:
        base_lat, base_lng = state_centers[state]
        
        # JITTER CALCULATION:
        # +/- 0.5 degrees is roughly 35 miles.
        # This keeps them in the state but separates the pins visually.
        lat_jitter = random.uniform(-0.5, 0.5)
        lng_jitter = random.uniform(-0.6, 0.6)
        
        new_lat = base_lat + lat_jitter
        new_lng = base_lng + lng_jitter
        
        df.at[index, 'Coordinates'] = f"{new_lat}, {new_lng}"
        count += 1

# Save
df.to_csv(input_file, index=False)
print("------------------------------------------------")
print(f"DONE! Scattered {count} pilots across their states.")
print("------------------------------------------------")