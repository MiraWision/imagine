import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const LETTERS = UPPER + LOWER;
const ALNUM = LETTERS + DIGIT;
const DEFAULT_SYMBOLS = "!@#$%^&*_-";

const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua'
];

type PatternOptions = {
  symbols?: string;
  seed?: number | string;
};

/**
 * Return a random character from a charset.
 *
 * @param charset - String of characters to choose from. Defaults to alphanumeric (A-Za-z0-9).
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns A single character from `charset`.
 * @throws RangeError if `charset` is empty.
 */
function char(charset = ALNUM, opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  if (!charset || charset.length === 0) throw new RangeError('char: charset is empty');
  const i = Math.floor(rng.next() * charset.length);
  return charset[i] as string;
}

/**
 * Generate a string of a given length from a charset.
 *
 * @param length - Desired length (rounded down; minimum 0).
 * @param charset - String of characters to choose from. Defaults to alphanumeric.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Random string of length `length`.
 * @throws RangeError if `charset` is empty.
 */
function string(length: number, charset = ALNUM, opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const n = Math.max(0, Math.floor(length));
  if (!charset || charset.length === 0) throw new RangeError('string: charset is empty');
  let out = '';
  for (let i = 0; i < n; i += 1) out += char(charset, { seed: rng.next() * 2 ** 32 });
  return out;
}

/**
 * Return a random word from a small English dictionary.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns A lowercased word.
 */
function word(opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return WORDS[Math.floor(rng.next() * WORDS.length)];
}

/**
 * Generate a sentence with the given number of words.
 *
 * @param wordsCount - Desired count (rounded down; minimum 1). Default 6.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Capitalized sentence ending with a period.
 */
function sentence(wordsCount = 6, opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const n = Math.max(1, Math.floor(wordsCount));
  const words: string[] = [];
  for (let i = 0; i < n; i += 1) words.push(word({ seed: rng.next() * 2 ** 32 }));
  const s = words.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

/**
 * Generate a paragraph of the given number of sentences.
 *
 * @param sentencesCount - Desired count (rounded down; minimum 1). Default 3.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Paragraph string with sentences separated by spaces.
 */
function paragraph(sentencesCount = 3, opts?: { seed?: number | string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const n = Math.max(1, Math.floor(sentencesCount));
  const sentences: string[] = [];
  for (let i = 0; i < n; i += 1) sentences.push(sentence(6 + Math.floor(rng.next() * 6), { seed: rng.next() * 2 ** 32 }));
  return sentences.join(' ');
}

/**
 * Generate a string from a template pattern.
 *
 * Tokens:
 * - 'A' -> [A-Z]
 * - 'a' -> [a-z]
 * - '#' -> [0-9]
 * - '@' -> [A-Za-z0-9]
 * - '!' -> symbol from `options.symbols` (default "!@#$%^&*_-")
 * - '.' -> any printable ASCII (33..126), no space
 * - '\\' -> escape next char; dangling '\\' throws
 *
 * @param template - Pattern string to expand.
 * @param options - Pattern options.
 * @param options.symbols - Available symbols for '!'. Default "!@#$%^&*_-".
 * @param options.seed - Local seed to scope this call's RNG.
 * @returns Generated string.
 * @throws Error on dangling escape.
 */
function pattern(template: string, options: PatternOptions = {}): string {
  const symbols = options.symbols ?? DEFAULT_SYMBOLS;
  const rng = rngFrom(options.seed, getGlobalRng());
  let out = '';
  let escaping = false;
  for (let i = 0; i < template.length; i += 1) {
    const ch = template[i] as string;
    if (escaping) {
      out += ch;
      escaping = false;
      continue;
    }
    if (ch === '\\') {
      if (i === template.length - 1) throw new Error('pattern: dangling \\ at end');
      escaping = true;
      continue;
    }
    switch (ch) {
      case 'A': out += char(UPPER, { seed: rng.next() * 2 ** 32 }); break;
      case 'a': out += char(LOWER, { seed: rng.next() * 2 ** 32 }); break;
      case '#': out += char(DIGIT, { seed: rng.next() * 2 ** 32 }); break;
      case '@': out += char(ALNUM, { seed: rng.next() * 2 ** 32 }); break;
      case '!': out += char(symbols, { seed: rng.next() * 2 ** 32 }); break;
      case '.': {
        // printable ASCII 33..126 (excludes space)
        const code = 33 + Math.floor(rng.next() * (126 - 33 + 1));
        out += String.fromCharCode(code);
        break;
      }
      default:
        out += ch;
    }
  }
  return out;
}

export type { PatternOptions };
export { char, string, word, sentence, paragraph, pattern };
export default { char, string, word, sentence, paragraph, pattern };
