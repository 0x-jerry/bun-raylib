# raylib Bun FFI Bindings

Call [raylib](https://www.raylib.com/) (v6.0) directly from TypeScript using Bun's FFI.

No native addons, no N-API — just `dlopen` + a thin C bridge for struct marshaling.

## Quick start

```bash
bun install
bun run examples/basic.ts
```

## Build

Raylib v6.0 for macOS is bundled under `raylib-6.0_macos/`. The bridge C library must be compiled once:

```bash
# Build the bridge shared library
clang -shared -o src/bridge.dylib src/bridge.c \
  -I./raylib-6.0_macos/include \
  -L./raylib-6.0_macos/lib -lraylib \
  -arch arm64 -O2

# Ad-hoc sign for macOS (required to dlopen)
codesign --force --sign - src/bridge.dylib
codesign --force --sign - raylib-6.0_macos/lib/libraylib.6.0.0.dylib
```

## Architecture

```
┌─────────────────────────────────────┐
│  raylib.ts         (user API)       │
├─────────────────────────────────────┤
│  ffi.ts            (Bun dlopen)     │
│    ├── lib        → libraylib.dylib │  ← functions with only primitive args
│    └── bridge     → bridge.dylib    │  ← functions that take/return structs
├─────────────────────────────────────┤
│  bridge.c → bridge.dylib (clang)    │  ← C wrappers that pack/unpack structs
├─────────────────────────────────────┤
│  types.ts          (TS interfaces)  │
└─────────────────────────────────────┘
```

**Why two .dylib files?** Bun's FFI `dlopen` only handles primitive types (`i32`, `f32`, `cstring`, `ptr`, etc.). Raylib functions like `DrawCircle(Vector2, float, Color)` pass structs **by value**, but the ARM64 C ABI packs small structs into single registers — decomposing them into individual scalar args in the FFI declaration produces the wrong calling convention.

The `bridge.c` file provides C wrapper functions that accept individual primitives, pack them into structs, then call the real raylib functions. It also returns structs via static buffer pointers for functions like `GetMousePosition() → Vector2`.

## Examples

### Bounce (multi-window)

Two raylib windows side by side with a ball that bounces between them — the ball passes through the shared edge and bounces off the outer edges. Window positions are tracked dynamically, so you can move the windows and the pass-through boundary adjusts in real time.

```bash
bun run examples/bounce/main.ts
```

Uses file-based IPC (`/tmp/bounce_*.json`) to synchronize ball state between two separate Bun processes (each running its own raylib window).

## Usage

```ts
import {
  InitWindow, WindowShouldClose, CloseWindow,
  BeginDrawing, EndDrawing, ClearBackground,
  SetTargetFPS,
  RAYWHITE, RED, BLUE,
  DrawText, DrawCircle, DrawRectangle,
  IsKeyDown, KeyboardKey,
  GetMousePosition,
} from "./src";

InitWindow(800, 600, "My Game");
SetTargetFPS(60);

while (!WindowShouldClose()) {
  const mouse = GetMousePosition();

  BeginDrawing();
  ClearBackground(RAYWHITE);

  DrawText("Hello, raylib!", 10, 10, 20, RED);
  DrawRectangle(10, 40, 100, 60, BLUE);
  DrawCircle(mouse.x, mouse.y, 20, RED);

  EndDrawing();
}

CloseWindow();
```

## API

### Window

`InitWindow(w, h, title)` `CloseWindow()` `WindowShouldClose()` `IsWindowReady()` `SetTargetFPS(fps)` `GetFPS()` `GetFrameTime()` `GetTime()` `GetScreenWidth()` `GetScreenHeight()` `SetConfigFlags(flags)` `SetWindowTitle(title)` `SetWindowSize(w, h)` `SetWindowPosition(x, y)` `ToggleFullscreen()` ...

### Drawing

`BeginDrawing()` `EndDrawing()` `ClearBackground(color)` `BeginMode2D(camera)` `EndMode2D()` `BeginMode3D(camera)` `EndMode3D()` `BeginBlendMode(mode)` `EndBlendMode()` `BeginScissorMode(x, y, w, h)` `EndScissorMode()`

### Shapes

`DrawPixel(x, y, color)` `DrawLine(x1, y1, x2, y2, color)` `DrawCircle(cx, cy, r, color)` `DrawRectangle(x, y, w, h, color)` `DrawTriangle(v1, v2, v3, color)` `DrawPoly(center, sides, radius, rotation, color)` `DrawRing(center, innerR, outerR, startAngle, endAngle, segments, color)` — and their `V`/`Ex`/`Lines`/`Rounded` variants.

### Text

`DrawText(text, x, y, size, color)` `DrawFPS(x, y)` `MeasureText(text, size)` `GetFontDefault()` `LoadFont(path)` `UnloadFont(font)` `DrawTextEx(font, text, pos, size, spacing, tint)` `DrawTextPro(...)`

### Input

`IsKeyDown(key)` `IsKeyPressed(key)` `GetKeyPressed()` `GetMousePosition()` `GetMouseX()` `GetMouseY()` `IsMouseButtonDown(btn)` `GetMouseWheelMove()` `IsGamepadAvailable(n)` `GetGamepadAxisMovement(gp, axis)`

### Textures & Images

`LoadTexture(path)` `LoadImage(path)` `LoadRenderTexture(w, h)` `UnloadTexture(tex)` `DrawTexture(tex, x, y, tint)` `DrawTextureEx(tex, pos, rot, scale, tint)` `GenImageColor(w, h, color)` `ExportImage(img, path)`

### Colors

`RED`, `BLUE`, `GREEN`, `BLACK`, `WHITE`, `RAYWHITE`, `SKYBLUE`, `DARKBLUE`, `YELLOW`, `ORANGE`, `PURPLE`, `MAGENTA`, etc.

`Fade(color, alpha)` `ColorTint(color, tint)` `ColorAlpha(color, alpha)` `ColorLerp(c1, c2, factor)` `ColorFromHSV(h, s, v)` `ColorToInt(color)`

### Collision

`CheckCollisionRecs(r1, r2)` `CheckCollisionCircles(c1, r1, c2, r2)` `CheckCollisionPointRec(point, rec)` `CheckCollisionPointCircle(point, center, r)` `GetCollisionRec(r1, r2)`

### 3D Shapes

`DrawCube(pos, w, h, l, color)` `DrawSphere(pos, r, color)` `DrawCylinder(pos, topR, botR, h, slices, color)` `DrawPlane(pos, size, color)` `DrawGrid(slices, spacing)`

### Camera

`BeginMode3D(camera)` `GetCameraMatrix(camera)` `GetScreenToWorldRay(pos, camera)` `GetWorldToScreen(pos3d, camera)` `UpdateCamera(cameraRef, mode)`

### Audio

`InitAudioDevice()` `CloseAudioDevice()` `LoadSound(path)` `LoadMusicStream(path)` `PlaySound(sound)` `SetMasterVolume(vol)`

### Enums

`ConfigFlags` `KeyboardKey` `MouseButton` `MouseCursor` `BlendMode` `CameraMode` `CameraProjection` `TextureFilter` `TextureWrap` `PixelFormat` `GamepadButton` `GamepadAxis` `TraceLogLevel`

### Types

```ts
interface Vector2 { x: number; y: number }
interface Vector3 { x: number; y: number; z: number }
interface Color { r: number; g: number; b: number; a: number }
interface Rectangle { x: number; y: number; width: number; height: number }
// ... and more (see src/types.ts)
```

## Project structure

```
src/
├── index.ts      ← re-exports everything
├── types.ts      ← TypeScript types, enums, and color constants
├── bridge.c      ← C wrappers for struct pass/return (compile → bridge.dylib)
├── bridge.dylib  ← pre-compiled shared library
├── ffi.ts        ← Bun dlopen bindings + struct read helpers
└── raylib.ts     ← high-level TypeScript API
examples/
├── basic.ts       ← single-window demo (shapes, text, input, blending)
└── bounce/        ← multi-window ball bounce demo
    ├── main.ts    ← physics server + process orchestration
    └── window.ts  ← raylib window child process
raylib-6.0_macos/ ← raylib 6.0 headers and libraries for macOS
```

## Requirements

- [Bun](https://bun.sh/) >= 1.1
- macOS (ARM64) — for other platforms, adjust the library path and recompile `bridge.c`
- raylib 6.0 (bundled)
