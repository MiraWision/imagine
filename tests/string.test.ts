import { string as s, seed } from '../src';

describe('string', () => {
  test('char from charset', () => {
    seed(1);
    const ch = s.char('AB');
    expect(['A','B']).toContain(ch);
  });

  test('string length', () => {
    seed(2);
    expect(s.string(10).length).toBe(10);
  });

  test('pattern tokens', () => {
    seed(3);
    const out = s.pattern('Aa#@!.\\-');
    expect(out.length).toBe(7);
  });
});
