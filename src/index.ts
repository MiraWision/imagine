import { seed } from './core/seed.js';
import type { RNG } from './core/prng.js';

import * as number from './number/index.js';
import * as boolean from './boolean/index.js';
import * as id from './id/index.js';
import * as string from './string/index.js';
import * as util from './util/index.js';
import * as images from './images/index.js';
import * as person from './person/index.js';
import * as location from './location/index.js';
import * as date from './date/index.js';
import * as internet from './internet/index.js';
import * as color from './color/index.js';
import * as game from './game/index.js';

const imagine = {
  seed,
  number,
  boolean,
  id,
  string,
  person,
  location,
  date,
  internet,
  color,
  game,
  util,
  images,
};

export { seed };
export type { RNG };
export { number, boolean, id, string, util, images, person, location, date, internet, color, game };
export default imagine;
