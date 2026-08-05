# raylib Bun FFI Bindings

Call [raylib](https://www.raylib.com/) directly from TypeScript using Bun's FFI.

No native addons, no N-API — just `dlopen` + a generated C bridge for struct marshaling.

## Quick start

```bash
bun install
bun run scripts/prepare.ts   # download raylib for your platform (once)
bun run scripts/gen.ts       # generate bindings from raylib.h
bun run scripts/build-bridge.ts
bun run examples/basic.ts
```

`bun run scripts/gen.ts` regenerates **and** rebuilds the bridge, so normally:

```bash
bun run scripts/gen
```

## How it works

```
raylib.h  (raylib/include)
    │  parsed by scripts/gen.ts (no rlparser dependency)
    ▼
src/types.ts      ─ struct interfaces, enums, color constants
src/layouts.ts    ─ struct/args layout tables (offsets, sizes)
src/ffi.ts        ─ dlopen declarations (libraylib + bridge)
src/raylib.ts     ─ high-level API wrappers
src/bridge.c      ─ C wrappers + static layout asserts
    │  compiled by scripts/build-bridge.ts
    ▼
raylib/lib/bridge.dylib
```

**Everything under `src/` except `pack.ts` and `index.ts` is generated.** Upgrading raylib = re-run `bun run scripts/gen` against the new header.

### Why a bridge at all?

Bun's FFI `dlopen` only handles primitive types. Raylib passes structs (Color, Vector2, Camera3D…) **by value**, which the C ABI packs into registers/stack in ways decomposed scalar args can't reproduce (verified: it segfaults). So `bridge.c` provides one C wrapper per struct-taking function.

### The packing convention (why it's robust)

- Every struct travels as **raw memory** through a single pointer arg — never decomposed into scalar FFI args.
- TS packs args into a buffer using `layouts.ts` (generated from the same header parse that produces `bridge.c`), so the two sides **cannot drift**.
- Struct returns come back through caller-provided out-buffers — no static globals, thread-safe.
- Pointers inside structs (`Font.recs`, `Image.data`, `Wave.data`) are written as full 8-byte values — no truncation possible.
- `bridge.c` ends with `_Static_assert(sizeof/offsetof, ...)` for every raylib struct and every args struct. If the layout engine disagrees with the C compiler, **the build fails** — this is how the binding verifies itself against the real ABI.

### Direct vs bridge functions

- **Direct** (`lib`): primitive params/returns only — `InitWindow`, `IsKeyDown`, `GetTime`, `DrawGrid`, `UpdateCamera(Camera*)` (pointer → packed in the wrapper), …
- **Bridge** (`bridge`): any struct by value — drawing, fonts, images, textures, audio, collisions, …
- **Skipped** (can't bind via FFI): varargs (`TraceLog`, `TextFormat`) and callback params (`SetTraceLogCallback`, audio stream callbacks…).

## Examples

### Basic (single window)

```bash
bun run examples/basic.ts
```

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

### Pointer params

Functions with raw pointer params (`LoadFileData(fileName, dataSize)` where `dataSize` is `int *`) take a raw pointer number. Allocate a buffer and pass `ptr(...)` from `bun:ffi` (or use the buffer-convenience overloads: any `const T*` input accepts `Uint8Array`/`Float32Array`/`number[]`; any `const Struct*` input accepts `Struct[]`).

## Project structure

```
src/
├── index.ts      ← re-exports (hand-written)
├── pack.ts       ← pack/unpack runtime (hand-written)
├── types.ts      ← GENERATED: interfaces, enums, colors
├── layouts.ts    ← GENERATED: layout tables
├── ffi.ts        ← GENERATED: dlopen declarations
├── raylib.ts     ← GENERATED: API wrappers
└── bridge.c      ← GENERATED: C bridge + static asserts
scripts/
├── prepare.ts    ← download raylib release for current platform
├── gen.ts        ← parse raylib.h → generate src/*
└── build-bridge.ts ← compile bridge.c (also validates layouts)
test/
└── smoke.ts      ← exercises font/texture/audio/camera paths
examples/
├── basic.ts       ← single-window demo
└── bounce/        ← multi-window ball bounce demo
raylib/           ← downloaded raylib release (headers + libraries)
```

## Requirements

- [Bun](https://bun.sh/) >= 1.1
- A C compiler (`cc`, `clang`, or `gcc`)
- raylib (auto-downloaded by `scripts/prepare.ts`)
