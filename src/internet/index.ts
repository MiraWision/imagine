import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';
import { slug } from '../id/index.js';

/**
 * Return a random IPv4 address in dotted-quad notation.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns String like '203.0.113.12'.
 */
function ip(opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const o = () => Math.floor(rng.next() * 256);
  return `${o()}.${o()}.${o()}.${o()}`;
}

/**
 * Return a random IPv6 address as eight 16-bit hex segments.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns String like '2001:0db8:85a3:0000:0000:8a2e:0370:7334'.
 */
function ipv6(opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const seg = () => Math.floor(rng.next() * 0xffff).toString(16).padStart(4, '0');
  return `${seg()}:${seg()}:${seg()}:${seg()}:${seg()}:${seg()}:${seg()}:${seg()}`;
}

/**
 * Return a random domain name.
 *
 * @param tld - Optional top-level domain (e.g., 'org'). Default 'com'.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Domain like 'alpha-bravo.com'.
 */
function domain(tld?: string, opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const s = slug(2, { seed: rng.next() * 2 ** 32 });
  const t = (tld && tld.replace(/^\./, '')) || 'com';
  return `${s}.${t}`;
}

/**
 * Return a random URL.
 *
 * @param protocols - Optional allowed protocols (default ['https','http']).
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns URL like 'https://alpha-bravo.com/foo/bar'.
 */
function url(protocols?: string[], opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const protos = protocols && protocols.length ? protocols : ['https', 'http'];
  const proto = protos[Math.floor(rng.next() * protos.length)];
  const host = domain(undefined, { seed: rng.next() * 2 ** 32 });
  const path = slug(2 + Math.floor(rng.next() * 2), { seed: rng.next() * 2 ** 32 }).replace(/-/g, '/');
  return `${proto}://${host}/${path}`;
}

/**
 * Return a random MAC address.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Lowercased hex string like 'aa:bb:cc:dd:ee:ff'.
 */
function mac(opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const seg = () => Math.floor(rng.next() * 256).toString(16).padStart(2, '0');
  return `${seg()}:${seg()}:${seg()}:${seg()}:${seg()}:${seg()}`;
}

/**
 * Return a plausible browser user agent string.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns UA string for Chrome, Firefox, Safari, or Edge.
 */
function userAgent(opts?: { seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const os = ['Windows NT 10.0', 'Macintosh; Intel Mac OS X 13_5', 'X11; Linux x86_64', 'iPhone; CPU iPhone OS 16_5 like Mac OS X'];
  const b = browsers[Math.floor(rng.next() * browsers.length)];
  const o = os[Math.floor(rng.next() * os.length)];
  const ver = `${Math.floor(60 + rng.next() * 40)}.0.${Math.floor(rng.next() * 4000)}`;
  if (b === 'Safari') return `Mozilla/5.0 (${o}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${Math.floor(16 + rng.next() * 4)}.0 Safari/605.1.15`;
  if (b === 'Firefox') return `Mozilla/5.0 (${o}; rv:${Math.floor(90 + rng.next() * 20)}.0) Gecko/20100101 Firefox/${ver}`;
  if (b === 'Edge') return `Mozilla/5.0 (${o}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ver} Safari/537.36 Edg/${ver}`;
  return `Mozilla/5.0 (${o}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ver} Safari/537.36`;
}

export { ip, ipv6, domain, url, mac, userAgent };
export default { ip, ipv6, domain, url, mac, userAgent };
