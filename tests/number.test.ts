import imagine, { number, seed } from '../src';

describe('number', () => {
  test('int deterministic with global seed', () => {
    seed(123);
    const a = number.int(10, 20);
    seed(123);
    const b = imagine.number.int(10, 20);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(10);
    expect(a).toBeLessThanOrEqual(20);
  });

  test('float precision and range', () => {
    seed(1);
    const v = number.float(0, 1, 3);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1.0005);
    expect(v.toString()).toMatch(/\d+\.\d{1,3}/);
  });

  test('sequence loops and mapping', () => {
    const seq = number.sequence({ start: 5, end: 7, step: 1, loop: true, map: (x) => x * 2 });
    expect(seq.next()).toBe(10);
    expect(seq.next()).toBe(12);
    expect(seq.next()).toBe(14);
    expect(seq.next()).toBe(10);
  });
});
