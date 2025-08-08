import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';

/**
 * Roll an N-sided dice (default 6).
 *
 * @param sides - Number of sides (rounded down; minimum 2). Default 6.
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Integer in [1, sides].
 */
function dice(sides = 6, opts?: { seed?: number|string }): number {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const n = Math.max(2, Math.floor(sides));
  return 1 + Math.floor(rng.next() * n);
}

/**
 * Draw a card description from a poker or tarot deck.
 *
 * @param opts - Options.
 * @param opts.deck - 'poker' (default) or 'tarot'.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns Human-readable card (e.g., 'Q♠' or 'The Fool').
 */
function card(opts?: { deck?: 'poker'|'tarot'; seed?: number|string }): string {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const deck = opts?.deck ?? 'poker';
  if (deck === 'tarot') {
    const majors = [
      'The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World'
    ];
    const suits = ['Wands','Cups','Swords','Pentacles'];
    if (rng.next() < 0.2) return majors[Math.floor(rng.next() * majors.length)];
    const ranks = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'];
    return `${ranks[Math.floor(rng.next() * ranks.length)]} of ${suits[Math.floor(rng.next() * suits.length)]}`;
  }
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  return `${ranks[Math.floor(rng.next() * ranks.length)]}${suits[Math.floor(rng.next() * suits.length)]}`;
}

/**
 * Flip a coin.
 *
 * @param opts - Optional settings.
 * @param opts.seed - Local seed to scope this call's RNG.
 * @returns 'heads' or 'tails'.
 */
function coin(opts?: { seed?: number|string }): 'heads'|'tails' {
  const rng = rngFrom(opts?.seed, getGlobalRng());
  return rng.next() < 0.5 ? 'heads' : 'tails';
}

export { dice, card, coin };
export default { dice, card, coin };
