import { dlopen, FFIType, ptr, read, CString } from "bun:ffi";
import type { Pointer } from "bun:ffi";

type Ptr = Pointer;

const LIB_PATH = import.meta.dirname + "/../raylib-6.0_macos/lib/libraylib.dylib";
const BRIDGE_PATH = import.meta.dirname + "/bridge.dylib";

// ===== Direct raylib FFI bindings (functions with only primitive args/returns) =====
export const lib = dlopen(LIB_PATH, {
  // Window
  InitWindow: { args: [FFIType.i32, FFIType.i32, FFIType.cstring], returns: FFIType.void },
  CloseWindow: { args: [], returns: FFIType.void },
  WindowShouldClose: { args: [], returns: FFIType.bool },
  IsWindowReady: { args: [], returns: FFIType.bool },
  IsWindowFullscreen: { args: [], returns: FFIType.bool },
  IsWindowHidden: { args: [], returns: FFIType.bool },
  IsWindowMinimized: { args: [], returns: FFIType.bool },
  IsWindowMaximized: { args: [], returns: FFIType.bool },
  IsWindowFocused: { args: [], returns: FFIType.bool },
  IsWindowResized: { args: [], returns: FFIType.bool },
  IsWindowState: { args: [FFIType.u32], returns: FFIType.bool },
  SetWindowState: { args: [FFIType.u32], returns: FFIType.void },
  ClearWindowState: { args: [FFIType.u32], returns: FFIType.void },
  ToggleFullscreen: { args: [], returns: FFIType.void },
  ToggleBorderlessWindowed: { args: [], returns: FFIType.void },
  MaximizeWindow: { args: [], returns: FFIType.void },
  MinimizeWindow: { args: [], returns: FFIType.void },
  RestoreWindow: { args: [], returns: FFIType.void },
  SetWindowTitle: { args: [FFIType.cstring], returns: FFIType.void },
  SetWindowPosition: { args: [FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetWindowMonitor: { args: [FFIType.i32], returns: FFIType.void },
  SetWindowMinSize: { args: [FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetWindowMaxSize: { args: [FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetWindowSize: { args: [FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetWindowOpacity: { args: [FFIType.f32], returns: FFIType.void },
  SetWindowFocused: { args: [], returns: FFIType.void },
  GetWindowHandle: { args: [], returns: FFIType.ptr },
  GetScreenWidth: { args: [], returns: FFIType.i32 },
  GetScreenHeight: { args: [], returns: FFIType.i32 },
  GetRenderWidth: { args: [], returns: FFIType.i32 },
  GetRenderHeight: { args: [], returns: FFIType.i32 },
  GetMonitorCount: { args: [], returns: FFIType.i32 },
  GetCurrentMonitor: { args: [], returns: FFIType.i32 },
  GetMonitorWidth: { args: [FFIType.i32], returns: FFIType.i32 },
  GetMonitorHeight: { args: [FFIType.i32], returns: FFIType.i32 },
  GetMonitorPhysicalWidth: { args: [FFIType.i32], returns: FFIType.i32 },
  GetMonitorPhysicalHeight: { args: [FFIType.i32], returns: FFIType.i32 },
  GetMonitorRefreshRate: { args: [FFIType.i32], returns: FFIType.i32 },
  GetMonitorName: { args: [FFIType.i32], returns: FFIType.cstring },
  SetClipboardText: { args: [FFIType.cstring], returns: FFIType.void },
  GetClipboardText: { args: [], returns: FFIType.cstring },
  EnableEventWaiting: { args: [], returns: FFIType.void },
  DisableEventWaiting: { args: [], returns: FFIType.void },

  // Cursor
  ShowCursor: { args: [], returns: FFIType.void },
  HideCursor: { args: [], returns: FFIType.void },
  IsCursorHidden: { args: [], returns: FFIType.bool },
  EnableCursor: { args: [], returns: FFIType.void },
  DisableCursor: { args: [], returns: FFIType.void },
  IsCursorOnScreen: { args: [], returns: FFIType.bool },

  // Drawing
  BeginDrawing: { args: [], returns: FFIType.void },
  EndDrawing: { args: [], returns: FFIType.void },
  EndMode2D: { args: [], returns: FFIType.void },
  EndMode3D: { args: [], returns: FFIType.void },
  EndTextureMode: { args: [], returns: FFIType.void },
  EndShaderMode: { args: [], returns: FFIType.void },
  BeginBlendMode: { args: [FFIType.i32], returns: FFIType.void },
  EndBlendMode: { args: [], returns: FFIType.void },
  BeginScissorMode: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.void },
  EndScissorMode: { args: [], returns: FFIType.void },

  // Timing
  SetTargetFPS: { args: [FFIType.i32], returns: FFIType.void },
  GetFrameTime: { args: [], returns: FFIType.f32 },
  GetTime: { args: [], returns: FFIType.f64 },
  GetFPS: { args: [], returns: FFIType.i32 },

  // Custom frame control
  SwapScreenBuffer: { args: [], returns: FFIType.void },
  PollInputEvents: { args: [], returns: FFIType.void },
  WaitTime: { args: [FFIType.f64], returns: FFIType.void },

  // Random
  SetRandomSeed: { args: [FFIType.u32], returns: FFIType.void },
  GetRandomValue: { args: [FFIType.i32, FFIType.i32], returns: FFIType.i32 },

  // Misc
  TakeScreenshot: { args: [FFIType.cstring], returns: FFIType.void },
  SetConfigFlags: { args: [FFIType.u32], returns: FFIType.void },
  OpenURL: { args: [FFIType.cstring], returns: FFIType.void },

  // Logging
  SetTraceLogLevel: { args: [FFIType.i32], returns: FFIType.void },

  // Files
  FileExists: { args: [FFIType.cstring], returns: FFIType.bool },
  DirectoryExists: { args: [FFIType.cstring], returns: FFIType.bool },
  IsFileExtension: { args: [FFIType.cstring, FFIType.cstring], returns: FFIType.bool },
  GetFileModTime: { args: [FFIType.cstring], returns: FFIType.i32 },
  GetFileLength: { args: [FFIType.cstring], returns: FFIType.i32 },
  IsPathFile: { args: [FFIType.cstring], returns: FFIType.bool },
  IsFileNameValid: { args: [FFIType.cstring], returns: FFIType.bool },
  IsFileDropped: { args: [], returns: FFIType.bool },
  GetWorkingDirectory: { args: [], returns: FFIType.cstring },
  GetApplicationDirectory: { args: [], returns: FFIType.cstring },
  ChangeDirectory: { args: [FFIType.cstring], returns: FFIType.bool },
  GetFileName: { args: [FFIType.cstring], returns: FFIType.cstring },
  GetFileNameWithoutExt: { args: [FFIType.cstring], returns: FFIType.cstring },
  GetDirectoryPath: { args: [FFIType.cstring], returns: FFIType.cstring },
  GetPrevDirectoryPath: { args: [FFIType.cstring], returns: FFIType.cstring },
  GetFileExtension: { args: [FFIType.cstring], returns: FFIType.cstring },

  // Input: Keyboard
  IsKeyPressed: { args: [FFIType.i32], returns: FFIType.bool },
  IsKeyPressedRepeat: { args: [FFIType.i32], returns: FFIType.bool },
  IsKeyDown: { args: [FFIType.i32], returns: FFIType.bool },
  IsKeyReleased: { args: [FFIType.i32], returns: FFIType.bool },
  IsKeyUp: { args: [FFIType.i32], returns: FFIType.bool },
  GetKeyPressed: { args: [], returns: FFIType.i32 },
  GetCharPressed: { args: [], returns: FFIType.i32 },
  SetExitKey: { args: [FFIType.i32], returns: FFIType.void },

  // Input: Mouse (primitive)
  IsMouseButtonPressed: { args: [FFIType.i32], returns: FFIType.bool },
  IsMouseButtonDown: { args: [FFIType.i32], returns: FFIType.bool },
  IsMouseButtonReleased: { args: [FFIType.i32], returns: FFIType.bool },
  IsMouseButtonUp: { args: [FFIType.i32], returns: FFIType.bool },
  GetMouseX: { args: [], returns: FFIType.i32 },
  GetMouseY: { args: [], returns: FFIType.i32 },
  SetMousePosition: { args: [FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetMouseOffset: { args: [FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetMouseScale: { args: [FFIType.f32, FFIType.f32], returns: FFIType.void },
  GetMouseWheelMove: { args: [], returns: FFIType.f32 },
  SetMouseCursor: { args: [FFIType.i32], returns: FFIType.void },

  // Input: Gamepad
  IsGamepadAvailable: { args: [FFIType.i32], returns: FFIType.bool },
  GetGamepadName: { args: [FFIType.i32], returns: FFIType.cstring },
  IsGamepadButtonPressed: { args: [FFIType.i32, FFIType.i32], returns: FFIType.bool },
  IsGamepadButtonDown: { args: [FFIType.i32, FFIType.i32], returns: FFIType.bool },
  IsGamepadButtonReleased: { args: [FFIType.i32, FFIType.i32], returns: FFIType.bool },
  IsGamepadButtonUp: { args: [FFIType.i32, FFIType.i32], returns: FFIType.bool },
  GetGamepadButtonPressed: { args: [], returns: FFIType.i32 },
  GetGamepadAxisCount: { args: [FFIType.i32], returns: FFIType.i32 },
  GetGamepadAxisMovement: { args: [FFIType.i32, FFIType.i32], returns: FFIType.f32 },
  SetGamepadMappings: { args: [FFIType.cstring], returns: FFIType.i32 },
  SetGamepadVibration: { args: [FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.void },

  // Input: Touch
  GetTouchX: { args: [], returns: FFIType.i32 },
  GetTouchY: { args: [], returns: FFIType.i32 },
  GetTouchPointId: { args: [FFIType.i32], returns: FFIType.i32 },
  GetTouchPointCount: { args: [], returns: FFIType.i32 },

  // Gestures
  SetGesturesEnabled: { args: [FFIType.u32], returns: FFIType.void },
  IsGestureDetected: { args: [FFIType.u32], returns: FFIType.bool },
  GetGestureDetected: { args: [], returns: FFIType.i32 },
  GetGestureHoldDuration: { args: [], returns: FFIType.f32 },
  GetGestureDragAngle: { args: [], returns: FFIType.f32 },
  GetGesturePinchAngle: { args: [], returns: FFIType.f32 },

  // Basic shapes (ALL routed through bridge due to Color struct ABI)
  // Text
  DrawFPS: { args: [FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetTextLineSpacing: { args: [FFIType.i32], returns: FFIType.void },
  MeasureText: { args: [FFIType.cstring, FFIType.i32], returns: FFIType.i32 },
  GetGlyphIndex: { args: [FFIType.ptr, FFIType.i32], returns: FFIType.i32 },

  // Texture
  IsTextureValid: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.bool },
  IsRenderTextureValid: { args: [FFIType.u32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.bool },
  UnloadTexture: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.void },
  UnloadRenderTexture: { args: [FFIType.u32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetTextureFilter: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.void },
  SetTextureWrap: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.void },
  GenTextureMipmaps: { args: [FFIType.ptr], returns: FFIType.void },

  // Image
  IsImageValid: { args: [FFIType.ptr, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.bool },
  UnloadImage: { args: [FFIType.ptr, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.void },
  ExportImage: { args: [FFIType.ptr, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.cstring], returns: FFIType.bool },
  ImageCopy: { args: [FFIType.ptr, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.ptr },

  // Font
  IsFontValid: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.ptr, FFIType.ptr], returns: FFIType.bool },
  UnloadFont: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.ptr, FFIType.ptr], returns: FFIType.void },

  // Audio
  InitAudioDevice: { args: [], returns: FFIType.void },
  CloseAudioDevice: { args: [], returns: FFIType.void },
  IsAudioDeviceReady: { args: [], returns: FFIType.bool },
  SetMasterVolume: { args: [FFIType.f32], returns: FFIType.void },
  GetMasterVolume: { args: [], returns: FFIType.f32 },

  // Grid
  DrawGrid: { args: [FFIType.i32, FFIType.f32], returns: FFIType.void },
});

// ===== Bridge library (struct-handling wrapper functions) =====
export const bridge = dlopen(BRIDGE_PATH, {
  // Window
  rlb_ClearBackground: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_BeginMode2D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.void },
  rlb_BeginMode3D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32], returns: FFIType.void },
  rlb_BeginTextureMode: { args: [FFIType.u32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.void },
  rlb_BeginShaderMode: { args: [FFIType.u32, FFIType.ptr], returns: FFIType.void },
  rlb_BeginScissorMode: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.void },

  // Monitor / Window returning Vector2
  rlb_GetMonitorPosition: { args: [FFIType.i32], returns: FFIType.ptr },
  rlb_GetWindowPosition: { args: [], returns: FFIType.ptr },
  rlb_GetWindowScaleDPI: { args: [], returns: FFIType.ptr },

  // Shader
  rlb_SetShaderValueMatrix: { args: [FFIType.u32, FFIType.ptr, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.void },

  // Screen-space
  rlb_GetScreenToWorldRay: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32], returns: FFIType.ptr },
  rlb_GetWorldToScreen: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32], returns: FFIType.ptr },
  rlb_GetWorldToScreen2D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetScreenToWorld2D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetCameraMatrix: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32], returns: FFIType.ptr },
  rlb_GetCameraMatrix2D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },

  // Input: Mouse (Vector2 return)
  rlb_GetMousePosition: { args: [], returns: FFIType.ptr },
  rlb_GetMouseDelta: { args: [], returns: FFIType.ptr },
  rlb_GetMouseWheelMoveV: { args: [], returns: FFIType.ptr },
  rlb_GetTouchPosition: { args: [FFIType.i32], returns: FFIType.ptr },

  // Gestures (Vector2 return)
  rlb_GetGestureDragVector: { args: [], returns: FFIType.ptr },
  rlb_GetGesturePinchVector: { args: [], returns: FFIType.ptr },

  // Camera system
  rlb_UpdateCamera: { args: [FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.ptr, FFIType.i32], returns: FFIType.void },

  // Shapes
  rlb_SetShapesTexture: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.void },
  rlb_GetShapesTexture: { args: [], returns: FFIType.ptr },
  rlb_GetShapesTextureRectangle: { args: [], returns: FFIType.ptr },

  rlb_DrawPixelV: { args: [FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawLineV: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },

  // Bridge wrappers for functions taking Color by value (fixes ARM64 ABI)
  rlb_DrawPixel: { args: [FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawLine: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCircle: { args: [FFIType.i32, FFIType.i32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCircleLines: { args: [FFIType.i32, FFIType.i32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawEllipse: { args: [FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawEllipseLines: { args: [FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangle: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleLines: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleGradientV: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleGradientH: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawText: { args: [FFIType.cstring, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawLineEx: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawLineBezier: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawLineDashed: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCircleV: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCircleGradient: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCircleSector: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCircleSectorLines: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCircleLinesV: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawEllipseV: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawEllipseLinesV: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRing: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRingLines: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleV: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleRec: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectanglePro: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleGradientEx: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleLinesEx: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleRounded: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleRoundedLines: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRectangleRoundedLinesEx: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawTriangle: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawTriangleLines: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawPoly: { args: [FFIType.f32, FFIType.f32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawPolyLines: { args: [FFIType.f32, FFIType.f32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawPolyLinesEx: { args: [FFIType.f32, FFIType.f32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },

  // Splines
  rlb_DrawSplineSegmentLinear: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawSplineSegmentBasis: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawSplineSegmentCatmullRom: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawSplineSegmentBezierQuadratic: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawSplineSegmentBezierCubic: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_GetSplinePointLinear: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetSplinePointBasis: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetSplinePointCatmullRom: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetSplinePointBezierQuad: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetSplinePointBezierCubic: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },

  // Collision detection
  rlb_CheckCollisionRecs: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionCircles: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionCircleRec: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionCircleLine: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionPointRec: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionPointCircle: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionPointTriangle: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionPointLine: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32], returns: FFIType.bool },
  rlb_GetCollisionRec: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },

  // Image
  rlb_LoadImage: { args: [FFIType.cstring], returns: FFIType.ptr },
  rlb_LoadImageFromTexture: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.ptr },
  rlb_LoadImageFromScreen: { args: [], returns: FFIType.ptr },
  rlb_GenImageColor: { args: [FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.ptr },
  rlb_ImageFromImage: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_ImageText: { args: [FFIType.cstring, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.ptr },

  // Texture
  rlb_LoadTexture: { args: [FFIType.cstring], returns: FFIType.ptr },
  rlb_LoadTextureFromImage: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32], returns: FFIType.ptr },
  rlb_LoadRenderTexture: { args: [FFIType.i32, FFIType.i32], returns: FFIType.ptr },
  rlb_DrawTextureV: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawTextureEx: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawTextureRec: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawTexturePro: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawTextureNPatch: { args: [FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },

  // Color functions
  rlb_ColorIsEqual: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.bool },
  rlb_ColorToInt: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.i32 },
  rlb_ColorNormalize: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.ptr },
  rlb_ColorFromNormalized: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_ColorToHSV: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.ptr },
  rlb_ColorFromHSV: { args: [FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_ColorTint: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.ptr },
  rlb_ColorBrightness: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.f32], returns: FFIType.ptr },
  rlb_ColorContrast: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.f32], returns: FFIType.ptr },
  rlb_ColorAlpha: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.f32], returns: FFIType.ptr },
  rlb_ColorAlphaBlend: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.ptr },
  rlb_ColorLerp: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.f32], returns: FFIType.ptr },
  rlb_GetColor: { args: [FFIType.u32], returns: FFIType.ptr },
  rlb_Fade: { args: [FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.f32], returns: FFIType.ptr },

  // Font functions
  rlb_GetFontDefault: { args: [], returns: FFIType.ptr },
  rlb_LoadFont: { args: [FFIType.cstring], returns: FFIType.ptr },
  rlb_DrawTextEx: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.cstring, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawTextPro: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.cstring, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_MeasureTextEx: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.cstring, FFIType.f32, FFIType.f32], returns: FFIType.ptr },

  // 3D shapes
  rlb_DrawLine3D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawPoint3D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCircle3D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawTriangle3D: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCube: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCubeV: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCubeWires: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCubeWiresV: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawSphere: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawSphereEx: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawSphereWires: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCylinder: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCylinderEx: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCylinderWires: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCylinderWiresEx: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCapsule: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawCapsuleWires: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.i32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawPlane: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawRay: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },

  // Model drawing
  rlb_DrawModel: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawModelEx: { args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawBoundingBox: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },
  rlb_DrawBillboard: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.i32, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.u8, FFIType.u8, FFIType.u8, FFIType.u8], returns: FFIType.void },

  // Collision 3D
  rlb_CheckCollisionSpheres: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionBoxes: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_CheckCollisionBoxSphere: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.bool },
  rlb_GetRayCollisionSphere: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetRayCollisionBox: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetRayCollisionTriangle: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },
  rlb_GetRayCollisionQuad: { args: [FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32, FFIType.f32], returns: FFIType.ptr },

  // Audio
  rlb_LoadWave: { args: [FFIType.cstring], returns: FFIType.ptr },
  rlb_LoadSound: { args: [FFIType.cstring], returns: FFIType.ptr },
  rlb_LoadSoundFromWave: { args: [FFIType.u32, FFIType.u32, FFIType.u32, FFIType.u32, FFIType.i32], returns: FFIType.ptr },
  rlb_LoadMusicStream: { args: [FFIType.cstring], returns: FFIType.ptr },
});

