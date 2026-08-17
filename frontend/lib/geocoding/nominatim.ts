import type { PosterLocation } from '@/types/poster';
import { createError } from '@/lib/errors/ServerActionError';

export interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string]; // [minlat, maxlat, minlon, maxlon]
  place_id: number;
  type: string;
  class: string;
  addresstype?: string;
  importance?: number;
  place_rank?: number;
  address?: Record<string, string | undefined>;
  namedetails?: Record<string, string | undefined>;
}

export interface SearchOptions {
  limit?: number;
}

export async function searchLocation(
  query: string,
  options: SearchOptions = {},
  signal?: AbortSignal
): Promise<NominatimResult[]> {
  const q = query.trim();
  if (!q) return [];

  const params = new URLSearchParams({
    q,
    limit: String(options.limit ?? 5),
  });

  const resp = await fetch(`/api/geocode?${params.toString()}`, { signal });

  if (!resp.ok) {
    let errorDetail = '';
    try {
      const errorJson = await resp.json();
      errorDetail = errorJson.error || errorJson.details || errorJson.message || '';
      
      // If we still don't have a detail string but we have an object, stringify it
      if (!errorDetail && errorJson && typeof errorJson === 'object') {
        errorDetail = JSON.stringify(errorJson);
      }
    } catch {
      // ignore
    }

    const baseMsg = `Geocoding error ${resp.status}`;
    throw createError.internalError(errorDetail ? `${baseMsg}: ${errorDetail}` : `${baseMsg} (no details available)`);
  }

  const data = await resp.json();
  if (!Array.isArray(data)) return [];
  return data as NominatimResult[];
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<NominatimResult | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });

  const resp = await fetch(`/api/geocode?${params.toString()}`, { signal });

  if (!resp.ok) {
    let errorDetail = '';
    try {
      const errorJson = await resp.json();
      errorDetail = errorJson.error || errorJson.details || errorJson.message || '';
    } catch {
      // ignore
    }
    const baseMsg = `Reverse geocoding error ${resp.status}`;
    throw createError.internalError(errorDetail ? `${baseMsg}: ${errorDetail}` : `${baseMsg}`);
  }

  const data = await resp.json();
  return data as NominatimResult;
}

const STATE_INITIALS: Record<string, string> = {
  // US States
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  'District of Columbia': 'DC',
  // Canadian Provinces
  'Alberta': 'AB',
  'British Columbia': 'BC',
  'Manitoba': 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Nova Scotia': 'NS',
  'Ontario': 'ON',
  'Prince Edward Island': 'PE',
  'Quebec': 'QC',
  'Saskatchewan': 'SK',
  'Northwest Territories': 'NT',
  'Nunavut': 'NU',
  'Yukon': 'YT',
};

function pickPrimaryName(r: NominatimResult): string {
  const nd = r.namedetails ?? {};
  const addr = r.address ?? {};

  // Check for named details first (buildings, landmarks, etc.)
  const fromNamedetails =
    nd.name ||
    nd['name:en'] ||
    nd['name:local'] ||
    nd['official_name'] ||
    nd['short_name'];

  if (fromNamedetails) {
    return fromNamedetails.toString();
  }

  // Check for street addresses (house_number + road, or just road)
  const houseNumber = addr.house_number;
  const road = addr.road;
  if (road) {
    const streetAddress = houseNumber ? `${houseNumber} ${road}` : road;
    return streetAddress;
  }

  // Check for other address fields (city, town, etc.)
  const fromAddress =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.county ||
    addr.state ||
    addr.country;

  if (fromAddress) {
    return fromAddress.toString();
  }

  // Fallback to display_name
  const fallback = r.display_name?.split(',')?.[0]?.trim();
  return (fallback || 'Unknown').toString();
}

function pickSubtitle(r: NominatimResult, excludeName?: string): string | undefined {
  const addr = r.address ?? {};
  // For street addresses, show the broader location context including suburb/neighbourhood
  const parts = [
    addr.suburb || addr.neighbourhood,
    addr.city || addr.town || addr.village || addr.hamlet,
    addr.state,
    addr.country,
  ].filter(Boolean) as string[];

  let filteredParts = parts;
  if (excludeName) {
    const nameLower = excludeName.toLowerCase();
    filteredParts = parts.filter(p => p.toLowerCase() !== nameLower);
  }

  const compact = filteredParts.join(', ');
  if (compact) return compact;

  const dn = r.display_name?.trim();
  if (!dn) return undefined;

  let finalSubtitle = dn;
  if (excludeName) {
    const nameLower = excludeName.toLowerCase();
    finalSubtitle = dn.split(',')
      .map(p => p.trim())
      .filter(p => p.toLowerCase() !== nameLower)
      .join(', ');
  }

  // Keep it short-ish (UI)
  return finalSubtitle.length > 120 ? `${finalSubtitle.slice(0, 117)}...` : finalSubtitle;
}

function pickCity(r: NominatimResult, excludeName?: string): string | undefined {
  const addr = r.address ?? {};
  
  // Try to find a city/town/etc.
  let city = (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.municipality ||
    addr.county
  )?.toString();

  // If we found a city, check for state initials
  if (city) {
    const stateName = addr.state || addr.province;
    if (stateName) {
      const stateInitials = STATE_INITIALS[stateName];
      if (stateInitials) {
        const fullCity = `${city}, ${stateInitials}`;
        if (!excludeName || fullCity.toLowerCase() !== excludeName.toLowerCase()) {
          return fullCity;
        }
      }
    }
    
    // If the city name is redundant with the primary name, try to use state or country
    if (excludeName && city.toLowerCase() === excludeName.toLowerCase()) {
      const state = addr.state || addr.province;
      if (state && state.toLowerCase() !== excludeName.toLowerCase()) {
        return state;
      }
      const country = addr.country;
      if (country && country.toLowerCase() !== excludeName.toLowerCase()) {
        return country;
      }
      return undefined;
    }
    return city;
  }

  // If no city-level info, try state or country as fallback subtitle
  const state = addr.state || addr.province;
  if (state && (!excludeName || state.toLowerCase() !== excludeName.toLowerCase())) {
    return state;
  }

  const country = addr.country;
  if (country && (!excludeName || country.toLowerCase() !== excludeName.toLowerCase())) {
    return country;
  }

  return undefined;
}

