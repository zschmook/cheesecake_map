# Data and libraries

- Live election results and 2026 House district geometry: [civicAPI](https://civicapi.org/), [API documentation](https://civicapi.org/api-documentation). No API key required. Results are preliminary and leaders are not race calls. Geometry was obtained from civicAPI's public `US_House_2026_cd120.json` used by its national results page.
- Restaurant coordinates and addresses: [The Cheesecake Factory official directory](https://locations.thecheesecakefactory.com/), collected November 3, 2026. No affiliation or endorsement.
- Cracker Barrel coordinates and addresses: [AllThePlaces](https://www.alltheplaces.xyz/), `cracker_barrel` snapshot collected July 19, 2026, 655 U.S. locations, CC0. Original records cite the official Cracker Barrel locator. This is a dated snapshot and can include locations that have since closed. Refresh with `python scripts/import-cracker-barrel.py`.
- County/state geometry: [US Atlas](https://github.com/topojson/us-atlas), version 3, derived from U.S. Census Bureau geography.
- [D3](https://github.com/d3/d3), version 7.9.0, ISC license; bundled license in `licenses/d3.txt`.
- [TopoJSON Client](https://github.com/topojson/topojson-client), version 3.1.0, ISC license; bundled license in `licenses/topojson-client.txt`.

Third-party data and libraries retain their respective rights and terms.
