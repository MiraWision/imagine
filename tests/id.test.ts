import { id, seed } from '../src';

describe('id', () => {
  test('uuid shape and determinism', () => {
    seed(7);
    const a = id.uuid();
    seed(7);
    const b = id.uuid();
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  test('hash length', () => {
    seed(8);
    expect(id.hash(8)).toHaveLength(8);
  });

  test('slug words count', () => {
    seed(9);
    const s = id.slug(3);
    expect(s.split('-')).toHaveLength(3);
  });
});
