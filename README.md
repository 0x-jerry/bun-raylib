# raylib Bun FFI Bindings

Call [raylib](https://www.raylib.com/) directly from TypeScript using Bun's FFI.

No native addons, no N-API — just `dlopen` + a thin C bridge for struct marshaling.

## Quick start

```bash
bun install
bun run scripts/prepare.ts
bun run scripts/build-bridge.ts
bun run examples/basic.ts
```

## Build

```bash
# Download latest raylib release for your platform
bun run scripts/prepare.ts

# Compile the bridge shared library
bun run scripts/build-bridge.ts
```

## Architecture

```
┌─────────────────────────────────────┐
│  raylib.ts         (user API)       │
├─────────────────────────────────────┤
│  ffi.ts            (Bun dlopen)     │
│    ├── lib        → libraylib       │  ← functions with only primitive args
│    └── bridge     → bridge          │  ← functions that take/return structs
├─────────────────────────────────────┤
│  bridge.c → bridge (cc)             │  ← C wrappers that pack/unpack structs
├─────────────────────────────────────┤
│  types.ts          (TS interfaces)  │
└─────────────────────────────────────┘
```

**Why two libraries?** Bun's FFI `dlopen` only handles primitive types (`i32`, `f32`, `cstring`, `ptr`, etc.). Raylib functions like `DrawCircle(Vector2, float, Color)` pass structs **by value**, but the ARM64 C ABI packs small structs into single registers — decomposing them into individual scalar args in the FFI declaration produces the wrong calling convention.

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

## Project structure

```
src/
├── index.ts      ← re-exports everything
├── types.ts      ← TypeScript types, enums, and color constants
├── bridge.c      ← C wrappers for struct pass/return (compile → bridge)
├── ffi.ts        ← Bun dlopen bindings + struct read helpers
└── raylib.ts     ← high-level TypeScript API
scripts/
├── prepare.ts    ← download latest raylib release for current platform
└── build-bridge.ts ← compile bridge.c against raylib
examples/
├── basic.ts       ← single-window demo (shapes, text, input, blending)
└── bounce/        ← multi-window ball bounce demo
    ├── main.ts    ← physics server + process orchestration
    └── window.ts  ← raylib window child process
raylib/           ← downloaded raylib release (headers + libraries)
```

## Requirements

- [Bun](https://bun.sh/) >= 1.1
- A C compiler (`cc`, `clang`, or `gcc`)
- raylib (auto-downloaded by `scripts/prepare.ts`)