// ===== Read helper functions for reading struct data from pointers =====

export function readVector2(ptr: Ptr): { x: number; y: number } {
  return { x: read.f32(ptr, 0), y: read.f32(ptr, 4) };
}

export function readVector3(ptr: Ptr): { x: number; y: number; z: number } {
  return { x: read.f32(ptr, 0), y: read.f32(ptr, 4), z: read.f32(ptr, 8) };
}

export function readVector4(ptr: Ptr): { x: number; y: number; z: number; w: number } {
  return { x: read.f32(ptr, 0), y: read.f32(ptr, 4), z: read.f32(ptr, 8), w: read.f32(ptr, 12) };
}

export function readColor(ptr: Ptr): { r: number; g: number; b: number; a: number } {
  return { r: read.u8(ptr, 0), g: read.u8(ptr, 1), b: read.u8(ptr, 2), a: read.u8(ptr, 3) };
}

export function readRectangle(ptr: Ptr): { x: number; y: number; width: number; height: number } {
  return { x: read.f32(ptr, 0), y: read.f32(ptr, 4), width: read.f32(ptr, 8), height: read.f32(ptr, 12) };
}

export function readMatrix(ptr: Ptr): {
  m0: number; m4: number; m8: number; m12: number;
  m1: number; m5: number; m9: number; m13: number;
  m2: number; m6: number; m10: number; m14: number;
  m3: number; m7: number; m11: number; m15: number;
} {
  return {
    m0: read.f32(ptr, 0), m4: read.f32(ptr, 4), m8: read.f32(ptr, 8), m12: read.f32(ptr, 12),
    m1: read.f32(ptr, 16), m5: read.f32(ptr, 20), m9: read.f32(ptr, 24), m13: read.f32(ptr, 28),
    m2: read.f32(ptr, 32), m6: read.f32(ptr, 36), m10: read.f32(ptr, 40), m14: read.f32(ptr, 44),
    m3: read.f32(ptr, 48), m7: read.f32(ptr, 52), m11: read.f32(ptr, 56), m15: read.f32(ptr, 60),
  };
}

