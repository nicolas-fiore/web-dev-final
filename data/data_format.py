import pandas as pd
import math

spending = pd.read_csv('./data/tourist_spending.csv')
numbers = pd.read_csv('./data/tourist_numbers.csv')
cords = pd.read_csv('./data/cords.csv')
numbers = numbers.drop('Entity', axis=1)

full_data = spending.merge(numbers, left_on=["Year", "Code"], right_on=["Year", "Code"], how='left')
full_data = full_data.loc[full_data['Year'] == 2024]

full_data['Average_Spending_Per'] = (full_data['Spending'] / full_data['Arrivals']).round(decimals=3)
full_data = full_data.merge(cords, how='left', on='Entity').drop('country', axis=1)
full_data = full_data.dropna()

def calculate(lat1, lon1, lat2, lon2): 
    R = 3958.8
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

#Pittsburgh Coords
usa_lat, usa_long = 40.4406, -79.9959


full_data['Miles_From_Pitt'] = full_data.apply(lambda row: calculate(usa_lat, usa_long, row['latitude'], row['longitude']), axis=1)

full_data['Single_Flight_Cost'] = 160 + (full_data['Miles_From_Pitt'] * 0.095)
full_data['Round_Flight_Cost'] = ((full_data['Single_Flight_Cost']) * 2).round(2)

full_data.to_json('./data/full_data.json', index=False, indent=4, orient='records')
#full_data.to_csv('./data/full_data.csv', index=False)
print("full_data.json Created")
