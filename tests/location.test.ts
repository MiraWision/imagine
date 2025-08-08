import { location, seed } from '../src';

describe('location', () => {
  test('country and code from infopedia lists', () => {
    seed(11);
    const name = location.country(false);
    const code = location.countryCode();
    expect(typeof name).toBe('string');
    expect(code).toMatch(/^[A-Z]{2}$/);
  });

  test('timezone and language exist', () => {
    seed(12);
    expect(typeof location.timezone()).toBe('string');
    expect(typeof location.language()).toBe('string');
  });
});
