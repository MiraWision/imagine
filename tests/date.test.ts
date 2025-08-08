import { date as d, seed } from '../src';

describe('date', () => {
  test('date range and formats', () => {
    seed(99);
    const iso = d.date({ pastYears: 1, format: 'iso' });
    expect(typeof iso).toBe('string');
    const unix = d.date({ pastYears: 1, format: 'unix' });
    expect(typeof unix).toBe('number');
  });

  test('dayOfTheWeek name', () => {
    const dow = d.dayOfTheWeek();
    expect(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']).toContain(dow);
  });
});
