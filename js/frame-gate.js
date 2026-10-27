/* ============================================
   FRAME GATE — optional 60 fps limit for the animation loops
   requestAnimationFrame fires at the screen's refresh rate (60, 120, 144 Hz…).
   The animations move a fixed step per frame and were tuned for 60 Hz, so with
   the setting on, faster screens only draw ~60 frames per second (same speed,
   same cost as 60 Hz). The gate measures the real refresh interval and never
   skips a frame on a screen that is ~70 Hz or slower, whatever the timing jitter.
   ============================================ */

import { getFpsLimit60 } from './state.js';

const INTERVAL = 1000 / 60;
const SLOW_SCREEN_MS = 1000 / 70;   // average frame gap above this → ≤ ~70 Hz screen → draw every frame
const WARMUP_GAPS = 10;             // measure the screen before limiting anything
const TOLERANCE = 2;                // fast screens: small allowance for timing jitter

// Returns gate(now) → true when this frame should be drawn. Call it on every rAF callback.
export function createFrameGate() {
  let prev = null;        // previous callback time (drawn or not)
  let avgGap = null;      // smoothed refresh interval of this screen
  let samples = 0;
  let next = -Infinity;   // earliest time of the next drawn frame on fast screens
  return (now) => {
    if (prev !== null) {
      const gap = now - prev;
      if (gap > 0 && gap < 50) {   // ignore pauses / tab switches
        samples++;
        // Plain mean while warming up (one noisy first gap can't skew it), then a slow moving average.
        avgGap = samples <= WARMUP_GAPS ? (avgGap === null ? gap : avgGap + (gap - avgGap) / samples) : avgGap * 0.97 + gap * 0.03;
      }
    }
    prev = now;
    if (!getFpsLimit60() || samples < WARMUP_GAPS || avgGap > SLOW_SCREEN_MS) {
      next = now + INTERVAL;
      return true;
    }
    if (now < next - TOLERANCE) return false;
    next = next + INTERVAL > now ? next + INTERVAL : now + INTERVAL;
    return true;
  };
}
