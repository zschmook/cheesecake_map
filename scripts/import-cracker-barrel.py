"""Refresh the sourced Cracker Barrel snapshot from AllThePlaces (CC0)."""
import json
from pathlib import Path
from urllib.request import urlopen

source = 'https://data.alltheplaces.xyz/runs/latest/output/cracker_barrel.geojson'
root = Path(__file__).resolve().parents[1]

def convert(data):
    rows = []
    for feature in data['features']:
        p, geometry = feature['properties'], feature.get('geometry')
        if p.get('addr:country') != 'US' or not geometry or geometry['type'] != 'Point':
            continue
        lon, lat = geometry['coordinates']
        if not (-180 <= lon <= 180 and -90 <= lat <= 90):
            raise ValueError('Invalid coordinates')
        rows.append(dict(id=p.get('ref', feature['id']), city=p.get('addr:city', ''),
                         state=p.get('addr:state', ''), address=p.get('addr:street_address', ''),
                         lat=lat, lon=lon, url=p.get('website', '')))
    if len(rows) < 500 or len({r['id'] for r in rows}) != len(rows):
        raise ValueError('Unexpected location count or duplicate IDs')
    return sorted(rows, key=lambda r: (r['state'], r['city'], r['address']))

if __name__ == '__main__':
    with urlopen(source, timeout=60) as response:
        data = json.load(response)
    rows = convert(data)
    (root/'public/cracker-barrel.json').write_text(json.dumps(rows, indent=2)+'\n', encoding='utf-8')
    print(f"Saved {len(rows)} locations; collected {data['dataset_attributes'].get('spider:collection_time')}")
