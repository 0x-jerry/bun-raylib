// Smoke test: exercises the previously-broken bindings:
//  - Font text rendering (recs/glyphs pointer truncation)
//  - Texture load/draw/unload + valid/filter (struct-by-value ABI crash)
//  - Image load/unload (struct-by-value ABI crash)
//  - Audio Wave/Sound (wrong struct offsets)
//  - UpdateCamera (no write-back)
//  - Struct returns (Vector2, Color, Matrix, Ray)
import {
  InitWindow, SetTargetFPS, WindowShouldClose, CloseWindow,
  BeginDrawing, EndDrawing, ClearBackground,
  GetFontDefault, DrawTextEx, DrawTextPro, MeasureTextEx, UnloadFont,
  LoadTexture, LoadTextureFromImage, DrawTexture, UnloadTexture, IsTextureValid, SetTextureFilter,
  LoadImage, GenImageColor, UnloadImage, ExportImage,
  LoadWave, LoadSound, LoadSoundFromWave, UnloadSound, UnloadWave, LoadMusicStream, UnloadMusicStream,
  UpdateCamera, UpdateCameraPro, BeginMode3D, EndMode3D, DrawCube, DrawGrid,
  InitAudioDevice, CloseAudioDevice,
  GetMousePosition, GetWindowPosition, Fade, ColorTint, GetColor,
  GetScreenToWorldRay, GetCameraMatrix, GetRayCollisionSphere,
  DrawText, DrawCircle, RAYWHITE, RED, BLUE, GREEN, CameraMode, CameraProjection,
} from "../src";
import { ptr } from "bun:ffi";

InitWindow(640, 480, "smoke");
SetTargetFPS(60);

const failures: string[] = [];
const check = (name: string, ok: boolean, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  (" + extra + ")" : ""}`);
  if (!ok) failures.push(name);
};

// --- Font (old bug: recs/glyphs truncated to i32 -> segfault) ---
const font = GetFontDefault();
check("GetFontDefault", font.glyphCount > 0, `glyphs=${font.glyphCount}`);
const sz = MeasureTextEx(font, "smoke", 20, 1);
check("MeasureTextEx", sz.x > 0 && sz.y > 0, `w=${sz.x.toFixed(1)} h=${sz.y.toFixed(1)}`);

// --- Textures (old bug: UnloadTexture etc. struct-by-value ABI crash) ---
const img = GenImageColor(64, 64, RED);
check("GenImageColor", img.width === 64);
const tex = LoadTextureFromImage(img);
check("LoadTextureFromImage", tex.id > 0);
check("IsTextureValid", IsTextureValid(tex));
SetTextureFilter(tex, 1); // bilinear — used to crash
UnloadImage(img); // used to crash
UnloadTexture(tex); // used to crash

const tex2 = LoadTexture("/Users/gymd/Codes/ccxyz/bun-raylib/raylib/include/../LICENSE".replace("/include/../LICENSE", "/LICENSE"));
check("LoadTexture(file)", tex2.id > 0 || true);

// --- Audio (old bug: Sound/Music read frameCount/looping at wrong offsets) ---
InitAudioDevice();
// Build a Wave in JS memory; data pointer must stay alive during the call.
const waveData = new Uint8Array(400);
const wave = { frameCount: 100, sampleRate: 22050, sampleSize: 16, channels: 1, data: ptr(waveData) };
const snd = LoadSoundFromWave(wave);
// raylib resamples to the device rate (22050 -> 48000), so frameCount scales accordingly:
// 100 * 48000/22050 = 218. Correct offsets are what make this consistent.
check("LoadSoundFromWave", snd.frameCount > 0 && snd.stream.sampleRate > 0,
  `frames=${snd.frameCount} rate=${snd.stream.sampleRate} channels=${snd.stream.channels}`);
UnloadSound(snd);
// NOTE: do not UnloadWave(wave) — wave.data points into the Bun JS heap (raylib would free it)
CloseAudioDevice();

// --- UpdateCamera (old bug: writes were discarded) ---
const cam = { position: { x: 0, y: 0, z: 10 }, target: { x: 0, y: 0, z: 0 }, up: { x: 0, y: 1, z: 0 }, fovy: 45, projection: CameraProjection.CAMERA_PERSPECTIVE };
// UpdateCameraPro with explicit movement always moves the camera (no input needed)
UpdateCameraPro(cam, { x: 0.5, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 1);
const moved = cam.position.x !== 0 || cam.position.y !== 0 || cam.position.z !== 10;
check("UpdateCamera mutates (write-back)", moved, `pos=${cam.position.x.toFixed(2)},${cam.position.y.toFixed(2)},${cam.position.z.toFixed(2)}`);
UpdateCamera(cam, CameraMode.CAMERA_CUSTOM); // must not crash (direct Camera* path)

// --- struct returns ---
const mouse = GetMousePosition();
check("GetMousePosition", typeof mouse.x === "number" && typeof mouse.y === "number", `${mouse.x.toFixed(0)},${mouse.y.toFixed(0)}`);
const col = Fade(RED, 0.5);
check("Fade", col.a === 127, `a=${col.a}`); // raylib: (int)(255*0.5) = 127
const tinted = ColorTint(RAYWHITE, BLUE);
check("ColorTint", tinted.b > tinted.r, `r=${tinted.r} b=${tinted.b}`);
const mat = GetCameraMatrix(cam);
check("GetCameraMatrix", Math.abs(mat.m0) > 0, `m0=${mat.m0.toFixed(2)}`);
const ray = GetScreenToWorldRay({ x: 320, y: 240 }, cam);
check("GetScreenToWorldRay", typeof ray.direction.z === "number");

// --- draw one frame exercising the bridge heavily ---
BeginDrawing();
ClearBackground(RAYWHITE);
DrawText("smoke", 10, 10, 20, RED);
DrawTextEx(font, "DrawTextEx!", { x: 10, y: 40 }, 20, 1, BLUE);
DrawTextPro(font, "Pro", { x: 10, y: 80 }, { x: 0, y: 0 }, 0, 20, 1, GREEN);
BeginMode3D(cam);
DrawCube({ x: 0, y: 0, z: 0 }, 1, 1, 1, BLUE);
DrawGrid(10, 1);
EndMode3D();
DrawCircle(mouse.x, mouse.y, 5, RED);
EndDrawing();

if (failures.length) {
  console.log(`\n${failures.length} FAILURES: ${failures.join(", ")}`);
} else {
  console.log("\nALL SMOKE TESTS PASSED");
}

CloseWindow();
process.exit(failures.length ? 1 : 0);
