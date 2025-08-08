import { boolean, seed } from '../src';

describe('boolean', () => {
  test('probability clamp and determinism', () => {
    seed(42);
    const a = boolean.bool(2); // clamped to 1
    seed(42);
    const b = boolean.bool(-1); // clamped to 0
    expect(a).toBe(true);
    expect(b).toBe(false);
  });
});
