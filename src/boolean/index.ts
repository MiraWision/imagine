import { clamp } from '../core/utils.js';
import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';

/**
 * Return a boolean given a probability of truthiness.
 *
 * Determinism:
 * - Uses the global seed unless a local `{ seed }` is provided in `opts`.
 *
 * Behavior:
 * - `probability` is clamped to [0, 1].
 *
 * @param probability - Chance of returning true (default 0.5). Values are clamped.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns `true` with probability `p`, otherwise `false`.
 */
function bool(probability = 0.5, opts?: { seed?: number | string }): boolean {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const p = clamp(probability, 0, 1);
  return rng.next() < p;
}

export { bool };
export default { bool };