export function readRay(ptr: Ptr): { position: { x: number; y: number; z: number }; direction: { x: number; y: number; z: number } } {
  return {
    position: readVector3(ptr),
    direction: readVector3((ptr + 12) as Ptr),
  };
}

export function readRayCollision(ptr: Ptr): {
  hit: boolean; distance: number;
  point: { x: number; y: number; z: number };
  normal: { x: number; y: number; z: number };
} {
  return {
    hit: read.u8(ptr, 0) !== 0,
    distance: read.f32(ptr, 4),
    point: readVector3((ptr + 8) as Ptr),
    normal: readVector3((ptr + 20) as Ptr),
  };
}

export function readImage(ptr: Ptr): { data: number; width: number; height: number; mipmaps: number; format: number } {
  return { data: read.ptr(ptr, 0), width: read.i32(ptr, 8), height: read.i32(ptr, 12), mipmaps: read.i32(ptr, 16), format: read.i32(ptr, 20) };
}

export function readTexture2D(ptr: Ptr): { id: number; width: number; height: number; mipmaps: number; format: number } {
  return { id: read.u32(ptr, 0), width: read.i32(ptr, 4), height: read.i32(ptr, 8), mipmaps: read.i32(ptr, 12), format: read.i32(ptr, 16) };
}

export function readRenderTexture2D(ptr: Ptr): {
  id: number;
  texture: { id: number; width: number; height: number; mipmaps: number; format: number };
  depth: { id: number; width: number; height: number; mipmaps: number; format: number };
} {
  return {
    id: read.u32(ptr, 0),
    texture: readTexture2D((ptr + 4) as Ptr),
    depth: readTexture2D((ptr + 24) as Ptr),
  };
}

