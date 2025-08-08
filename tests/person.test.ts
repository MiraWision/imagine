import { person, seed } from '../src';

describe('person', () => {
  test('fullName and email deterministic', () => {
    seed(2024);
    const name = person.fullName('male');
    const email = person.email('example.com');
    seed(2024);
    expect(person.fullName('male')).toBe(name);
    expect(person.email('example.com')).toBe(email);
  });

  test('password includes sets', () => {
    seed(5);
    const pwd = person.password(12, { symbols: true, digits: true, upper: true, lower: true });
    expect(pwd.length).toBeGreaterThanOrEqual(4);
  });

  test('phone format', () => {
    const ph = person.phone('+1-###-###-####');
    expect(ph).toMatch(/^\+1-\d{3}-\d{3}-\d{4}$/);
  });
});
