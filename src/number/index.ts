import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';

/**
 * Generate a random integer within an inclusive range.
 *
 * Determinism:
 * - Uses the global seed unless a local `{ seed }` is provided in `opts`.
 *
 * Behavior:
 * - If `min > max`, the values are swapped.
 * - Fractions are rounded toward the nearest bounded integers (ceil for min, floor for max).
 *
 * @param min - Lower bound (inclusive). Must be a finite number.
 * @param max - Upper bound (inclusive). Must be a finite number.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Integer in the inclusive range [min, max].
 * @throws TypeError if `min` or `max` is not finite.
 */
function int(min: number, max: number, opts?: { seed?: number | string }): number {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  if (!Number.isFinite(min) || !Number.isFinite(max)) throw new TypeError('int: min/max must be finite numbers');
  if (min > max) [min, max] = [max, min];
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(rng.next() * (hi - lo + 1)) + lo;
}

/**
 * Generate a random float in a half-open range.
 *
 * Determinism:
 * - Uses the global seed unless a local `{ seed }` is provided in `opts`.
 *
 * Behavior:
 * - If `min > max`, the values are swapped.
 * - Result is rounded to `precision` decimal places (default 2).
 * - The range is half-open: [min, max).
 *
 * @param min - Lower bound (inclusive). Must be a finite number.
 * @param max - Upper bound (exclusive). Must be a finite number.
 * @param precision - Number of decimal places to round to. Negative values are treated as 0.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns A float in [min, max) rounded to `precision` places.
 * @throws TypeError if `min` or `max` is not finite.
 */
function float(
  min: number,
  max: number,
  precision = 2,
  opts?: { seed?: number | string },
): number {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  if (!Number.isFinite(min) || !Number.isFinite(max)) throw new TypeError('float: min/max must be finite numbers');
  if (min > max) [min, max] = [max, min];
  const n = rng.next() * (max - min) + min;
  const p = Math.max(0, Math.floor(precision));
  const factor = 10 ** p;
  return Math.round(n * factor) / factor;
}

type SequenceOptions = {
  start?: number;
  end?: number;
  step?: number;
  loop?: boolean;
  map?: (value: number, index: number) => number;
  seed?: number | string;
};

/**
 * Create a deterministic numeric sequence generator.
 *
 * Determinism:
 * - Uses the global seed unless a local `seed` is provided in options.
 *
 * Behavior:
 * - If `end` is not provided, the sequence is infinite.
 * - If `loop=true` and `end` is reached, the next value wraps to `start`.
 * - `map` can post-process each value, receiving (`value`, `index`).
 *
 * @param options - Sequence options.
 * @param options.start - First value to emit (default 1).
 * @param options.end - Last value (inclusive). If omitted, sequence is infinite.
 * @param options.step - Step increment (default 1). Can be negative.
 * @param options.loop - When true and `end` is set, wraps to `start` after reaching `end`.
 * @param options.map - Optional mapper for emitted values.
 * @param options.seed - Local seed to scope the iterator.
 * @returns An object with `next(): number` and `[Symbol.iterator]()`.
 */
function sequence(options: SequenceOptions = {}) {
  const { start = 1, end, step = 1, loop = false, map } = options;
  const rng = rngFrom(options.seed, getGlobalRng());
  // rng is not used directly but kept for deterministic behavior if map uses closures depending on seed later
  let current = start;
  let index = 0;

  const api = {
    next(): number {
      let value = current;
      if (typeof map === 'function') value = map(value, index);
      index += 1;
      if (end === undefined) {
        current += step;
      } else {
        current += step;
        if (step > 0 && current > end) {
          if (loop) current = start;
          else current = end;
        }
        if (step < 0 && current < (start < end ? start : end)) {
          if (loop) current = start;
          else current = end ?? current;
        }
      }
      return value;
    },
    [Symbol.iterator](): Iterator<number> {
      return {
        next: () => ({ value: api.next(), done: false }),
      };
    },
  };

  return api;
}

export { int, float, sequence };
export default { int, float, sequence };
