interface RNG {
  next(): number; // [0,1)
  int(min: number, max: number): number; // inclusive
  float(min: number, max: number): number; // [min, max)
  pick<T>(arr: readonly T[]): T;
}

function toSeed(input: number | string): number {
  if (typeof input === 'number') return input >>> 0;
  // FNV-1a 32-bit hash for strings
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return hash >>> 0;
}

// Mulberry32 PRNG — fast and decent for mocks
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createRNG(seed: number | string): RNG {
  const s = toSeed(seed);
  const next = mulberry32(s);
  return {
    next,
    int(min: number, max: number) {
      if (!Number.isFinite(min) || !Number.isFinite(max)) throw new TypeError('int: min/max must be finite numbers');
      if (min > max) [min, max] = [max, min];
      const lo = Math.ceil(min);
      const hi = Math.floor(max);
      return Math.floor(next() * (hi - lo + 1)) + lo;
    },
    float(min: number, max: number) {
      if (!Number.isFinite(min) || !Number.isFinite(max)) throw new TypeError('float: min/max must be finite numbers');
      if (min > max) [min, max] = [max, min];
      return next() * (max - min) + min;
    },
    pick<T>(arr: readonly T[]): T {
      if (arr.length === 0) throw new RangeError('pick: array is empty');
      const i = Math.floor(next() * arr.length);
      return arr[i]!;
    },
  };
}

function rngFrom(seed?: number | string, fallback?: RNG): RNG {
  return seed !== undefined ? createRNG(seed) : fallback ?? createRNG(0xdecafbad);
}

export type { RNG };
export { createRNG, rngFrom };
