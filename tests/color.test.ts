import { color, seed } from '../src';

describe('color', () => {
  test('hex and hexa formats', () => {
    seed(14);
    expect(color.hex()).toMatch(/^#[0-9a-f]{6}$/);
    expect(color.hexa()).toMatch(/^#[0-9a-f]{8}$/);
  });

  test('rgb/hsl ranges', () => {
    const { r, g, b } = color.rgb();
    expect(r).toBeGreaterThanOrEqual(0); expect(r).toBeLessThanOrEqual(255);
    expect(g).toBeGreaterThanOrEqual(0); expect(g).toBeLessThanOrEqual(255);
    expect(b).toBeGreaterThanOrEqual(0); expect(b).toBeLessThanOrEqual(255);
    const { h, s, l } = color.hsl();
    expect(h).toBeGreaterThanOrEqual(0); expect(h).toBeLessThanOrEqual(360);
    expect(s).toBeGreaterThanOrEqual(0); expect(s).toBeLessThanOrEqual(100);
    expect(l).toBeGreaterThanOrEqual(0); expect(l).toBeLessThanOrEqual(100);
  });
});
