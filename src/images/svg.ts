import { rngFrom } from '../core/prng.js';
import { getGlobalRng } from '../core/seed.js';

type ImageOut = 'string' | 'buffer' | 'dataUrl';

/**
 * Convert raw SVG markup to a requested output type.
 *
 * @param svg - Raw SVG string to convert.
 * @param as - Output format: 'string' (default), 'buffer', or 'dataUrl'.
 * @returns The SVG as a string, Buffer, or data URL string.
 */
function toOutput(svg: string, as: ImageOut = 'string'): string | Buffer {
  if (as === 'string') return svg;
  const data = Buffer.from(svg, 'utf8');
  if (as === 'buffer') return data;
  const b64 = data.toString('base64');
  return `data:image/svg+xml;base64,${b64}`;
}

/**
 * Wrap a set of SVG nodes into a valid standalone SVG document.
 *
 * @param width - Width in pixels.
 * @param height - Height in pixels.
 * @param body - Inner SVG content (shapes, text, etc.).
 * @param oneline - If true, strips newlines for compact output.
 * @returns A complete SVG document string.
 */
function svgWrap(width: number, height: number, body: string, oneline?: boolean): string {
  const content = oneline ? body.replace(/\n+/g, '') : body;
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`;
}

/**
 * Generate a deterministic SVG avatar.
 *
 * Styles:
 * - 'identicon' (default): symmetric 5x5 blocks.
 * - 'initials': uses 1–2 letters (from `initials` or derived externally).
 * - 'rings': concentric stroked circles.
 * - 'blocks': mirrored block mosaic.
 *
 * @param opts - Avatar options.
 * @param opts.seed - Local seed for deterministic art.
 * @param opts.size - Square size in px (default 96).
 * @param opts.style - One of 'identicon' | 'initials' | 'rings' | 'blocks'.
 * @param opts.initials - When style='initials', text to display (1–2 chars).
 * @param opts.palette - Optional color palette.
 * @param opts.as - Output type: 'string' | 'buffer' | 'dataUrl' (default 'string').
 * @param opts.oneline - When true, output has no newlines.
 * @returns SVG as string, Buffer, or data URL.
 */
function avatar(opts?: { seed?: number | string; size?: number; style?: 'identicon' | 'initials' | 'rings' | 'blocks'; initials?: string; palette?: string[]; as?: ImageOut; oneline?: boolean }): string | Buffer {
  const size = opts?.size ?? 96;
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const palette = opts?.palette ?? ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const bg = palette[Math.floor(rng.next() * palette.length)];
  const style = opts?.style ?? 'identicon';
  let body = `<rect width="100%" height="100%" fill="${bg}"/>`;
  if (style === 'initials') {
    const initials = (opts?.initials ?? 'AA').slice(0, 2).toUpperCase();
    body += `<text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="${Math.floor(size * 0.5)}" font-family="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif" fill="#fff">${initials}</text>`;
  } else if (style === 'rings') {
    const rings = 3 + Math.floor(rng.next() * 3);
    for (let i = 0; i < rings; i += 1) {
      const r = Math.floor((size / 2) * (0.2 + 0.7 * (i / rings)));
      const color = palette[Math.floor(rng.next() * palette.length)];
      body += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${Math.max(2, Math.floor(size * 0.03))}"/>`;
    }
  } else if (style === 'blocks') {
    const cell = Math.floor(size / 6);
    for (let y = 0; y < 6; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        const color = palette[Math.floor(rng.next() * palette.length)];
        if (rng.next() < 0.5) continue;
        const px = x * cell;
        const py = y * cell;
        const w = cell;
        const h = cell;
        body += `<rect x="${px}" y="${py}" width="${w}" height="${h}" fill="${color}"/>`;
        body += `<rect x="${size - px - w}" y="${py}" width="${w}" height="${h}" fill="${color}"/>`;
      }
    }
  } else {
    // identicon
    const cell = Math.floor(size / 5);
    const fg = palette[Math.floor(rng.next() * palette.length)];
    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        if (rng.next() < 0.5) continue;
        const px = x * cell;
        const py = y * cell;
        const w = cell;
        const h = cell;
        body += `<rect x="${px}" y="${py}" width="${w}" height="${h}" fill="${fg}"/>`;
        body += `<rect x="${size - px - w}" y="${py}" width="${w}" height="${h}" fill="${fg}"/>`;
      }
    }
  }
  const svg = svgWrap(size, size, body, opts?.oneline);
  return toOutput(svg, opts?.as ?? 'string');
}

