import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';

type RGB = { r:number; g:number; b:number };
type RGBA = { r:number; g:number; b:number; a:number };
type HSL = { h:number; s:number; l:number };
type HSLA = { h:number; s:number; l:number; a:number };
type HSV = { h:number; s:number; v:number };
type CMYK = { c:number; m:number; y:number; k:number };

/**
 * Return a hex color string.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns String like '#aabbcc'.
 */
function hex(opts?: { seed?: number|string }): string {
  const { r, g, b } = rgb(opts);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

/**
 * Return a hex color with alpha.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns String like '#aabbccdd' (last two hex digits are alpha 00..ff).
 */
function hexa(opts?: { seed?: number|string }): string {
  const { r, g, b, a } = rgba(opts);
  const aa = Math.round(a * 255);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}${aa.toString(16).padStart(2,'0')}`;
}

/**
 * Return an RGB color.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Object { r,g,b } with channels 0..255.
 */
function rgb(opts?: { seed?: number|string }): RGB {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return { r: Math.floor(rng.next() * 256), g: Math.floor(rng.next() * 256), b: Math.floor(rng.next() * 256) };
}

/**
 * Return an RGBA color.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Object { r,g,b,a } where r,g,b 0..255 and a in 0..1.
 */
function rgba(opts?: { seed?: number|string }): RGBA {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return { r: Math.floor(rng.next() * 256), g: Math.floor(rng.next() * 256), b: Math.floor(rng.next() * 256), a: Math.round(rng.next() * 100) / 100 };
}

/**
 * Return an HSL color.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Object { h,s,l } with h 0..360 and s,l 0..100.
 */
function hsl(opts?: { seed?: number|string }): HSL {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return { h: Math.round(rng.next() * 360), s: Math.round(rng.next() * 100), l: Math.round(rng.next() * 100) };
}

/**
 * Return an HSLA color.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Object { h,s,l,a } with h 0..360, s,l 0..100, a 0..1.
 */
function hsla(opts?: { seed?: number|string }): HSLA {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return { h: Math.round(rng.next() * 360), s: Math.round(rng.next() * 100), l: Math.round(rng.next() * 100), a: Math.round(rng.next() * 100) / 100 };
}

/**
 * Return an HSV color.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Object { h,s,v } with h 0..360, s,v 0..100.
 */
function hsv(opts?: { seed?: number|string }): HSV {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return { h: Math.round(rng.next() * 360), s: Math.round(rng.next() * 100), v: Math.round(rng.next() * 100) };
}

/**
 * Return a CMYK color.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Object { c,m,y,k } with each in 0..100.
 */
function cmyk(opts?: { seed?: number|string }): CMYK {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return { c: Math.round(rng.next() * 100), m: Math.round(rng.next() * 100), y: Math.round(rng.next() * 100), k: Math.round(rng.next() * 100) };
}

export type { RGB, RGBA, HSL, HSLA, HSV, CMYK };
export { hex, hexa, rgb, rgba, hsl, hsla, hsv, cmyk };
export default { hex, hexa, rgb, rgba, hsl, hsla, hsv, cmyk };
