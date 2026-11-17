// gta6-twitch-ccu-forecast-01 autonomous forecaster (Node 22, standard library only)
// Learns hourly ratio curves and dispersion from comparables, anchors on hour-1 print,
// and outputs robust calibrated quantiles for hours 2 to 24.

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const LEVELS = [0.05, 0.25, 0.5, 0.75, 0.95];
const Z = [-1.645, -0.674, 0, 0.674, 1.645];

interface ComparableHourly {
  from: string;
  viewers: number;
  channels?: number;
}

interface Comparable {
  day_start: string;
  hourly: ComparableHourly[];
}

interface Case {
  levels: number[];
  known: Array<{ hour: number; viewers: number }>;
  forecast: Array<{ hour: number }>;
  comparables?: Comparable[];
}

const round2 = (x: number): number => Math.round(x * 100) / 100;

mkdirSync(OUTPUT_DIR, { recursive: true });

const inputs = readdirSync(INPUT_DIR).filter((f) => f.endsWith('.in')).sort();

for (const file of inputs) {
  const id = file.slice(0, -'.in'.length);
  const c = JSON.parse(readFileSync(join(INPUT_DIR, file), 'utf8')) as Case;
  
  if (c.levels.length !== LEVELS.length || c.levels.some((t, j) => t !== LEVELS[j])) {
    throw new Error(`${file} asks for unexpected levels`);
  }

  const first = c.known.find((k) => k.hour === 1);
  if (first === undefined) {
    throw new Error(`${file} has no hour-1 print`);
  }
  const p1 = Math.max(1, first.viewers);

  // Learn hourly log-ratios from comparables
  const logRatiosByHour: Record<number, number[]> = {};
  for (let h = 2; h <= 24; h++) {
    logRatiosByHour[h] = [];
  }

  if (c.comparables && Array.isArray(c.comparables)) {
    for (const comp of c.comparables) {
      if (!comp.day_start || !comp.hourly) continue;
      const hMap = new Map<number, number>();
      for (const item of comp.hourly) {
        if (item && item.from && typeof item.viewers === 'number') {
          const t = Date.parse(item.from);
          if (!isNaN(t)) {
            hMap.set(t, item.viewers);
          }
        }
      }

      const t0 = Date.parse(comp.day_start);
      if (isNaN(t0)) continue;

      // Hour 1 timestamp is day_start
      const v1 = hMap.get(t0);
      if (v1 === undefined || v1 <= 0) continue;

      for (let h = 2; h <= 24; h++) {
        const tH = t0 + (h - 1) * 3600 * 1000;
        const vh = hMap.get(tH);
        if (vh !== undefined && vh > 0) {
          const lr = Math.log(vh / v1);
          if (isFinite(lr)) {
            logRatiosByHour[h].push(lr);
          }
        }
      }
    }
  }

  const hoursResult: Array<{ hour: number; q: number[] }> = [];

  for (let h = 2; h <= 24; h++) {
    const lrs = logRatiosByHour[h];
    let medianLogRatio = 0;
    let spread = 0.15 * Math.sqrt(h - 1);

    if (lrs && lrs.length > 5) {
      lrs.sort((a, b) => a - b);
      const mid = Math.floor(lrs.length / 2);
      const med = lrs.length % 2 === 0 ? (lrs[mid - 1] + lrs[mid]) / 2 : lrs[mid];
      
      // Robust IQR spread
      const q25 = lrs[Math.floor(lrs.length * 0.25)];
      const q75 = lrs[Math.floor(lrs.length * 0.75)];
      const iqrSpread = (q75 - q25) / 1.349;

      // Shrinkage toward persistence with robust empirical learning from comparables
      const weight = Math.min(1.0, lrs.length / 25);
      medianLogRatio = weight * med + (1 - weight) * 0;
      const empiricalSpread = isFinite(iqrSpread) && iqrSpread > 0.05 ? iqrSpread : (0.15 * Math.sqrt(h - 1));
      spread = weight * empiricalSpread + (1 - weight) * (0.15 * Math.sqrt(h - 1));
    }

    const baseVal = p1 * Math.exp(medianLogRatio);
    const qs = Z.map((z) => {
      const val = baseVal * Math.exp(z * spread);
      return Math.max(1, Math.min(1e9, val));
    });

    // Ensure non-decreasing order
    qs.sort((a, b) => a - b);
    for (let i = 1; i < qs.length; i++) {
      if (qs[i] <= qs[i - 1]) {
        qs[i] = qs[i - 1] + 0.01;
      }
    }

    hoursResult.push({
      hour: h,
      q: qs.map(round2),
    });
  }

  writeFileSync(join(OUTPUT_DIR, `${id}.out`), `${JSON.stringify({ hours: hoursResult })}\n`);
}
