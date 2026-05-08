import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

const WIN_W = 800, WIN_H = 600, BALL_RADIUS = 25;

let win1X = 60, win1Y = 80;
let win2X = 870, win2Y = 80;
let bx = (win1X + win2X + WIN_W) / 2;
let by = win1Y + WIN_H / 2;
let vx = 300, vy = 200;
let lastTime = Date.now();

const BALL_FILE = "/tmp/bounce_ball.json";
const POS1_FILE = "/tmp/bounce_pos_1.json";
const POS2_FILE = "/tmp/bounce_pos_2.json";

let lastWin1Active = Date.now();
let lastWin2Active = Date.now();

const interval = setInterval(() => {
  const now = Date.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  try {
    const p1 = JSON.parse(readFileSync(POS1_FILE, "utf8"));
    win1X = Math.round(p1.x);
    win1Y = Math.round(p1.y);
    lastWin1Active = now;
  } catch {}
  try {
    const p2 = JSON.parse(readFileSync(POS2_FILE, "utf8"));
    win2X = Math.round(p2.x);
    win2Y = Math.round(p2.y);
    lastWin2Active = now;
  } catch {}

  if (now - lastWin1Active > 3000 && now - lastWin2Active > 3000) {
    cleanup();
    return;
  }

  const left = Math.min(win1X, win2X);
  const top = Math.min(win1Y, win2Y);
  const right = Math.max(win1X, win2X) + WIN_W;
  const bottom = Math.max(win1Y, win2Y) + WIN_H;
  const br = BALL_RADIUS;

  bx += vx * dt;
  by += vy * dt;

  if (bx - br < left) { bx = left + br; vx = Math.abs(vx); }
  if (bx + br > right) { bx = right - br; vx = -Math.abs(vx); }
  if (by - br < top) { by = top + br; vy = Math.abs(vy); }
  if (by + br > bottom) { by = bottom - br; vy = -Math.abs(vy); }

  try {
    writeFileSync(BALL_FILE, JSON.stringify({
      bx, by,
      w1x: win1X, w1y: win1Y,
      w2x: win2X, w2y: win2Y,
    }));
  } catch {}
}, 1000 / 60);

function cleanup() {
  clearInterval(interval);
  try { unlinkSync(BALL_FILE); } catch {}
  try { unlinkSync(POS1_FILE); } catch {}
  try { unlinkSync(POS2_FILE); } catch {}
  process.exit(0);
}

Bun.spawn({
  cmd: ["bun", "run", new URL("./window.ts", import.meta.url).pathname],
  env: { ...process.env, WINDOW_ID: "1" },
  stdout: "inherit",
  stderr: "inherit",
});

Bun.spawn({
  cmd: ["bun", "run", new URL("./window.ts", import.meta.url).pathname],
  env: { ...process.env, WINDOW_ID: "2" },
  stdout: "inherit",
  stderr: "inherit",
});

console.log("Two raylib windows launched. Close both to exit.");
