import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';
import { pattern } from '../string/index.js';
import { initials as svgInitials } from '../images/svg.js';

const MALE_FIRST = ['James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles'];
const FEMALE_FIRST = ['Mary','Patricia','Jennifer','Linda','Elizabeth','Barbara','Susan','Jessica','Sarah','Karen'];
const LAST = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez'];

function pick<T>(arr: readonly T[], rng: { next(): number }): T {
  return arr[Math.floor(rng.next() * arr.length)] as T;
}

/**
 * Return a first name.
 *
 * @param gender - Optional gender 'male' | 'female'. If omitted, random.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns First name string.
 */
function firstName(gender?: 'male'|'female', opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  if (gender === 'male') return pick(MALE_FIRST, rng);
  if (gender === 'female') return pick(FEMALE_FIRST, rng);
  return rng.next() < 0.5 ? pick(MALE_FIRST, rng) : pick(FEMALE_FIRST, rng);
}

/**
 * Return a last name.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Last name string.
 */
function lastName(opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return pick(LAST, rng);
}

/**
 * Return a full name "First Last".
 *
 * @param gender - Optional gender for the first name.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Concatenated full name.
 */
function fullName(gender?: 'male'|'female', opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const f = firstName(gender, { seed: rng.next() * 2 ** 32 });
  const l = lastName({ seed: rng.next() * 2 ** 32 });
  return `${f} ${l}`;
}

/**
 * Return a lowercase username derived from names + digits.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Username string.
 */
function username(opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const f = firstName(undefined, { seed: rng.next() * 2 ** 32 }).toLowerCase();
  const l = lastName({ seed: rng.next() * 2 ** 32 }).toLowerCase();
  const n = Math.floor(rng.next() * 1000);
  return `${f[0]}${l}${n}`;
}

/**
 * Return an email string using a domain (default 'example.com').
 *
 * @param domain - Email domain (e.g., 'example.com').
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Email address string.
 */
function email(domain?: string, opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const u = username({ seed: rng.next() * 2 ** 32 });
  const d = (domain && domain.trim()) || 'example.com';
  return `${u}@${d}`;
}

/**
 * Return a password string of given length using selected character sets.
 *
 * @param length - Desired length (rounded down; minimum 1). Default 12.
 * @param options - Character set options.
 * @param options.symbols - Include symbols (default true).
 * @param options.digits - Include digits (default true).
 * @param options.upper - Include uppercase letters (default true).
 * @param options.lower - Include lowercase letters (default true).
 * @param options.seed - Local seed to scope this call's RNG.
 * @returns Password string with at least one character from each enabled set.
 * @throws RangeError if no character sets are enabled.
 */
function password(
  length = 12,
  options?: { symbols?: boolean; digits?: boolean; upper?: boolean; lower?: boolean; seed?: number|string },
): string {
  const rng = rngFrom(options?.seed, getGlobalRng());
  const allow = {
    symbols: options?.symbols ?? true,
    digits: options?.digits ?? true,
    upper: options?.upper ?? true,
    lower: options?.lower ?? true,
  };
  const sets: Array<string> = [];
  if (allow.symbols) sets.push('!@#$%^&*_-');
  if (allow.digits) sets.push('0123456789');
  if (allow.upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (allow.lower) sets.push('abcdefghijklmnopqrstuvwxyz');
  if (sets.length === 0) throw new RangeError('password: at least one character set must be enabled');
  const n = Math.max(1, Math.floor(length));
  let out = '';
  // Ensure at least one from each selected set
  for (const set of sets) out += set[Math.floor(rng.next() * set.length)];
  while (out.length < n) {
    const set = sets[Math.floor(rng.next() * sets.length)];
    out += set[Math.floor(rng.next() * set.length)];
  }
  return out;
}

/**
 * Return a data URL for an initials-based SVG avatar.
 *
 * @param size - Square image size in px (default 96).
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Data URL string.
 */
function avatar(size = 96, opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const name = fullName(undefined, { seed: rng.next() * 2 ** 32 });
  const initials = name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const uri = svgInitials({ text: initials, size, as: 'dataUrl' });
  return uri as string;
}

/**
 * Return a phone string using a pattern.
 *
 * @param formatStr - Pattern like '+1-###-###-####'.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed passed through to pattern generator.
 * @returns Phone string matching the pattern.
 */
function phone(formatStr = '+1-###-###-####', opts?: { seed?: number|string }): string {
  return pattern(formatStr, { seed: opts?.seed });
}

export { firstName, lastName, fullName, username, email, password, avatar, phone };
export default { firstName, lastName, fullName, username, email, password, avatar, phone };
