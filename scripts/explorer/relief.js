/* Génère les images de relief du globe d'Explorer (public/explorer/relief-4k|8k|16k.jpg et relief-h.jpg, la carte de hauteurs).

   Source : les « Terrain Tiles » d'Amazon (SRTM, GMTED…), format Terrarium, niveau 6 (64 x 64 tuiles).
     1. télécharger les tuiles :
        for y in $(seq 0 63); do for x in $(seq 0 63); do echo "$x $y"; done; done | \
          xargs -P 40 -n 2 sh -c 'curl -s -o tiles/$0_$1.png https://s3.amazonaws.com/elevation-tiles-prod/terrarium/6/$0/$1.png'
     2. npm i sharp, puis : node --max-old-space-size=10000 relief.js   (dossier courant : tiles/ et out/)
   Ombrage multi-directionnel (lumières du nord-ouest), courbure (vallées sombres, crêtes claires), fonds marins à peine ombrés,
   netteté accrue. La terre est blanche en relief, l'eau bleutée plus profonde au large. */
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
  /* Ombrage multi-directionnel : plusieurs lumières venues du nord-ouest, pour que toutes les arêtes se lisent. */
  const lumieres = [[225, 0.12], [270, 0.3], [315, 0.38], [360, 0.2]].map(([a, w]) => [a * DEG, w]);
  const al = 38 * DEG, exag = 6.5;
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
      const ip = i === W - 1 ? 0 : i + 1, im = i === 0 ? W - 1 : i - 1;
      const ex = h > 0 ? exag : 0.35;
      const dzdx = ((r1[ip] - r1[im]) / (2 * dx)) * ex;
      const dzdy = ((r2[i] - r0[i]) / (2 * mPy)) * ex;
      const pente = Math.atan(Math.hypot(dzdx, dzdy));
      const expo = Math.atan2(dzdy, -dzdx);
      let ombre = 0;
      for (const [az, w] of lumieres) ombre += w * (Math.sin(al) * Math.cos(pente) + Math.cos(al) * Math.sin(pente) * Math.cos(az - expo));
      let R, G, B;
      if (h <= 0) {
        const t = sm(0, 300, -h), u = sm(300, 4500, -h);
        R = merA[0] + (merB[0] - merA[0]) * t + (merC[0] - merB[0]) * u * t;
        G = merA[1] + (merB[1] - merA[1]) * t + (merC[1] - merB[1]) * u * t;
        B = merA[2] + (merB[2] - merA[2]) * t + (merC[2] - merB[2]) * u * t;
        /* Les fonds marins, à peine ombrés : dorsales et fosses se devinent. */
        const k = 1 + (ombre - 0.62) * 0.35;
        R *= k; G *= k; B *= Math.min(1.02, k);
      } else {
        /* Courbure : un fond de vallée s'assombrit, une crête s'éclaircit. */
        const lap = (r1[ip] + r1[im] + r0[i] + r2[i] - 4 * h) / 1000;
        const courbe = Math.max(-0.07, Math.min(0.07, lap * 0.022));
        const c = Math.max(0.36, Math.min(1, 0.93 + (ombre - 0.62) * 1.22 + courbe));
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
  /* La carte de hauteurs (4096 x 2048, niveaux de gris, racine carrée de l'altitude) pour le vrai relief en volume. */
  {
    const HW = 4096, HH = 2048, f = 4;
    const hb = Buffer.alloc(HW * HH);
    const tmp = new Float32Array(W);
    const acc = new Float32Array(HW);
    for (let oj = 0; oj < HH; oj++) {
      acc.fill(0);
      for (let k = 0; k < f; k++) {
        rowH(oj * f + k, tmp);
        for (let oi = 0; oi < HW; oi++) { let sct = 0; for (let m = 0; m < f; m++) sct += tmp[oi * f + m]; acc[oi] += sct / f; }
      }
      for (let oi = 0; oi < HW; oi++) { const h = acc[oi] / f; hb[oj * HW + oi] = h > 0 ? Math.min(255, Math.round(Math.sqrt(h / 8848) * 255)) : 0; }
    }
    await sharp(hb, { raw: { width: HW, height: HH, channels: 1 } }).jpeg({ quality: 92, mozjpeg: true }).toFile('out/relief-h.jpg');
  }
  const net = (img) => img.sharpen({ sigma: 1.1, m1: 0.9, m2: 2.2 });
  const base = sharp(out, { raw: { width: W, height: H, channels: 3 }, limitInputPixels: false });
  await net(base.clone()).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile('out/relief-16k.jpg');
  await net(base.clone().resize(8192, 4096, { kernel: 'lanczos3' })).jpeg({ quality: 86, progressive: true, mozjpeg: true }).toFile('out/relief-8k.jpg');
  await base.clone().resize(4096, 2048, { kernel: 'lanczos3' }).jpeg({ quality: 88, progressive: true, mozjpeg: true }).toFile('out/relief-4k.jpg');
  for (const f of fs.readdirSync('out')) console.log(f, (fs.statSync('out/' + f).size / 1e6).toFixed(1), 'Mo');
})();
