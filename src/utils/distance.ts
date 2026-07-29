// Santiago del Estero central coordinates (Plaza Libertad)
export const DEFAULT_BUYER_LAT = -27.7877;
export const DEFAULT_BUYER_LNG = -64.2597;

/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number = DEFAULT_BUYER_LAT,
  lon2: number = DEFAULT_BUYER_LNG
): number {
  if (!lat1 || !lon1) return 1.2;
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.max(0.1, Math.round(d * 10) / 10);
}

export interface ZoneLocation {
  name: string;
  lat: number;
  lng: number;
}

export const SANTIAGO_ZONES: ZoneLocation[] = [
  { name: 'Centro (Plaza Libertad)', lat: -27.7877, lng: -64.2597 },
  { name: 'B° Belgrano', lat: -27.8012, lng: -64.2530 },
  { name: 'B° Autonomía', lat: -27.7780, lng: -64.2980 },
  { name: 'B° Smata', lat: -27.8110, lng: -64.2710 },
  { name: 'B° San Germés', lat: -27.8250, lng: -64.2690 },
  { name: 'B° Cabildo', lat: -27.8180, lng: -64.2580 },
  { name: 'B° Huaico Hondo', lat: -27.7650, lng: -64.2610 },
  { name: 'B° Alberdi', lat: -27.7830, lng: -64.2670 },
  { name: 'B° Tradición', lat: -27.8050, lng: -64.2780 },
  { name: 'Parque Aguirre / Costanera', lat: -27.7812, lng: -64.2505 },
  { name: 'Centro La Banda', lat: -27.7341, lng: -64.2411 },
  { name: 'B° San Martín (La Banda)', lat: -27.7290, lng: -64.2490 }
];

export function findClosestZone(lat: number, lng: number): ZoneLocation {
  let closest = SANTIAGO_ZONES[0];
  let minDistance = Infinity;

  for (const zone of SANTIAGO_ZONES) {
    const dist = calculateDistanceKm(lat, lng, zone.lat, zone.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = zone;
    }
  }

  return closest;
}
