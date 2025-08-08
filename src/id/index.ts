import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';

const HEX = '0123456789abcdef';
const WORDS = [
  'alpha','bravo','charlie','delta','echo','foxtrot','golf','hotel','india','juliet','kilo','lima','mike','november','oscar','papa','quebec','romeo','sierra','tango','uniform','victor','whiskey','xray','yankee','zulu'
];

/**
 * Generate a pseudo-random UUID v4-style string.
 *
 * Determinism:
 * - Uses the global seed unless a local `{ seed }` is provided in `opts`.
 *
 * Format:
 * - xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where y in [8,9,a,b].
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns UUID v4-like string.
 */
function uuid(opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(rng.next() * 256);
  // Set version and variant bits for v4-like shape
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex: string[] = [];
  for (let i = 0; i < 16; i += 1) {
    hex.push(HEX[(bytes[i] >> 4) & 0xf] + HEX[bytes[i] & 0xf]);
  }
  return (
    hex[0] + hex[1] + hex[2] + hex[3] + '-' +
    hex[4] + hex[5] + '-' + hex[6] + hex[7] + '-' +
    hex[8] + hex[9] + '-' + hex[10] + hex[11] + hex[12] + hex[13] + hex[14] + hex[15]
  );
}

/**
 * Generate a hex string of the given length.
 *
 * Determinism:
 * - Uses the global seed unless a local `{ seed }` is provided in `opts`.
 *
 * @param length - Number of hex characters (default 16). Minimum 1.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Lowercase hexadecimal string of length `length`.
 */
function hash(length = 16, opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const n = Math.max(1, Math.floor(length));
  let out = '';
  for (let i = 0; i < n; i += 1) out += HEX[Math.floor(rng.next() * 16)];
  return out;
}

/**
 * Generate a kebab-case slug composed of dictionary words.
 *
 * Determinism:
 * - Uses the global seed unless a local `{ seed }` is provided in `opts`.
 *
 * @param wordsCount - Number of words to include (default 2). Minimum 1.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Kebab-case slug like "alpha-bravo".
 */
function slug(wordsCount = 2, opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const n = Math.max(1, Math.floor(wordsCount));
  const parts: string[] = [];
  for (let i = 0; i < n; i += 1) parts.push(WORDS[Math.floor(rng.next() * WORDS.length)]);
  return parts.join('-');
}

export { uuid, hash, slug };
export default { uuid, hash, slug };
