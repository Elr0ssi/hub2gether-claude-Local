/* Génère les images de relief du globe d'Explorer (public/explorer/relief-4k|8k|16k.jpg).

   Source : les « Terrain Tiles » d'Amazon (SRTM, GMTED…), format Terrarium, niveau 6 (64 x 64 tuiles).
     1. télécharger les tuiles :
        for y in $(seq 0 63); do for x in $(seq 0 63); do echo "$x $y"; done; done | \
          xargs -P 40 -n 2 sh -c 'curl -s -o tiles/$0_$1.png https://s3.amazonaws.com/elevation-tiles-prod/terrarium/6/$0/$1.png'
     2. npm i sharp, puis : node --max-old-space-size=8000 relief.js   (dossier courant : tiles/ et out/)
   Chaque pixel est ombré à partir de l'altitude (lumière nord-ouest) : terre blanche en relief, eau bleutée plus profonde au large. */
const sharp = require('sharp');
const fs = require('fs');
const Z = 6, N = 64, T = 256, SIZE = N * T; // 16384
const W = SIZE, H = SIZE / 2;
(async () => {
  console.time('decode');
  const hm = new Int16Array(SIZE * SIZE);
  for (let ty = 0; ty < N; ty++) {
    await Promise.all(Array.from({ length: N }, async (_, tx) => {
      const { data } = await sharp(`tiles/${tx}_${ty}.png`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        const o = (y * T + x) * 3;
        const h = data[o] * 256 + data[o + 1] + data[o + 2] / 256 - 32768;
        hm[(ty * T + y) * SIZE + tx * T + x] = Math.max(-32000, Math.min(32000, Math.round(h)));
      }
    }));
  }
  console.timeEnd('decode');
  const DEG = Math.PI / 180;
  const rowH = (j, out) => {
    const lat = 90 - ((j + 0.5) / H) * 180;
    if (lat > 85.0511 || lat < -85.0511) { out.fill(lat > 0 ? -1000 : 500); return; }
    const my = ((1 - Math.asinh(Math.tan(lat * DEG)) / Math.PI) / 2) * SIZE - 0.5;
    const y0 = Math.max(0, Math.min(SIZE - 2, Math.floor(my)));
    const f = Math.max(0, Math.min(1, my - y0));
    const a = y0 * SIZE, b = a + SIZE;
    for (let i = 0; i < W; i++) out[i] = hm[a + i] * (1 - f) + hm[b + i] * f;
  };
  const out = Buffer.alloc(W * H * 3);
  const rows = [new Float32Array(W), new Float32Array(W), new Float32Array(W)];
  rowH(0, rows[1]); rowH(0, rows[0]); rowH(1, rows[2]);
  const mPy = (180 / H) * 110540;
  const az = 315 * DEG, al = 40 * DEG, exag = 5.0;
  const terre = [252, 251, 255], merA = [234, 241, 252], merB = [220, 230, 247], merC = [205, 217, 240];
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  console.time('shade');
  for (let j = 0; j < H; j++) {
    if (j > 0) { const t = rows[0]; rows[0] = rows[1]; rows[1] = rows[2]; rows[2] = t; rowH(Math.min(H - 1, j + 1), rows[2]); }
    const lat = 90 - ((j + 0.5) / H) * 180;
    const dx = (360 / W) * 111320 * Math.max(0.12, Math.cos(lat * DEG));
    const r0 = rows[0], r1 = rows[1], r2 = rows[2];
    for (let i = 0; i < W; i++) {
      const h = r1[i];
      const o = (j * W + i) * 3;
      let R, G, B;
      if (h <= 0) {
        const t = sm(0, 300, -h), u = sm(300, 4500, -h);
        R = merA[0] + (merB[0] - merA[0]) * t + (merC[0] - merB[0]) * u * t;
        G = merA[1] + (merB[1] - merA[1]) * t + (merC[1] - merB[1]) * u * t;
        B = merA[2] + (merB[2] - merA[2]) * t + (merC[2] - merB[2]) * u * t;
      } else {
        const ip = i === W - 1 ? 0 : i + 1, im = i === 0 ? W - 1 : i - 1;
        const dzdx = ((r1[ip] - r1[im]) / (2 * dx)) * exag;
        const dzdy = ((r2[i] - r0[i]) / (2 * mPy)) * exag;
        const pente = Math.atan(Math.hypot(dzdx, dzdy));
        const expo = Math.atan2(dzdy, -dzdx);
        const ombre = Math.sin(al) * Math.cos(pente) + Math.cos(al) * Math.sin(pente) * Math.cos(az - expo);
        const c = Math.max(0.42, Math.min(1, 0.93 + (ombre - 0.64) * 1.05));
        const e = Math.min(1, h / 4500) * 0.1;
        const k = c * (1 - e);
        R = terre[0] * k; G = terre[1] * k; B = terre[2] * Math.min(1, k * 1.02);
      }
      out[o] = R; out[o + 1] = G; out[o + 2] = B;
    }
    if (j % 1024 === 0) console.log('row', j);
  }
  console.timeEnd('shade');
  fs.mkdirSync('out', { recursive: true });
  const base = sharp(out, { raw: { width: W, height: H, channels: 3 }, limitInputPixels: false });
  await base.clone().jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile('out/relief-16k.jpg');
  await base.clone().resize(8192, 4096, { kernel: 'lanczos3' }).jpeg({ quality: 84, progressive: true, mozjpeg: true }).toFile('out/relief-8k.jpg');
  await base.clone().resize(4096, 2048, { kernel: 'lanczos3' }).jpeg({ quality: 88, progressive: true, mozjpeg: true }).toFile('out/relief-4k.jpg');
  for (const f of fs.readdirSync('out')) console.log(f, (fs.statSync('out/' + f).size / 1e6).toFixed(1), 'Mo');
})();
