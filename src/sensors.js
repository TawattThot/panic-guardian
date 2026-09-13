/** Fall / hard-impact heuristics from DeviceMotion. Not threat-type detection. */

const IMPACT_G = 3.5; // hard shock
const FREEFALL_G = 0.35; // near weightlessness
const STILL_G = 1.35;
const STILL_MS = 1200;
const WINDOW_MS = 2500;

export function createFallDetector({ onFall }) {
  let armed = false;
  let freefallAt = 0;
  let impactAt = 0;
  let stillSince = 0;
  let lastMag = 1;

  function magnitude(a) {
    if (!a) return null;
    const x = a.x ?? 0;
    const y = a.y ?? 0;
    const z = a.z ?? 0;
    return Math.sqrt(x * x + y * y + z * z) / 9.80665; // g
  }

  function onMotion(ev) {
    if (!armed) return;
    const raw = ev.accelerationIncludingGravity || ev.acceleration;
    const g = magnitude(raw);
    if (g == null) return;
    const now = performance.now();
    lastMag = g;

    if (g < FREEFALL_G) freefallAt = now;
    if (g > IMPACT_G) impactAt = now;

    const recentFreefall = freefallAt && now - freefallAt < WINDOW_MS;
    const recentImpact = impactAt && now - impactAt < WINDOW_MS;

    if (recentImpact || (recentFreefall && g > IMPACT_G * 0.7)) {
      if (g < STILL_G) {
        if (!stillSince) stillSince = now;
        if (now - stillSince >= STILL_MS) {
          stillSince = 0;
          freefallAt = 0;
          impactAt = 0;
          onFall({ g, at: Date.now(), kind: recentFreefall ? 'fall' : 'impact' });
        }
      } else {
        stillSince = 0;
      }
    }
  }

  return {
    get lastG() {
      return lastMag;
    },
    arm() {
      armed = true;
    },
    disarm() {
      armed = false;
    },
    start(win = window) {
      win.addEventListener('devicemotion', onMotion);
    },
    stop(win = window) {
      win.removeEventListener('devicemotion', onMotion);
    },
  };
}

export async function requestMotionPermission() {
  const DM = window.DeviceMotionEvent;
  if (DM && typeof DM.requestPermission === 'function') {
    const res = await DM.requestPermission();
    return res === 'granted';
  }
  return true;
}
