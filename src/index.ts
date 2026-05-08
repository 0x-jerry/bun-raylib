export * from "./types";

// Raw FFI symbols (for advanced use)
export { lib, bridge } from "./ffi";

// High-level API
export {
  // Window
  InitWindow, CloseWindow, WindowShouldClose, IsWindowReady,
  IsWindowFullscreen, IsWindowHidden, IsWindowMinimized, IsWindowMaximized,
  IsWindowFocused, IsWindowResized, IsWindowState, SetWindowState, ClearWindowState,
  ToggleFullscreen, ToggleBorderlessWindowed, MaximizeWindow, MinimizeWindow,
  RestoreWindow, SetWindowTitle, SetWindowPosition, SetWindowMonitor,
  SetWindowMinSize, SetWindowMaxSize, SetWindowSize, SetWindowOpacity,
  SetWindowFocused, GetWindowHandle, GetScreenWidth, GetScreenHeight,
  GetRenderWidth, GetRenderHeight, GetMonitorCount, GetCurrentMonitor,
  GetMonitorWidth, GetMonitorHeight, GetMonitorPhysicalWidth, GetMonitorPhysicalHeight,
  GetMonitorRefreshRate, GetMonitorName, GetMonitorPosition,
  GetWindowPosition, GetWindowScaleDPI, SetClipboardText, GetClipboardText,
  EnableEventWaiting, DisableEventWaiting,

  // Cursor
  ShowCursor, HideCursor, IsCursorHidden, EnableCursor, DisableCursor, IsCursorOnScreen,

  // Drawing
  ClearBackground, BeginDrawing, EndDrawing, BeginMode2D, EndMode2D,
  BeginMode3D, EndMode3D, BeginTextureMode, EndTextureMode,
  BeginShaderMode, EndShaderMode, BeginBlendMode, EndBlendMode,
  BeginScissorMode, EndScissorMode,

  // Timing
  SetTargetFPS, GetFrameTime, GetTime, GetFPS,
  SwapScreenBuffer, PollInputEvents, WaitTime,

  // Random
  SetRandomSeed, GetRandomValue,

  // Misc
  TakeScreenshot, SetConfigFlags, OpenURL,
  SetTraceLogLevel,

  // Files
  FileExists, DirectoryExists, IsFileExtension, GetFileLength, GetFileModTime,
  IsPathFile, IsFileNameValid, IsFileDropped, GetWorkingDirectory,
  GetApplicationDirectory, ChangeDirectory, GetFileName, GetFileNameWithoutExt,
  GetDirectoryPath, GetPrevDirectoryPath, GetFileExtension,

  // Keyboard
  IsKeyPressed, IsKeyPressedRepeat, IsKeyDown, IsKeyReleased, IsKeyUp,
  GetKeyPressed, GetCharPressed, SetExitKey,

  // Mouse
  IsMouseButtonPressed, IsMouseButtonDown, IsMouseButtonReleased, IsMouseButtonUp,
  GetMouseX, GetMouseY, GetMousePosition, GetMouseDelta,
  SetMousePosition, SetMouseOffset, SetMouseScale,
  GetMouseWheelMove, GetMouseWheelMoveV, SetMouseCursor,

  // Gamepad
  IsGamepadAvailable, GetGamepadName,
  IsGamepadButtonPressed, IsGamepadButtonDown, IsGamepadButtonReleased, IsGamepadButtonUp,
  GetGamepadButtonPressed, GetGamepadAxisCount, GetGamepadAxisMovement,
  SetGamepadMappings, SetGamepadVibration,

  // Touch
  GetTouchX, GetTouchY, GetTouchPosition, GetTouchPointId, GetTouchPointCount,

  // Gestures
  SetGesturesEnabled, IsGestureDetected, GetGestureDetected,
  GetGestureHoldDuration, GetGestureDragVector, GetGestureDragAngle,
  GetGesturePinchVector, GetGesturePinchAngle,

  // Camera
  UpdateCamera,
  GetScreenToWorldRay, GetWorldToScreen, GetWorldToScreen2D, GetScreenToWorld2D,
  GetCameraMatrix, GetCameraMatrix2D,

  // Shapes
  SetShapesTexture, GetShapesTexture, GetShapesTextureRectangle,
  DrawPixel, DrawPixelV, DrawLine, DrawLineV, DrawLineEx, DrawLineBezier, DrawLineDashed,
  DrawCircle, DrawCircleV, DrawCircleGradient, DrawCircleSector, DrawCircleSectorLines,
  DrawCircleLines, DrawCircleLinesV,
  DrawEllipse, DrawEllipseV, DrawEllipseLines, DrawEllipseLinesV,
  DrawRing, DrawRingLines,
  DrawRectangle, DrawRectangleV, DrawRectangleRec, DrawRectanglePro,
  DrawRectangleGradientV, DrawRectangleGradientH, DrawRectangleGradientEx,
  DrawRectangleLines, DrawRectangleLinesEx,
  DrawRectangleRounded, DrawRectangleRoundedLines, DrawRectangleRoundedLinesEx,
  DrawTriangle, DrawTriangleLines,
  DrawPoly, DrawPolyLines, DrawPolyLinesEx,

  // Splines
  DrawSplineSegmentLinear, DrawSplineSegmentBasis, DrawSplineSegmentCatmullRom,
  DrawSplineSegmentBezierQuadratic, DrawSplineSegmentBezierCubic,
  GetSplinePointLinear, GetSplinePointBasis, GetSplinePointCatmullRom,
  GetSplinePointBezierQuad, GetSplinePointBezierCubic,

  // Collision 2D
  CheckCollisionRecs, CheckCollisionCircles, CheckCollisionCircleRec,
  CheckCollisionCircleLine, CheckCollisionPointRec, CheckCollisionPointCircle,
  CheckCollisionPointTriangle, CheckCollisionPointLine, GetCollisionRec,

  // Text
  DrawFPS, DrawText, DrawTextEx, DrawTextPro,
  MeasureText, MeasureTextEx, SetTextLineSpacing,

  // Font
  GetFontDefault, LoadFont, UnloadFont,

  // Image
  LoadImage, LoadImageFromTexture, LoadImageFromScreen,
  GenImageColor, ImageFromImage, ImageText,
  IsImageValid, UnloadImage, ExportImage,

  // Texture
  LoadTexture, LoadTextureFromImage, LoadRenderTexture,
  IsTextureValid, IsRenderTextureValid,
  UnloadTexture, UnloadRenderTexture,
  SetTextureFilter, SetTextureWrap,

  // Texture Drawing
  DrawTexture, DrawTextureV, DrawTextureEx, DrawTextureRec,
  DrawTexturePro, DrawTextureNPatch,

  // Color
  Fade, ColorToInt, ColorNormalize, ColorFromNormalized,
  ColorToHSV, ColorFromHSV, ColorTint, ColorBrightness, ColorContrast,
  ColorAlpha, ColorAlphaBlend, ColorLerp, ColorIsEqual, GetColor,

  // 3D Shapes
  DrawLine3D, DrawPoint3D, DrawCircle3D, DrawTriangle3D,
  DrawCube, DrawCubeV, DrawCubeWires, DrawCubeWiresV,
  DrawSphere, DrawSphereEx, DrawSphereWires,
  DrawCylinder, DrawCylinderEx, DrawCylinderWires, DrawCylinderWiresEx,
  DrawCapsule, DrawCapsuleWires,
  DrawPlane, DrawRay, DrawGrid,

  // Model
  DrawBoundingBox, DrawBillboard,

  // Collision 3D
  CheckCollisionSpheres, CheckCollisionBoxes, CheckCollisionBoxSphere,
  GetRayCollisionSphere, GetRayCollisionBox,
  GetRayCollisionTriangle, GetRayCollisionQuad,

  // Shader
  SetShaderValueMatrix,

  // Audio
  InitAudioDevice, CloseAudioDevice, IsAudioDeviceReady,
  SetMasterVolume, GetMasterVolume,
  LoadWave, LoadSound, LoadSoundFromWave, LoadMusicStream,
} from "./raylib";
