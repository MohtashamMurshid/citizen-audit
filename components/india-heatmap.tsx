"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Approximate coordinates for major Indian cities
const CITY_COORDS: Record<string, [number, number]> = {
  "Mumbai": [19.076, 72.8777],
  "Delhi": [28.6139, 77.209],
  "New Delhi": [28.6139, 77.209],
  "Bangalore": [12.9716, 77.5946],
  "Bengaluru": [12.9716, 77.5946],
  "Hyderabad": [17.385, 78.4867],
  "Chennai": [13.0827, 80.2707],
  "Kolkata": [22.5726, 88.3639],
  "Pune": [18.5204, 73.8567],
  "Ahmedabad": [23.0225, 72.5714],
  "Jaipur": [26.9124, 75.7873],
  "Surat": [21.1702, 72.8311],
  "Lucknow": [26.8467, 80.9462],
  "Kanpur": [26.4499, 80.3319],
  "Nagpur": [21.1458, 79.0882],
  "Indore": [22.7196, 75.8577],
  "Thane": [19.2183, 72.9781],
  "Bhopal": [23.2599, 77.4126],
  "Visakhapatnam": [17.6868, 83.2185],
  "Patna": [25.6093, 85.1376],
  "Vadodara": [22.3072, 73.1812],
  "Ghaziabad": [28.6692, 77.4538],
  "Ludhiana": [30.9, 75.8573],
  "Agra": [27.1767, 78.0081],
  "Nashik": [19.9975, 73.7898],
  "Ranchi": [23.3441, 85.3096],
  "Faridabad": [28.4089, 77.3178],
  "Meerut": [28.9845, 77.7064],
  "Rajkot": [22.3039, 70.8022],
  "Varanasi": [25.3176, 82.9739],
  "Srinagar": [34.0837, 74.7973],
  "Jammu": [32.7266, 74.857],
  "Chandigarh": [30.7333, 76.7794],
  "Coimbatore": [11.0168, 76.9558],
  "Jodhpur": [26.2389, 73.0243],
  "Madurai": [9.9252, 78.1198],
  "Raipur": [21.2514, 81.6296],
  "Kochi": [9.9312, 76.2673],
  "Guwahati": [26.1445, 91.7362],
  "Bhubaneswar": [20.2961, 85.8245],
  "Dehradun": [30.3165, 78.0322],
  "Thiruvananthapuram": [8.5241, 76.9366],
  "Noida": [28.5355, 77.391],
  "Gurgaon": [28.4595, 77.0266],
  "Gurugram": [28.4595, 77.0266],
  "Amritsar": [31.634, 74.8723],
  "Allahabad": [25.4358, 81.8463],
  "Prayagraj": [25.4358, 81.8463],
  "Vijayawada": [16.5062, 80.648],
  "Mysore": [12.2958, 76.6394],
  "Mysuru": [12.2958, 76.6394],
  "Mangalore": [12.9141, 74.856],
  "Mangaluru": [12.9141, 74.856],
  "Shimla": [31.1048, 77.1734],
  "Udaipur": [24.5854, 73.7125],
  "Jamshedpur": [22.8046, 86.2029],
  "Gwalior": [26.2183, 78.1828],
  "Hubli": [15.3647, 75.124],
  "Salem": [11.6643, 78.146],
  "Tiruchirappalli": [10.7905, 78.7047],
  "Warangal": [17.9784, 79.5941],
  "Bareilly": [28.367, 79.4304],
  "Moradabad": [28.8386, 78.7733],
  "Aurangabad": [19.8762, 75.3433],
  "Solapur": [17.6599, 75.9064],
  "Jalandhar": [31.326, 75.5762],
  "Bikaner": [28.0229, 73.3119],
  "Aligarh": [27.8974, 78.088],
  "Gorakhpur": [26.7606, 83.3732],
  "Dhanbad": [23.7957, 86.4304],
  "Bhilai": [21.2094, 81.4285],
  "Cuttack": [20.4625, 85.8828],
  "Firozabad": [27.1591, 78.395],
  "Kota": [25.2138, 75.8648],
  "Nellore": [14.4426, 79.9865],
  "Bhavnagar": [21.7645, 72.1519],
  "Kolhapur": [16.705, 74.2433],
  "Siliguri": [26.7271, 88.3953],
  "Durgapur": [23.55, 87.32],
  "Asansol": [23.6888, 86.9661],
  "Ajmer": [26.4499, 74.6399],
  "Bilaspur": [22.0796, 82.1391],
  "Latur": [18.4088, 76.5604],
  "Imphal": [24.817, 93.9368],
  "Shillong": [25.5788, 91.8933],
  "Dimapur": [25.9091, 93.7266],
  "Aizawl": [23.7271, 92.7176],
  "Itanagar": [27.0844, 93.6053],
  "Gangtok": [27.3389, 88.6065],
  "Agartala": [23.8315, 91.2868],
  "Panaji": [15.4909, 73.8278],
  "Silvassa": [20.2738, 73.0169],
  "Port Blair": [11.6234, 92.7265],
  "Puducherry": [11.9416, 79.8083],
  "Pondicherry": [11.9416, 79.8083],
};