export function readFont(ptr: Ptr) {
  return {
    baseSize: read.i32(ptr, 0),
    glyphCount: read.i32(ptr, 4),
    glyphPadding: read.i32(ptr, 8),
    texture: readTexture2D((ptr + 12) as Ptr),
    recs: read.ptr(ptr, 32),
    glyphs: read.ptr(ptr, 40),
  };
}

export function readWave(ptr: Ptr) {
  return {
    frameCount: read.u32(ptr, 0),
    sampleRate: read.u32(ptr, 4),
    sampleSize: read.u32(ptr, 8),
    channels: read.u32(ptr, 12),
    data: read.ptr(ptr, 16),
  };
}

export function readSound(ptr: Ptr) {
  return {
    stream: {
      buffer: read.ptr(ptr, 0),
      processor: read.ptr(ptr, 8),
      sampleRate: read.u32(ptr, 16),
      sampleSize: read.u32(ptr, 20),
      channels: read.u32(ptr, 24),
    },
    frameCount: read.u32(ptr, 28),
  };
}

export function readMusic(ptr: Ptr) {
  return {
    stream: {
      buffer: read.ptr(ptr, 0),
      processor: read.ptr(ptr, 8),
      sampleRate: read.u32(ptr, 16),
      sampleSize: read.u32(ptr, 20),
      channels: read.u32(ptr, 24),
    },
    frameCount: read.u32(ptr, 28),
    looping: read.u8(ptr, 32) !== 0,
    ctxType: read.i32(ptr, 36),
    ctxData: read.ptr(ptr, 40),
  };
}

export type { Pointer };

