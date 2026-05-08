const WIN_W = 800, WIN_H = 600, BALL_RADIUS = 25;

let win1X = 60, win1Y = 80;
let win2X = 870, win2Y = 80;
let bx = (win1X + win2X + WIN_W) / 2;
let by = win1Y + WIN_H / 2;
let vx = 300, vy = 200;
const MAX_SPEED = 1200;
let lastTime = Date.now();

let prevLeft = 60, prevTop = 80, prevRight = 870 + WIN_W, prevBottom = 80 + WIN_H;

const STATE_FILE = `${import.meta.dirname}/.bounce_state.json`;
const windowPath = new URL("./window.ts", import.meta.url).pathname;

const p1 = Bun.spawn({
  cmd: ["bun", "run", windowPath],
  env: { ...process.env, WINDOW_ID: "1", STATE_FILE },
  ipc: (msg: any) => {
    if (msg.x !== undefined) { win1X = msg.x; win1Y = msg.y; }
  },
  stdout: "inherit",
  stderr: "inherit",
});

const p2 = Bun.spawn({
  cmd: ["bun", "run", windowPath],
  env: { ...process.env, WINDOW_ID: "2", STATE_FILE },
  ipc: (msg: any) => {
    if (msg.x !== undefined) { win2X = msg.x; win2Y = msg.y; }
  },
  stdout: "inherit",
  stderr: "inherit",
});

let exited1 = false, exited2 = false;
p1.exited.then(() => { exited1 = true; });
p2.exited.then(() => { exited2 = true; });

const interval = setInterval(() => {
  if (exited1 && exited2) {
    clearInterval(interval);
    process.exit(0);
  }

  const now = Date.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  const active1 = !exited1, active2 = !exited2;

  const left = active1 && active2 ? Math.min(win1X, win2X) : active1 ? win1X : win2X;
  const top = active1 && active2 ? Math.min(win1Y, win2Y) : active1 ? win1Y : win2Y;
  const right = (active1 && active2 ? Math.max(win1X, win2X) : active1 ? win1X : win2X) + WIN_W;
  const bottom = (active1 && active2 ? Math.max(win1Y, win2Y) : active1 ? win1Y : win2Y) + WIN_H;
  const br = BALL_RADIUS;

  const dLeft = left - prevLeft;
  const dTop = top - prevTop;
  const dRight = right - prevRight;
  const dBottom = bottom - prevBottom;

  if (bx - br < left && left > prevLeft) {
    vx = Math.max(Math.abs(vx), Math.abs(dLeft / dt));
  }
  if (bx + br > right && right < prevRight) {
    vx = -Math.max(Math.abs(vx), Math.abs(dRight / dt));
  }
  if (by - br < top && top > prevTop) {
    vy = Math.max(Math.abs(vy), Math.abs(dTop / dt));
  }
  if (by + br > bottom && bottom < prevBottom) {
    vy = -Math.max(Math.abs(vy), Math.abs(dBottom / dt));
  }

  prevLeft = left;
  prevTop = top;
  prevRight = right;
  prevBottom = bottom;

  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed > MAX_SPEED) {
    const scale = MAX_SPEED / speed;
    vx *= scale;
    vy *= scale;
  }

  bx += vx * dt;
  by += vy * dt;

  if (bx - br < left) { bx = left + br; vx = Math.abs(vx); }
  if (bx + br > right) { bx = right - br; vx = -Math.abs(vx); }
  if (by - br < top) { by = top + br; vy = Math.abs(vy); }
  if (by + br > bottom) { by = bottom - br; vy = -Math.abs(vy); }

  try {
    Bun.write(STATE_FILE, JSON.stringify({
      bx, by,
      w1x: win1X, w1y: win1Y,
      w2x: win2X, w2y: win2Y,
    }));
  } catch {}
}, 1000 / 60);

console.log("Two raylib windows launched. Close both to exit.");
