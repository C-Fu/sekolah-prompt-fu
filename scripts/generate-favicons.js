#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Generates the Peromfu favicon set from the canonical pixel-art character.
 *
 * Source of truth for the artwork is the inline `PixelRobot` / `public/peromfu.svg`
 * (viewBox "0 0 16 20", palette: body #4A90D9, antenna #FFD700, silver #C0C0C0,
 * eyes/mouth #333). This script composes a square icon of the Peromfu head on the
 * app's sky-blue gradient background and rasterizes it with `sharp` (already a
 * transitive dependency of Next.js) into every favicon size the app references:
 *
 *   favicon.svg                   (vector, rounded-square icon)
 *   favicon.ico                   (16/32/48 multi-size ICO)
 *   favicon-96x96.png
 *   apple-touch-icon.png          (180x180)
 *   web-app-manifest-192x192.png
 *   web-app-manifest-512x512.png
 *
 * Run with: npm run icons
 * The commit-checked output lives in `public/favicon/`, so this is a one-off /
 * regeneration script rather than part of the build.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "favicon");

// Peromfu palette (mirrors src/components/kids/elements/pixel-art.tsx).
const BODY = "#4A90D9";
const ANTENNA = "#FFD700";
const SILVER = "#C0C0C0";
const DARK = "#333333";
const EYE_WHITE = "#FFFFFF";

/**
 * The icon artwork on a 16x20 character grid, centred inside a 20x20 icon tile
 * (2-unit margin all round). Head-forward crop: antenna, head, eyes, smile —
 * the character's most recognisable silhouette at tiny favicon sizes.
 */
function buildIconSvg() {
  // 20x20 tile; Peromfu head occupies y=2..12 with the antenna above it.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" shape-rendering="crispEdges" style="image-rendering: pixelated;">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4A90D9"/>
      <stop offset="30%" stop-color="#87CEEB"/>
      <stop offset="60%" stop-color="#98D8F0"/>
      <stop offset="100%" stop-color="#B8E8F8"/>
    </linearGradient>
    <clipPath id="rounded">
      <rect x="0" y="0" width="20" height="20" rx="4" ry="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#rounded)">
    <rect x="0" y="0" width="20" height="20" fill="url(#sky)"/>
    <!-- Antenna -->
    <rect x="9" y="3" width="2" height="2" fill="${ANTENNA}"/>
    <rect x="8" y="5" width="4" height="1" fill="${SILVER}"/>
    <!-- Head -->
    <rect x="4" y="6" width="12" height="8" fill="${BODY}"/>
    <!-- Eyes -->
    <rect x="6" y="8" width="3" height="3" fill="${EYE_WHITE}"/>
    <rect x="11" y="8" width="3" height="3" fill="${EYE_WHITE}"/>
    <rect x="7" y="9" width="2" height="2" fill="${DARK}"/>
    <rect x="12" y="9" width="2" height="2" fill="${DARK}"/>
    <!-- Smile -->
    <rect x="8" y="12" width="4" height="1" fill="${DARK}"/>
    <rect x="7" y="11" width="1" height="1" fill="${DARK}"/>
    <rect x="12" y="11" width="1" height="1" fill="${DARK}"/>
  </g>
</svg>
`;
}

/** Rasterize the icon SVG to a PNG buffer at `size`x`size`. */
async function png(size) {
  const svg = Buffer.from(buildIconSvg());
  return sharp(svg, { density: 384 })
    .resize(size, size, { fit: "fill", kernel: "nearest" })
    .png()
    .toBuffer();
}

/**
 * Build a multi-resolution ICO container embedding PNG frames.
 * (PNG-in-ICO is supported by every browser that matters here.)
 */
function buildIco(frames) {
  const count = frames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + count * 16;
  const blobs = [];
  for (const { size, data } of frames) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    blobs.push(data);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...blobs]);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const svg = buildIconSvg();
  fs.writeFileSync(path.join(OUT_DIR, "favicon.svg"), svg);

  await sharp(Buffer.from(svg), { density: 512 })
    .resize(96, 96, { fit: "fill", kernel: "nearest" })
    .png()
    .toFile(path.join(OUT_DIR, "favicon-96x96.png"));

  await sharp(Buffer.from(svg), { density: 512 })
    .resize(180, 180, { fit: "fill", kernel: "nearest" })
    .png()
    .toFile(path.join(OUT_DIR, "apple-touch-icon.png"));

  await sharp(Buffer.from(svg), { density: 512 })
    .resize(192, 192, { fit: "fill", kernel: "nearest" })
    .png()
    .toFile(path.join(OUT_DIR, "web-app-manifest-192x192.png"));

  await sharp(Buffer.from(svg), { density: 512 })
    .resize(512, 512, { fit: "fill", kernel: "nearest" })
    .png()
    .toFile(path.join(OUT_DIR, "web-app-manifest-512x512.png"));

  const icoFrames = [];
  for (const size of [16, 32, 48]) {
    icoFrames.push({ size, data: await png(size) });
  }
  fs.writeFileSync(path.join(OUT_DIR, "favicon.ico"), buildIco(icoFrames));

  console.log("Peromfu favicon set written to public/favicon/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});