/**
 * Generate a background pattern SVG.
 *
 * Types:
 * - 'triangles' (default): random polygons
 * - 'grid': filled squares on a grid
 * - 'dots': circular dot grid
 * - 'waves': sine-like horizontal polylines
 * - 'hex': hexagon tiling
 *
 * @param opts - Pattern options.
 * @param opts.seed - Local seed for determinism.
 * @param opts.width - Width in px (default 320).
 * @param opts.height - Height in px (default 180).
 * @param opts.type - Pattern type.
 * @param opts.palette - Optional palette.
 * @param opts.as - Output type: 'string' | 'buffer' | 'dataUrl' (default 'string').
 * @param opts.oneline - When true, output has no newlines.
 * @returns SVG as string, Buffer, or data URL.
 */
function pattern(opts?: { seed?: number | string; width?: number; height?: number; type?: 'triangles' | 'grid' | 'dots' | 'waves' | 'hex'; palette?: string[]; as?: ImageOut; oneline?: boolean }): string | Buffer {
  const width = opts?.width ?? 320;
  const height = opts?.height ?? 180;
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const type = opts?.type ?? 'triangles';
  const palette = opts?.palette ?? ['#f5f5f5', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280'];
  let body = '';
  if (type === 'grid') {
    const cell = 20;
    body += `<rect width="100%" height="100%" fill="${palette[0]}"/>`;
    for (let y = 0; y < height; y += cell) {
      for (let x = 0; x < width; x += cell) {
        if (rng.next() < 0.5) continue;
        const color = palette[1 + Math.floor(rng.next() * (palette.length - 1))];
        body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${color}"/>`;
      }
    }
  } else if (type === 'dots') {
    body += `<rect width="100%" height="100%" fill="${palette[0]}"/>`;
    const r = 3;
    for (let y = r; y < height; y += 12) {
      for (let x = r; x < width; x += 12) {
        const color = palette[1 + Math.floor(rng.next() * (palette.length - 1))];
        body += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
      }
    }
  } else if (type === 'waves') {
    body += `<rect width="100%" height="100%" fill="${palette[0]}"/>`;
    const rows = 8;
    const amp = 6;
    const step = width / 20;
    for (let r = 0; r < rows; r += 1) {
      const color = palette[1 + Math.floor(rng.next() * (palette.length - 1))];
      let d = '';
      for (let x = 0; x <= width; x += step) {
        const y = (height / rows) * r + (height / rows) / 2 + Math.sin((x / width) * Math.PI * 2) * amp;
        d += `${x === 0 ? 'M' : 'L'}${x},${y} `;
      }
      body += `<path d="${d}" stroke="${color}" stroke-width="2" fill="none"/>`;
    }
  } else if (type === 'hex') {
    body += `<rect width="100%" height="100%" fill="${palette[0]}"/>`;
    const s = 8;
    const h = Math.sin(Math.PI / 3) * s;
    for (let y = 0; y < height + s; y += 2 * h) {
      for (let x = 0; x < width + s; x += 1.5 * s) {
        const cx = x + ((Math.floor(y / (2 * h)) % 2) ? 0.75 * s : 0);
        const cy = y;
        const color = palette[1 + Math.floor(rng.next() * (palette.length - 1))];
        const points = [
          [cx - s / 2, cy - h], [cx + s / 2, cy - h], [cx + s, cy], [cx + s / 2, cy + h], [cx - s / 2, cy + h], [cx - s, cy]
        ].map((p) => p.join(',')).join(' ');
        body += `<polygon points="${points}" fill="${color}"/>`;
      }
    }
  } else {
    // triangles
    body += `<rect width="100%" height="100%" fill="${palette[0]}"/>`;
    for (let i = 0; i < 200; i += 1) {
      const x1 = Math.floor(rng.next() * width);
      const y1 = Math.floor(rng.next() * height);
      const x2 = Math.floor(rng.next() * width);
      const y2 = Math.floor(rng.next() * height);
      const x3 = Math.floor(rng.next() * width);
      const y3 = Math.floor(rng.next() * height);
      const color = palette[1 + Math.floor(rng.next() * (palette.length - 1))];
      body += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${color}" opacity="0.7"/>`;
    }
  }
  const svg = svgWrap(width, height, body, opts?.oneline);
  return toOutput(svg, opts?.as ?? 'string');
}

/**
 * Generate a rectangular placeholder SVG.
 *
 * @param opts - Placeholder options.
 * @param opts.width - Width in px.
 * @param opts.height - Height in px.
 * @param opts.text - Optional centered text (default "{width}×{height}").
 * @param opts.bg - Background color (default gray).
 * @param opts.fg - Text color (default near-black).
 * @param opts.as - Output type: 'string' | 'buffer' | 'dataUrl' (default 'string').
 * @param opts.oneline - When true, output has no newlines.
 * @returns SVG as string, Buffer, or data URL.
 */
function placeholder(opts: { width: number; height: number; text?: string; bg?: string; fg?: string; as?: ImageOut; oneline?: boolean }): string | Buffer {
  const { width, height } = opts;
  if (!Number.isFinite(width) || !Number.isFinite(height)) throw new TypeError('placeholder: width/height must be numbers');
  const bg = opts.bg ?? '#e5e7eb';
  const fg = opts.fg ?? '#111827';
  const text = opts.text ?? `${width}×${height}`;
  const body = `<rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="${Math.floor(Math.min(width, height) / 5)}" font-family="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif" fill="${fg}">${text}</text>`;
  const svg = svgWrap(width, height, body, opts.oneline);
  return toOutput(svg, opts.as ?? 'string');
}

/**
 * Generate an initials-based SVG avatar.
 *
 * @param opts - Initials options.
 * @param opts.text - Text to extract initials from (first two characters used).
 * @param opts.size - Square size in px (default 96).
 * @param opts.bg - Background color (default green).
 * @param opts.fg - Text color (default white).
 * @param opts.fontFamily - Optional font-family CSS value.
 * @param opts.as - Output type: 'string' | 'buffer' | 'dataUrl' (default 'string').
 * @param opts.oneline - When true, output has no newlines.
 * @returns SVG as string, Buffer, or data URL.
 */
function initials(opts: { text: string; size?: number; bg?: string; fg?: string; fontFamily?: string; as?: ImageOut; oneline?: boolean }): string | Buffer {
  const size = opts.size ?? 96;
  const bg = opts.bg ?? '#10b981';
  const fg = opts.fg ?? '#ffffff';
  const initials = (opts.text || 'AA').slice(0, 2).toUpperCase();
  const body = `<rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="${Math.floor(size * 0.5)}" font-family="${opts.fontFamily ?? 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif'}" fill="${fg}">${initials}</text>`;
  const svg = svgWrap(size, size, body, opts.oneline);
  return toOutput(svg, opts.as ?? 'string');
}

/**
 * Generate a decorative set of random shapes in an SVG.
 *
 * @param opts - Shape set options.
 * @param opts.seed - Local seed for determinism.
 * @param opts.width - Width in px (default 320).
 * @param opts.height - Height in px (default 180).
 * @param opts.shapes - Shape types to include (default ['rect','circle','line']).
 * @param opts.count - Number of shapes (default 30).
 * @param opts.palette - Optional palette.
 * @param opts.as - Output type: 'string' | 'buffer' | 'dataUrl' (default 'string').
 * @param opts.oneline - When true, output has no newlines.
 * @returns SVG as string, Buffer, or data URL.
 */
function shapeSet(opts?: { seed?: number | string; width?: number; height?: number; shapes?: Array<'rect'|'circle'|'line'|'poly'>; count?: number; palette?: string[]; as?: ImageOut; oneline?: boolean }): string | Buffer {
  const width = opts?.width ?? 320;
  const height = opts?.height ?? 180;
  const rng = rngFrom(opts?.seed, getGlobalRng());
  const palette = opts?.palette ?? ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const shapes = opts?.shapes ?? ['rect', 'circle', 'line'];
  const count = opts?.count ?? 30;
  let body = `<rect width="100%" height="100%" fill="#ffffff"/>`;
  for (let i = 0; i < count; i += 1) {
    const kind = shapes[Math.floor(rng.next() * shapes.length)];
    const color = palette[Math.floor(rng.next() * palette.length)];
    if (kind === 'rect') {
      const x = Math.floor(rng.next() * width);
      const y = Math.floor(rng.next() * height);
      const w = Math.floor(rng.next() * (width / 3));
      const h = Math.floor(rng.next() * (height / 3));
      body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="0.7"/>`;
    } else if (kind === 'circle') {
      const cx = Math.floor(rng.next() * width);
      const cy = Math.floor(rng.next() * height);
      const r = Math.floor(rng.next() * Math.min(width, height) / 6);
      body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.7"/>`;
    } else if (kind === 'line') {
      const x1 = Math.floor(rng.next() * width);
      const y1 = Math.floor(rng.next() * height);
      const x2 = Math.floor(rng.next() * width);
      const y2 = Math.floor(rng.next() * height);
      body += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"/>`;
    } else {
      const points = [] as string[];
      const countP = 3 + Math.floor(rng.next() * 5);
      for (let p = 0; p < countP; p += 1) {
        const x = Math.floor(rng.next() * width);
        const y = Math.floor(rng.next() * height);
        points.push(`${x},${y}`);
      }
      body += `<polygon points="${points.join(' ')}" fill="${color}" opacity="0.6"/>`;
    }
  }
  const svg = svgWrap(width, height, body, opts?.oneline);
  return toOutput(svg, opts?.as ?? 'string');
}

export type { ImageOut };
export { avatar, pattern, placeholder, initials, shapeSet };
export default { avatar, pattern, placeholder, initials, shapeSet };
