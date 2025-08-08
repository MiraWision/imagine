import { internet, seed } from '../src';

describe('internet', () => {
  test('ip and ipv6 formats', () => {
    seed(13);
    expect(internet.ip()).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    expect(internet.ipv6()).toMatch(/^(?:[0-9a-f]{4}:){7}[0-9a-f]{4}$/);
  });

  test('url and mac formats', () => {
    const url = internet.url();
    expect(url).toMatch(/^https?:\/\//);
    expect(internet.mac()).toMatch(/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/);
  });
});
