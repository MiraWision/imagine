import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';
import * as info from '@mirawision/infopedia';

type Country = { name: { en: string; native?: string }; iso2: string };
type Language = { name: { en: string }; iso639_1?: string };
type TimeZone = { name: string };

const COUNTRIES = info.countries as ReadonlyArray<Country>;
const LANGUAGES = info.languages as ReadonlyArray<Language>;
const TIMEZONES = info.timeZones as ReadonlyArray<TimeZone>;

const CITIES = [
  'New York','Los Angeles','Chicago','London','Paris','Berlin','Warsaw','Kyiv','Tokyo','Osaka','Seoul','Sydney','Melbourne','Toronto','Vancouver','São Paulo','Rio de Janeiro','Mexico City','Mumbai','Delhi','Johannesburg','Cairo'
];

function country(codeOnly = false, opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const c = COUNTRIES[Math.floor(rng.next() * COUNTRIES.length)];
  return codeOnly ? c.iso2 : c.name.en;
}

/**
 * Return a random ISO 3166-1 alpha-2 country code.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns ISO2 country code (e.g., 'US').
 */
function countryCode(opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return COUNTRIES[Math.floor(rng.next() * COUNTRIES.length)].iso2;
}

/**
 * Return a random city name (built-in small list for v1).
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns City name.
 */
function city(opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return CITIES[Math.floor(rng.next() * CITIES.length)];
}

/**
 * Return a pseudo address combining street, city, ZIP, and country code.
 *
 * Format example: "123 Main St, City 12345, US".
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Address string.
 */
function address(opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const streetNum = 1 + Math.floor(rng.next() * 9999);
  const streetNames = ['Main', 'Oak', 'Maple', 'Pine', 'Cedar', 'Elm', 'Park', 'Washington', 'Lake', 'Hill'];
  const streetTypes = ['St', 'Ave', 'Blvd', 'Rd', 'Ln', 'Dr'];
  const street = `${streetNames[Math.floor(rng.next() * streetNames.length)]} ${streetTypes[Math.floor(rng.next() * streetTypes.length)]}`;
  const cty = city({ seed: rng.next() * 2 ** 32 });
  const code = countryCode({ seed: rng.next() * 2 ** 32 });
  const zipCode = zip({ seed: rng.next() * 2 ** 32 });
  return `${streetNum} ${street}, ${cty} ${zipCode}, ${code}`;
}

/**
 * Return a 5-digit ZIP-like code.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Five-digit string.
 */
function zip(opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const n = () => Math.floor(rng.next() * 10);
  return `${n()}${n()}${n()}${n()}${n()}`;
}

/**
 * Return random geographic coordinates.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Object with latitude in [-90, 90) and longitude in [-180, 180), rounded to 6 decimals.
 */
function coordinates(opts?: { seed?: number | string }): { lat: number; lng: number } {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const lat = rng.next() * 180 - 90; // [-90, 90)
  const lng = rng.next() * 360 - 180; // [-180, 180)
  return { lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6 };
}

/**
 * Return a random IANA time zone name sourced from infopedia.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Time zone name, e.g., 'Europe/Warsaw'.
 */
function timezone(opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return TIMEZONES[Math.floor(rng.next() * TIMEZONES.length)].name;
}

/**
 * Return a random language code (ISO 639-1) or English name if missing.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns ISO 639-1 code (e.g., 'en') or language English name.
 */
function language(opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const lang = LANGUAGES[Math.floor(rng.next() * LANGUAGES.length)];
  return lang.iso639_1 || lang.name.en;
}

export { country, countryCode, city, address, zip, coordinates, timezone, language };
export default { country, countryCode, city, address, zip, coordinates, timezone, language };
