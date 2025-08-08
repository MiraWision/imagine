import { images, seed } from '../src';

describe('images/svg', () => {
  test('avatar determinism and svg prefix', () => {
    seed(123);
    const a = images.avatar({ seed: 1, as: 'string' }) as string;
    const b = images.avatar({ seed: 1, as: 'string' }) as string;
    expect(a).toBe(b);
    expect(a.startsWith('<?xml')).toBe(true);
    expect(a.includes('<svg')).toBe(true);
  });

  test('pattern data url', () => {
    const data = images.pattern({ seed: 2, as: 'dataUrl' }) as string;
    expect(data.startsWith('data:image/svg+xml;base64,')).toBe(true);
  });
});
