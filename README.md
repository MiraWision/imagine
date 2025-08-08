# @mirawision/imagine

Deterministic random data generator for mocks, seeds, demos, and tests.

ESM-first, TypeScript-typed, fully deterministic via global or local seeds. Pragmatic faker-style API plus SVG helpers for avatars and patterns.

## Features

- Deterministic: Global `seed(value)` and per-call `{ seed }`
- Typed: Full TypeScript definitions
- Tree-shakable: ESM modules and scoped imports
- Rich domains: number, boolean, id, string, person, location, date, internet, color, game, util, images (SVG)

## Installation

```bash
npm install @mirawision/imagine
```

or

```bash
yarn add @mirawision/imagine
```

## Usage

### Basic example

```ts
import imagine, { seed, number, string, person, images } from 'imagine';

seed(123);

const n = number.int(10, 20);
const sku = string.pattern('AAA-####-!!');
const name = person.fullName();
const avatar = images.avatar({ seed: name, style: 'identicon', as: 'string' });

// via default object
const hex = imagine.color.hex();
```

### Scoped imports (tree-shaking)

```ts
import { number } from 'imagine/number';
import { avatar } from 'imagine/images';

const id = number.int(1, 100);
const svg = avatar({ seed: id, as: 'string' });
```

### Local vs global seeds

```ts
import { seed, string } from 'imagine';

seed(2024); // global seed for deterministic runs

const a = string.word();                 // uses global seed
const b = string.word({ seed: 'test' }); // independent local seed
```

### Location helpers (with infopedia)

```ts
import { location } from 'imagine';

const countryName = location.country();     // e.g. "Poland"
const countryCode = location.countryCode(); // e.g. "PL"
const tz = location.timezone();             // e.g. "Europe/Warsaw"
```

### SVG images

```ts
import { images } from 'imagine';

const svgStr = images.placeholder({ width: 320, height: 180, text: 'Hello' });
const dataUrl = images.pattern({ seed: 1, type: 'hex', as: 'dataUrl' }) as string;
```

## API Overview

- seed(value): set global seed
- number: `int`, `float`, `sequence`
- boolean: `bool(probability)`
- id: `uuid`, `hash`, `slug`
- string: `char`, `string`, `word`, `sentence`, `paragraph`, `pattern`
- person: `firstName`, `lastName`, `fullName`, `username`, `email`, `password`, `avatar`, `phone`
- location: `country`, `countryCode`, `city`, `address`, `zip`, `coordinates`, `timezone`, `language`
- date: `date`, `time`, `timestamp`, `year`, `month`, `day`, `dayOfTheWeek`
- internet: `ip`, `ipv6`, `domain`, `url`, `mac`, `userAgent`
- color: `hex`, `hexa`, `rgb/rgba`, `hsl/hsla`, `hsv`, `cmyk`
- game: `dice`, `card`, `coin`
- util: `array`, `object`, `objectMany`, `auto`
- images: `avatar`, `pattern`, `placeholder`, `initials`, `shapeSet`

## Determinism

All generators accept an optional `{ seed?: number | string }` to isolate randomness per call without affecting the global sequence. Use `seed(value)` at app/test start for predictable, repeatable results.

## TypeScript & ESM

- ESM-only outputs with `.d.ts` types
- Node.js 18+ and modern browsers supported
- Prefer scoped imports for best tree-shaking (`import { number } from 'imagine/number'`)

## Contributing

Contributions are always welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. 