// State capital fallbacks
const STATE_COORDS: Record<string, [number, number]> = {
  "Andhra Pradesh": [15.9129, 79.74],
  "Arunachal Pradesh": [28.218, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.0961, 85.3131],
  "Chhattisgarh": [21.2787, 81.8661],
  "Delhi": [28.6139, 77.209],
  "Goa": [15.2993, 74.124],
  "Gujarat": [22.2587, 71.1924],
  "Haryana": [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Jammu & Kashmir": [33.7782, 76.5762],
  "Jharkhand": [23.6102, 85.2799],
  "Karnataka": [15.3173, 75.7139],
  "Kerala": [10.8505, 76.2711],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Maharashtra": [19.7515, 75.7139],
  "Manipur": [24.6637, 93.9063],
  "Meghalaya": [25.467, 91.3662],
  "Mizoram": [23.1645, 92.9376],
  "Nagaland": [26.1584, 94.5624],
  "Odisha": [20.9517, 85.0985],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [27.0238, 74.2179],
  "Sikkim": [27.533, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  "Telangana": [18.1124, 79.0193],
  "Tripura": [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.855],
};

interface CityData {
  city: string;
  total: number;
  suspicious: number;
  verified: number;
  notFound: number;
}

interface StateData {
  state: string;
  total: number;
  suspicious: number;
  verified: number;
}

interface IndiaHeatmapProps {
  cityStats: CityData[];
  stateStats: StateData[];
}

const MOCK_HOTSPOTS: CityData[] = [
  { city: "Delhi", total: 47, suspicious: 18, verified: 14, notFound: 15 },
  { city: "Mumbai", total: 38, suspicious: 14, verified: 16, notFound: 8 },
  { city: "Kolkata", total: 29, suspicious: 12, verified: 8, notFound: 9 },
  { city: "Chennai", total: 22, suspicious: 7, verified: 10, notFound: 5 },
  { city: "Bangalore", total: 19, suspicious: 4, verified: 12, notFound: 3 },
  { city: "Lucknow", total: 24, suspicious: 11, verified: 6, notFound: 7 },
  { city: "Patna", total: 18, suspicious: 9, verified: 3, notFound: 6 },
  { city: "Jaipur", total: 16, suspicious: 6, verified: 7, notFound: 3 },
  { city: "Hyderabad", total: 21, suspicious: 5, verified: 11, notFound: 5 },
  { city: "Ahmedabad", total: 15, suspicious: 6, verified: 5, notFound: 4 },
  { city: "Kanpur", total: 20, suspicious: 10, verified: 4, notFound: 6 },
  { city: "Nagpur", total: 13, suspicious: 7, verified: 3, notFound: 3 },
  { city: "Surat", total: 11, suspicious: 3, verified: 5, notFound: 3 },
  { city: "Pune", total: 14, suspicious: 3, verified: 8, notFound: 3 },
  { city: "Indore", total: 12, suspicious: 5, verified: 4, notFound: 3 },
  { city: "Bhopal", total: 10, suspicious: 4, verified: 3, notFound: 3 },
  { city: "Varanasi", total: 15, suspicious: 8, verified: 3, notFound: 4 },
  { city: "Agra", total: 13, suspicious: 7, verified: 2, notFound: 4 },
  { city: "Srinagar", total: 8, suspicious: 3, verified: 3, notFound: 2 },
  { city: "Guwahati", total: 9, suspicious: 4, verified: 2, notFound: 3 },
  { city: "Ranchi", total: 11, suspicious: 5, verified: 3, notFound: 3 },
  { city: "Bhubaneswar", total: 10, suspicious: 4, verified: 4, notFound: 2 },
  { city: "Raipur", total: 9, suspicious: 5, verified: 2, notFound: 2 },
  { city: "Dehradun", total: 7, suspicious: 2, verified: 3, notFound: 2 },
  { city: "Coimbatore", total: 8, suspicious: 2, verified: 4, notFound: 2 },
  { city: "Kochi", total: 6, suspicious: 1, verified: 4, notFound: 1 },
  { city: "Thiruvananthapuram", total: 5, suspicious: 1, verified: 3, notFound: 1 },
  { city: "Ludhiana", total: 12, suspicious: 6, verified: 3, notFound: 3 },
  { city: "Amritsar", total: 8, suspicious: 4, verified: 2, notFound: 2 },
  { city: "Meerut", total: 11, suspicious: 6, verified: 2, notFound: 3 },
  { city: "Gorakhpur", total: 9, suspicious: 5, verified: 1, notFound: 3 },
  { city: "Bareilly", total: 8, suspicious: 4, verified: 1, notFound: 3 },
  { city: "Jodhpur", total: 6, suspicious: 2, verified: 2, notFound: 2 },
  { city: "Gwalior", total: 7, suspicious: 3, verified: 2, notFound: 2 },
  { city: "Dhanbad", total: 10, suspicious: 5, verified: 2, notFound: 3 },
  { city: "Siliguri", total: 7, suspicious: 3, verified: 2, notFound: 2 },
  { city: "Vijayawada", total: 6, suspicious: 2, verified: 3, notFound: 1 },
  { city: "Madurai", total: 5, suspicious: 1, verified: 3, notFound: 1 },
  { city: "Kota", total: 6, suspicious: 3, verified: 1, notFound: 2 },
  { city: "Rajkot", total: 7, suspicious: 2, verified: 3, notFound: 2 },
];

function mergeWithMockData(realData: CityData[]): CityData[] {
  const merged = new Map<string, CityData>();

  for (const mock of MOCK_HOTSPOTS) {
    merged.set(mock.city, { ...mock });
  }

  for (const real of realData) {
    const existing = merged.get(real.city);
    if (existing) {
      merged.set(real.city, {
        city: real.city,
        total: existing.total + real.total,
        suspicious: existing.suspicious + real.suspicious,
        verified: existing.verified + real.verified,
        notFound: existing.notFound + real.notFound,
      });
    } else {
      merged.set(real.city, { ...real });
    }
  }

  return Array.from(merged.values());
}

export function IndiaHeatmap({ cityStats, stateStats }: IndiaHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [22.5, 82],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    const allCities = mergeWithMockData(cityStats);
    const heatData: [number, number, number][] = [];

    for (const city of allCities) {
      const coords = CITY_COORDS[city.city];
      if (coords) {
        const intensity = city.suspicious > 0
          ? 0.5 + (city.suspicious / Math.max(city.total, 1)) * 0.5
          : 0.2;
        heatData.push([coords[0], coords[1], intensity * city.total]);

        const suspiciousRatio = city.suspicious / Math.max(city.total, 1);
        const hue = suspiciousRatio > 0.4 ? Math.max(0, 30 - suspiciousRatio * 40) : suspiciousRatio > 0.15 ? 40 : 150;
        const color = `hsl(${hue}, 85%, 55%)`;

        L.circleMarker(coords, {
          radius: Math.min(5 + Math.sqrt(city.total) * 2.5, 18),
          fillColor: color,
          color: "rgba(255,255,255,0.25)",
          weight: 1,
          fillOpacity: 0.85,
        })
          .bindPopup(
            `<div style="font-family:system-ui;font-size:13px;line-height:1.6;min-width:140px">
              <strong style="font-size:14px">${city.city}</strong><br/>
              <span style="color:#94a3b8">Total reports:</span> <strong>${city.total}</strong><br/>
              ${city.suspicious > 0 ? `<span style="color:#ef4444">Suspicious:</span> <strong>${city.suspicious}</strong><br/>` : ""}
              ${city.verified > 0 ? `<span style="color:#22c55e">Verified:</span> <strong>${city.verified}</strong><br/>` : ""}
              ${city.notFound > 0 ? `<span style="color:#f59e0b">Not found:</span> <strong>${city.notFound}</strong>` : ""}
            </div>`
          )
          .addTo(map);
      }
    }

    for (const state of stateStats) {
      if (STATE_COORDS[state.state]) {
        const hasCityInState = allCities.some((c) => CITY_COORDS[c.city]);
        if (!hasCityInState) {
          const coords = STATE_COORDS[state.state];
          const intensity = state.suspicious > 0 ? 0.6 : 0.2;
          heatData.push([coords[0], coords[1], intensity * state.total]);
        }
      }
    }

    if (heatData.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const heat = require("leaflet.heat");
      void heat;
      (L as unknown as { heatLayer: (data: [number, number, number][], opts: Record<string, unknown>) => L.Layer }).heatLayer(heatData, {
        radius: 35,
        blur: 25,
        maxZoom: 10,
        max: Math.max(...heatData.map((d) => d[2]), 1),
        gradient: {
          0.15: "#1e3a8a",
          0.3: "#2563eb",
          0.45: "#3b82f6",
          0.6: "#f59e0b",
          0.75: "#ef4444",
          0.9: "#dc2626",
          1.0: "#991b1b",
        },
      }).addTo(map);
    }
  }, [cityStats, stateStats]);

  return (
    <div className="relative overflow-hidden rounded-xl border">
      <div ref={mapRef} className="h-[420px] w-full" />
      <div className="absolute bottom-3 left-3 z-[1000] rounded-lg bg-background/90 backdrop-blur-sm px-3 py-2 text-[11px] text-muted-foreground ring-1 ring-border">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-red-500" />
            Suspicious
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-amber-500" />
            Not found
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}
