const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const OUT = path.join(__dirname, "..", "public", "icons");

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const TOP = [11, 114, 133];   // #0b7285
const BOTTOM = [15, 181, 166]; // #0fb5a6
const WHITE = [255, 255, 255];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// distance to axis-aligned rounded rect
function roundRectSDF(x, y, x0, y0, x1, y1, r) {
  const qx = Math.abs(x - (x0 + x1) / 2) - (x1 - x0) / 2 + r;
  const qy = Math.abs(y - (y0 + y1) / 2) - (y1 - y0) / 2 + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
}

function segmentSDF(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  const t = l2 ? clamp(((x - x1) * dx + (y - y1) * dy) / l2, 0, 1) : 0;
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function render(size, maskable) {
  const SS = 4;
  const W = size * SS;
  const px = Buffer.alloc(W * W * 4);
  const pad = maskable ? 0 : Math.round(W * 0.085);
  const x0 = pad, y0 = pad, x1 = W - pad, y1 = W - pad;
  const rad = Math.round((W - 2 * pad) * 0.22);
  const cx = W / 2, cy = W / 2;
  const qR = (W - 2 * pad) * 0.285;
  const qW = (W - 2 * pad) * 0.155;
  const qc = { x: cx, y: cy - qR * 0.06 };
  const tailX2 = qc.x + qR * 1.18;
  const tailY2 = qc.y + qR * 1.18;
  const tailX1 = qc.x + qR * 0.68;
  const tailY1 = qc.y + qR * 0.68;

  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const dBg = roundRectSDF(x + 0.5, y + 0.5, x0, y0, x1, y1, rad);
      const bgCov = clamp(0.5 - dBg, 0, 1);

      const t = (x + y) / (2 * W);
      const [r0, g0, b0] = TOP.map((c, i) => clamp(c + (BOTTOM[i] - c) * t, 0, 255));

      const dRing = Math.abs(Math.hypot(x + 0.5 - qc.x, y + 0.5 - qc.y) - qR) - qW / 2;
      const dTail = segmentSDF(x + 0.5, y + 0.5, tailX1, tailY1, tailX2, tailY2) - qW / 2;
      const dQ = Math.min(dRing, dTail);
      const qCov = clamp(0.5 - dQ, 0, 1);

      const i = (y * W + x) * 4;
      // color = gradient background, then white Q blended by qCov
      const aBg = bgCov;
      const r = r0 + (WHITE[0] - r0) * qCov;
      const g = g0 + (WHITE[1] - g0) * qCov;
      const b = b0 + (WHITE[2] - b0) * qCov;
      px[i] = Math.round(r);
      px[i + 1] = Math.round(g);
      px[i + 2] = Math.round(b);
      px[i + 3] = Math.round(aBg * 255);
    }
  }

  const out = Buffer.alloc(size * size * 4);
  const n = SS * SS;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const i = ((y * SS + sy) * W + (x * SS + sx)) * 4;
          r += px[i];
          g += px[i + 1];
          b += px[i + 2];
          a += px[i + 3];
        }
      }
      const o = (y * size + x) * 4;
      out[o] = Math.round(r / n);
      out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(b / n);
      out[o + 3] = Math.round(a / n);
    }
  }
  return out;
}

const svgOutput = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b7285"/>
      <stop offset="1" stop-color="#0fb5a6"/>
    </linearGradient>
  </defs>
  <rect x="44" y="44" width="424" height="424" rx="93" fill="url(#g)"/>
  <circle cx="256" cy="241" r="120" fill="none" stroke="#ffffff" stroke-width="66"/>
  <line x1="335" y1="320" x2="415" y2="400" stroke="#ffffff" stroke-width="66" stroke-linecap="round"/>
</svg>
`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "icon-source.svg"), svgOutput);

const files = [
  { size: 512, file: "icon-512.png", maskable: false },
  { size: 192, file: "icon-192.png", maskable: false },
  { size: 180, file: "apple-touch-icon.png", maskable: false },
  { size: 512, file: "icon-maskable-512.png", maskable: true },
  { size: 192, file: "icon-maskable-192.png", maskable: true },
  { size: 64, file: "favicon-64.png", maskable: false },
];

for (const { size, file, maskable } of files) {
  fs.writeFileSync(path.join(OUT, file), encodePng(size, size, render(size, maskable)));
  console.log("wrote", file);
}