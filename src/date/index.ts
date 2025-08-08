import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';
// Import JSON datasets directly to avoid bringing external TS sources into DTS build
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import monthsData from '../../../infopedia/src/data/months.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import weekdaysData from '../../../infopedia/src/data/weekdays.json';

const months = monthsData as ReadonlyArray<{ index: number; name: string; short: string }>;
const weekdays = weekdaysData as ReadonlyArray<{ index: number; name: string; short: string }>;

type DateFormat = 'iso'|'unix'|'utc'|'local'|string;

function parseMaybeDate(input?: Date | string): Date | undefined {
  if (input === undefined) return undefined;
  if (input instanceof Date) return input;
  const d = new Date(input);
  if (isNaN(d.getTime())) throw new TypeError('Invalid date');
  return d;
}

/**
 * Generate a random date within a range or relative period.
 *
 * Behavior:
 * - If `pastYears` is set, returns a date in [now - pastYears, now].
 * - If `futureYears` is set, returns a date in [now, now + futureYears].
 * - Otherwise, uses `[start, end]` (defaults to 2000-01-01..2030-12-31).
 * - If `start > end`, values are swapped.
 *
 * Formats:
 * - 'iso' -> ISO string
 * - 'unix' -> Unix seconds (number)
 * - 'utc' -> UTC string
 * - 'local' -> Local `Date.toString()`
 * - other strings -> ISO string (fallback)
 *
 * @param opts - Date generation options.
 * @param opts.start - Range start (Date or parseable string).
 * @param opts.end - Range end (Date or parseable string).
 * @param opts.pastYears - Override to past N years.
 * @param opts.futureYears - Override to future N years.
 * @param opts.format - Return format.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Date object or formatted string/number per `format`.
 * @throws TypeError if provided date strings are invalid.
 */
function date(opts?: { start?: Date|string; end?: Date|string; pastYears?: number; futureYears?: number; format?: DateFormat; seed?: number|string }): Date | string | number {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const now = new Date();
  let start = parseMaybeDate(opts?.start);
  let end = parseMaybeDate(opts?.end);
  if (opts?.pastYears !== undefined) {
    const y = Math.max(0, Math.floor(opts.pastYears));
    start = new Date(now);
    start.setFullYear(start.getFullYear() - y);
    end = now;
  }
  if (opts?.futureYears !== undefined) {
    const y = Math.max(0, Math.floor(opts.futureYears));
    start = now;
    end = new Date(now);
    end.setFullYear(end.getFullYear() + y);
  }
  if (!start) start = new Date(2000, 0, 1);
  if (!end) end = new Date(2030, 11, 31);
  if (start > end) [start, end] = [end, start];
  const t = start.getTime() + Math.floor(rng.next() * (end.getTime() - start.getTime() + 1));
  const d = new Date(t);
  const format = opts?.format ?? undefined;
  if (!format) return d;
  if (format === 'iso') return d.toISOString();
  if (format === 'unix') return Math.floor(d.getTime() / 1000);
  if (format === 'utc') return d.toUTCString();
  if (format === 'local') return d.toString();
  // custom: Intl.DateTimeFormat pattern is out-of-scope v1; return ISO for unknown strings
  return d.toISOString();
}

/**
 * Return a time string in HH:MM:SS format (24-hour).
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns String like '08:03:47'.
 */
function time(opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const h = Math.floor(rng.next() * 24);
  const m = Math.floor(rng.next() * 60);
  const s = Math.floor(rng.next() * 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Return a Unix timestamp (seconds).
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Number of seconds since the Unix epoch.
 */
function timestamp(opts?: { seed?: number|string }): number {
  const d = date({ pastYears: 10, format: 'unix', seed: opts?.seed });
  return d as number;
}

/**
 * Return a random year within an inclusive range.
 *
 * @param start - Lower bound (inclusive). Defaults to 1970.
 * @param end - Upper bound (inclusive). Defaults to 2099.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Integer year in [start, end].
 */
function year(start = 1970, end = 2099, opts?: { seed?: number|string }): number {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  if (start > end) [start, end] = [end, start];
  return Math.floor(rng.next() * (end - start + 1)) + start;
}

/**
 * Return a month as index (1..12) or English name.
 *
 * @param opts - Options.
 * @param opts.as - 'index' (default) or 'name'.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Month index or name.
 */
function month(opts?: { as?: 'index'|'name', seed?: number|string }): number|string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const m = months[Math.floor(rng.next() * months.length)];
  return opts?.as === 'name' ? m.name : m.index;
}

/**
 * Return a day number in [1, 28] for broad compatibility.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Day number from 1 to 28.
 */
function day(opts?: { seed?: number|string }): number {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return 1 + Math.floor(rng.next() * 28);
}

/**
 * Return a weekday English name.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'.
 */
function dayOfTheWeek(opts?: { seed?: number|string }): 'Sunday'|'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday' {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const w = weekdays[Math.floor(rng.next() * weekdays.length)];
  return w.name as any;
}

export type { DateFormat };
export { date, time, timestamp, year, month, day, dayOfTheWeek };
export default { date, time, timestamp, year, month, day, dayOfTheWeek };
