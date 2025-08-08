import type { RNG } from './prng.js';
import { createRNG } from './prng.js';

let globalRng: RNG = createRNG(0x12345678);

function seed(value: number | string): void {
  globalRng = createRNG(value);
}

function getGlobalRng(): RNG {
  return globalRng;
}

export { seed, getGlobalRng };
