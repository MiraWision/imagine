import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';

type FieldGen<T, C = any> = T | (() => T) | ((ctx: C) => T);
type Schema<T> = { [K in keyof T]: FieldGen<T[K], T> };

/**
 * Create an array by calling a factory function `length` times.
 *
 * Determinism:
 * - Uses the global seed unless a local `{ seed }` is provided in `opts`.
 * - Advances the RNG per iteration for stable interleaving with other calls.
 *
 * @param length - Number of elements to produce (rounded down; minimum 0).
 * @param factory - Function producing each value.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns An array of `length` elements.
 */
function array<T>(length: number, factory: () => T, opts?: { seed?: number | string }): T[] {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const n = Math.max(0, Math.floor(length));
  const out: T[] = [];
  for (let i = 0; i < n; i += 1) {
    // advance rng for determinism when mixing with other calls
    rng.next();
    out.push(factory());
  }
  return out;
}

/**
 * Generate an object from a schema of literals and functions.
 *
 * Behavior:
 * - If a field is a function with arity 1, it is called with the partially built object as context.
 * - If a field is a function with arity 0, it is called with no arguments.
 *
 * @param schema - Object whose values may be literals, `() => T`, or `(ctx: T) => T`.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns A newly generated object of type `T`.
 */
function object<T extends Record<string, any>>(schema: Schema<T>, opts?: { seed?: number | string }): T {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const result: any = {};
  for (const key of Object.keys(schema) as Array<keyof T>) {
    const gen = schema[key];
    if (typeof gen === 'function') {
      const fn = gen as ((ctx: T) => T[typeof key]) | (() => T[typeof key]);
      // Prefer ctx-aware if it declares parameters, otherwise zero-arg
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
      result[key] = (fn as any).length > 0 ? (fn as (ctx: T) => T[typeof key])(result) : (fn as () => T[typeof key])();
    } else {
      result[key] = gen;
    }
    rng.next();
  }
  return result as T;
}

/**
 * Generate multiple objects from a schema.
 *
 * @param n - Number of objects to produce (rounded down; minimum 0).
 * @param schema - Schema passed to `object` for each element.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed that deterministically scopes all produced objects.
 * @returns An array of `n` objects of type `T`.
 */
function objectMany<T extends Record<string, any>>(n: number, schema: Schema<T>, opts?: { seed?: number | string }): T[] {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const count = Math.max(0, Math.floor(n));
  const out: T[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(object(schema, { seed: rng.next() * 2 ** 32 }));
  }
  return out;
}

/**
 * Recursively resolve a structure of values and functions into concrete values.
 *
 * Behavior:
 * - Arrays are mapped element-wise via `auto`.
 * - Objects have each property resolved via `auto`.
 * - Functions are invoked (no arguments) and their return values used.
 * - Primitives are returned as-is.
 *
 * @param spec - Any value or structure to resolve.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG and recursive steps.
 * @returns The resolved value with the same shape as `spec`.
 */
function auto<T = any>(spec: any, opts?: { seed?: number | string }): T {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  if (Array.isArray(spec)) {
    return spec.map((item) => auto(item, { seed: rng.next() * 2 ** 32 })) as unknown as T;
  }
  if (spec && typeof spec === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(spec)) {
      out[k] = auto(v as any, { seed: rng.next() * 2 ** 32 });
    }
    return out as T;
  }
  if (typeof spec === 'function') {
    return spec();
  }
  return spec as T;
}

export type { FieldGen, Schema };
export { array, object, objectMany, auto };
export default { array, object, objectMany, auto };