export function nominatimResultToPosterLocation(result: NominatimResult, zoom?: number): PosterLocation | null {
  const lat = Number.parseFloat(result.lat);
  const lon = Number.parseFloat(result.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const bbox = result.boundingbox;
  if (!bbox || bbox.length !== 4) return null;

  const [minLat, maxLat, minLon, maxLon] = bbox.map((v) => Number.parseFloat(v));
  if (![minLat, maxLat, minLon, maxLon].every(Number.isFinite)) return null;

  const latDiff = Math.abs(maxLat - minLat);
  const lonDiff = Math.abs(maxLon - minLon);
  const maxDiff = Math.max(latDiff, lonDiff);

  let calculatedZoom = zoom;
  if (!calculatedZoom) {
    if (maxDiff > 5) calculatedZoom = 6;
    else if (maxDiff > 2) calculatedZoom = 7;
    else if (maxDiff > 1) calculatedZoom = 8;
    else if (maxDiff > 0.5) calculatedZoom = 9;
    else if (maxDiff > 0.25) calculatedZoom = 10;
    else if (maxDiff > 0.1) calculatedZoom = 11;
    else calculatedZoom = 12;
  }

  const primaryName = pickPrimaryName(result);

  return {
    name: primaryName,
    city: pickCity(result, primaryName),
    subtitle: pickSubtitle(result, primaryName),
    center: [lon, lat],
    bounds: [
      [minLon, minLat], // SW
      [maxLon, maxLat], // NE
    ],
    zoom: calculatedZoom,
  };
}

const PREFERRED_ADDRESS_TYPES = new Set([
  'city',
  'town',
  'village',
  'hamlet',
  'suburb',
  'neighbourhood',
  'quarter',
]);

function normalizeLabel(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function addressTypeScore(result: NominatimResult): number {
  const type = result.addresstype ?? result.type;
  if (type && PREFERRED_ADDRESS_TYPES.has(type)) return 0;
  if (type === 'municipality' || type === 'administrative') return 2;
  return 1;
}

function compareNominatimResults(a: NominatimResult, b: NominatimResult): number {
  const importanceDiff = (b.importance ?? 0) - (a.importance ?? 0);
  if (importanceDiff !== 0) return importanceDiff;
  return addressTypeScore(a) - addressTypeScore(b);
}

function bboxArea(bounds: PosterLocation['bounds']): number {
  const [[minLon, minLat], [maxLon, maxLat]] = bounds;
  return Math.max(0, maxLon - minLon) * Math.max(0, maxLat - minLat);
}

function bboxIntersectionArea(a: PosterLocation['bounds'], b: PosterLocation['bounds']): number {
  const minLon = Math.max(a[0][0], b[0][0]);
  const minLat = Math.max(a[0][1], b[0][1]);
  const maxLon = Math.min(a[1][0], b[1][0]);
  const maxLat = Math.min(a[1][1], b[1][1]);
  if (maxLon <= minLon || maxLat <= minLat) return 0;
  return (maxLon - minLon) * (maxLat - minLat);
}

function boundsMostlyOverlap(a: PosterLocation['bounds'], b: PosterLocation['bounds']): boolean {
  const intersection = bboxIntersectionArea(a, b);
  if (intersection <= 0) return false;
  const smaller = Math.min(bboxArea(a), bboxArea(b));
  if (smaller <= 0) return true;
  return intersection / smaller >= 0.5;
}

function centersCloseKm(a: [number, number], b: [number, number], maxKm = 5): boolean {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const km = 2 * earthRadiusKm * Math.asin(Math.min(1, Math.sqrt(h)));
  return km <= maxKm;
}

function isDuplicateLocation(a: PosterLocation, b: PosterLocation): boolean {
  if (normalizeLabel(a.name) !== normalizeLabel(b.name)) return false;
  if (normalizeLabel(a.subtitle) !== normalizeLabel(b.subtitle)) return false;
  return boundsMostlyOverlap(a.bounds, b.bounds) || centersCloseKm(a.center, b.center);
}

export interface NominatimSearchHit {
  id: number;
  location: PosterLocation;
}

/**
 * Convert Nominatim hits to poster locations, dropping OSM duplicates that
 * collapse to the same UI label (e.g. city + municipality for Tallinn).
 * Keeps the higher-importance / more specific place type.
 */
export function nominatimResultsToSearchHits(
  results: NominatimResult[],
  maxHits?: number
): NominatimSearchHit[] {
  const mapped = results
    .map((result) => {
      const location = nominatimResultToPosterLocation(result);
      if (!location) return null;
      return { result, location };
    })
    .filter((item): item is { result: NominatimResult; location: PosterLocation } => item !== null)
    .sort((a, b) => compareNominatimResults(a.result, b.result));

  const unique: NominatimSearchHit[] = [];
  for (const item of mapped) {
    const duplicate = unique.some((kept) => isDuplicateLocation(kept.location, item.location));
    if (duplicate) continue;
    unique.push({ id: item.result.place_id, location: item.location });
    if (maxHits !== undefined && unique.length >= maxHits) break;
  }
  return unique;
}
