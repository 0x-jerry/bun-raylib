import {
  // Window & drawing
  InitWindow, WindowShouldClose, CloseWindow,
  BeginDrawing, EndDrawing, ClearBackground,
  GetScreenWidth, GetScreenHeight,
  SetTargetFPS, GetFPS, GetTime,

  // Colors & helpers
  RAYWHITE, RED, BLUE, GREEN, YELLOW, BLACK, SKYBLUE, DARKBLUE,
  Color, Fade,

  // Shapes
  DrawRectangle, DrawRectangleLines, DrawRectangleRounded,
  DrawCircle, DrawCircleV, DrawCircleLines,
  DrawLine, DrawLineEx,
  DrawTriangle, DrawPoly,
  DrawRing,

  // Text
  DrawText, DrawFPS, GetFontDefault,
  MeasureText,

  // Input
  IsKeyDown, KeyboardKey,
  GetMousePosition, GetMouseX, GetMouseY,
  IsMouseButtonDown, MouseButton,

  // Enums
  BlendMode, BeginBlendMode, EndBlendMode,
  ConfigFlags, SetConfigFlags,

  // Types
  type Vector2,
} from "../src";

// -----------------------------------------------------------------------
// Basic raylib window with drawing, input, and blending
// -----------------------------------------------------------------------

const SCREEN_W = 800;
const SCREEN_H = 600;

InitWindow(SCREEN_W, SCREEN_H, "raylib + Bun FFI - Example");
SetTargetFPS(60);

// Use the default font
const font = GetFontDefault();
console.log(`Font loaded: ${font.glyphCount} glyphs`);

// Track a simple position
let ballPos: Vector2 = { x: SCREEN_W / 2, y: SCREEN_H / 2 };
let ballRadius = 30;

while (!WindowShouldClose()) {
  // --- Input ---
  const mouse = GetMousePosition();

  // Move ball with arrow keys / WASD
  const speed = 4;
  if (IsKeyDown(KeyboardKey.KEY_RIGHT) || IsKeyDown(KeyboardKey.KEY_D)) ballPos.x += speed;
  if (IsKeyDown(KeyboardKey.KEY_LEFT) || IsKeyDown(KeyboardKey.KEY_A)) ballPos.x -= speed;
  if (IsKeyDown(KeyboardKey.KEY_UP) || IsKeyDown(KeyboardKey.KEY_W)) ballPos.y -= speed;
  if (IsKeyDown(KeyboardKey.KEY_DOWN) || IsKeyDown(KeyboardKey.KEY_S)) ballPos.y += speed;

  // Increase ball size with left click
  if (IsMouseButtonDown(MouseButton.MOUSE_BUTTON_LEFT)) {
    ballRadius = Math.min(ballRadius + 0.5, 100);
  } else {
    ballRadius = Math.max(ballRadius - 0.3, 10);
  }

  // Keep ball on screen
  ballPos.x = Math.max(ballRadius, Math.min(SCREEN_W - ballRadius, ballPos.x));
  ballPos.y = Math.max(ballRadius, Math.min(SCREEN_H - ballRadius, ballPos.y));

  // --- Drawing ---
  BeginDrawing();
  ClearBackground(RAYWHITE);

  // Gradient background rect
  DrawRectangle(0, 0, SCREEN_W, 60, Fade(SKYBLUE, 0.5));
  DrawText("raylib + Bun FFI", 20, 15, 30, DARKBLUE);
  DrawFPS(SCREEN_W - 100, 20);

  // Draw the ball with a ring around it
  DrawCircleV(ballPos, ballRadius, RED);
  DrawCircleLines(ballPos.x, ballPos.y, ballRadius, Fade(BLACK, 0.3));
  DrawRing(ballPos, ballRadius + 5, ballRadius + 10, 0, 360, 32, Fade(BLUE, 0.5));

  // Draw mouse follower
  DrawCircleV(mouse, 6, Fade(GREEN, 0.7));
  DrawLineEx(mouse, ballPos, 1.5, Fade(BLACK, 0.2));

  // Draw a rounded rectangle
  DrawRectangleRounded(
    { x: 10, y: SCREEN_H - 50, width: 100, height: 40 },
    0.3, 8, Fade(YELLOW, 0.3),
  );
  DrawText("Click me!", 20, SCREEN_H - 40, 14, BLACK);

  // Show coordinates
  const coords = `Mouse: ${mouse.x.toFixed(0)}, ${mouse.y.toFixed(0)}`;
  DrawText(coords, 10, 80, 16, BLACK);

  const ballInfo = `Ball: ${ballPos.x.toFixed(0)}, ${ballPos.y.toFixed(0)} r=${ballRadius.toFixed(0)}`;
  DrawText(ballInfo, 10, 100, 16, BLACK);

  // Draw a triangle where the ball is
  const triSize = 15;
  DrawTriangle(
    { x: ballPos.x, y: ballPos.y - triSize },
    { x: ballPos.x - triSize, y: ballPos.y + triSize },
    { x: ballPos.x + triSize, y: ballPos.y + triSize },
    Fade(YELLOW, 0.4),
  );

  // --- Blend mode demo ---
  const blendX = SCREEN_W - 160;
  const blendY = 100;
  DrawText("Blend modes:", blendX, blendY - 20, 14, BLACK);

  BeginBlendMode(BlendMode.BLEND_ALPHA);
  DrawCircle(blendX + 20, blendY + 40, 25, Fade(RED, 0.5));
  DrawCircle(blendX + 50, blendY + 40, 25, Fade(BLUE, 0.5));
  DrawCircle(blendX + 35, blendY + 60, 25, Fade(GREEN, 0.5));
  EndBlendMode();

  // Draw a polygon (hexagon) in the bottom right
  const polyCenter: Vector2 = { x: SCREEN_W - 80, y: SCREEN_H - 80 };
  DrawPoly(polyCenter, 6, 30, 0, Fade(DARKBLUE, 0.6));
  DrawPoly(polyCenter, 6, 30, GetTime() * 20, Fade(SKYBLUE, 0.4));

  EndDrawing();
}

CloseWindow();
console.log("Window closed. Bye!");
