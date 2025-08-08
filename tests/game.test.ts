import { game, seed } from '../src';

describe('game', () => {
  test('dice within sides', () => {
    seed(15);
    const v = game.dice(20);
    expect(v).toBeGreaterThanOrEqual(1);
    expect(v).toBeLessThanOrEqual(20);
  });

  test('coin is heads or tails', () => {
    const c = game.coin();
    expect(['heads','tails']).toContain(c);
  });
});
