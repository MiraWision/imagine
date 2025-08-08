import { util, id, seed } from '../src';

describe('util', () => {
  test('array factory count', () => {
    seed(1);
    const arr = util.array(5, () => id.uuid());
    expect(arr).toHaveLength(5);
  });

  test('object schema', () => {
    seed(2);
    const obj = util.object({ a: 1, b: () => 2, c: (ctx: any) => ctx.b + 1 });
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('objectMany count', () => {
    seed(3);
    const arr = util.objectMany(3, { id: () => id.uuid() });
    expect(arr).toHaveLength(3);
    expect(new Set(arr.map((o) => o.id)).size).toBe(3);
  });
});
