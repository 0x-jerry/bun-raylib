import {
  InitWindow, SetTargetFPS, WindowShouldClose, CloseWindow,
  BeginDrawing, EndDrawing, ClearBackground,
  GetWindowPosition, SetWindowPosition,
  DrawCircle, DrawText, DrawFPS,
  IsKeyDown, KeyboardKey,
  RAYWHITE, RED, BLUE, DARKBLUE, GREEN, BLACK, DARKGRAY,
} from "../../src";

const WIN_W = 800;
const WIN_H = 600;
const BALL_RADIUS = 25;

const WINDOW_ID = parseInt(process.env.WINDOW_ID || "1");
const STATE_FILE = process.env.STATE_FILE!;

const startX = WINDOW_ID === 1 ? 60 : 870;
const startY = 80;

InitWindow(WIN_W, WIN_H, `Window ${WINDOW_ID}`);
SetTargetFPS(60);
SetWindowPosition(startX, startY);

async function main() {
  while (!WindowShouldClose()) {
    const pos = GetWindowPosition();

    process.send!({ x: pos.x, y: pos.y });

    let state: any = null;
    try {
      state = await Bun.file(STATE_FILE).json();
    } catch {}

    BeginDrawing();
    ClearBackground(RAYWHITE);

    if (state) {
      const bx = state.bx as number, by = state.by as number;
      const otherWinX = (WINDOW_ID === 1 ? state.w2x : state.w1x) as number;
      const otherWinY = (WINDOW_ID === 1 ? state.w2y : state.w1y) as number;

      const lx = bx - pos.x;
      const ly = by - pos.y;

      if (lx + BALL_RADIUS >= 0 && lx - BALL_RADIUS <= WIN_W &&
          ly + BALL_RADIUS >= 0 && ly - BALL_RADIUS <= WIN_H) {
        DrawCircle(Math.round(lx), Math.round(ly), BALL_RADIUS, RED);
        DrawCircle(Math.round(lx), Math.round(ly), BALL_RADIUS - 2, DARKGRAY);
        const hl = { r: 255, g: 255, b: 255, a: 100 };
        DrawCircle(
          Math.round(lx - BALL_RADIUS * 0.3),
          Math.round(ly - BALL_RADIUS * 0.3),
          BALL_RADIUS * 0.3,
          hl,
        );
      }

      const inWindow = lx >= 0 && lx <= WIN_W && ly >= 0 && ly <= WIN_H;
      DrawText(`Window ${WINDOW_ID}`, 10, 10, 20, DARKBLUE);
      DrawText(`Ball: (${bx.toFixed(0)}, ${by.toFixed(0)})`, 10, 35, 16, BLACK);
      DrawText(
        inWindow ? "IN WINDOW" : "OUTSIDE (other window)",
        10, 60, 16,
        inWindow ? GREEN : BLUE,
      );

      const dx = otherWinX - pos.x;
      const dy = otherWinY - pos.y;
      if (Math.abs(dx) + Math.abs(dy) > 10) {
        const dir = Math.abs(dx) > Math.abs(dy)
          ? dx > 0 ? ">>>" : "<<<"
          : dy > 0 ? "vvv" : "^^^";
        DrawText(`Gateway ${dir}`, 10, WIN_H - 30, 16, DARKGRAY);
      }
    } else {
      DrawText(`Window ${WINDOW_ID} - Waiting...`, 10, 10, 20, DARKBLUE);
    }

    DrawFPS(WIN_W - 90, 10);

    EndDrawing();

    if (IsKeyDown(KeyboardKey.KEY_ESCAPE)) break;
  }

  CloseWindow();
}

main();
