import { ptr } from "bun:ffi";
import type { Pointer } from "bun:ffi";
import {
  lib,
  bridge,
  readVector2,
  readVector3,
  readVector4,
  readColor,
  readRectangle,
  readMatrix,
  readRay,
  readRayCollision,
  readImage,
  readTexture2D,
  readRenderTexture2D,
  readFont,
  readWave,
  readSound,
  readMusic,
} from "./ffi";

import type {
  Vector2,
  Vector3,
  Vector4,
  Color,
  Rectangle,
  Matrix,
  Ray,
  RayCollision,
  Image,
  Texture2D,
  RenderTexture2D,
  Font,
  Wave,
  Sound,
  Music,
} from "./types";

const L = lib.symbols;
const B = bridge.symbols;

const encoder = new TextEncoder();

function cstr(text: string): Pointer {
  const buf = encoder.encode(text + "\0");
  return ptr(buf);
}

function toStr(v: unknown): string {
  return v as unknown as string;
}

// ===== Window =====

export function InitWindow(width: number, height: number, title: string): void {
  L.InitWindow(width, height, cstr(title));
}

export function CloseWindow(): void {
  L.CloseWindow();
}

export function WindowShouldClose(): boolean {
  return L.WindowShouldClose();
}

export function IsWindowReady(): boolean {
  return L.IsWindowReady();
}

export function IsWindowFullscreen(): boolean {
  return L.IsWindowFullscreen();
}

export function IsWindowHidden(): boolean {
  return L.IsWindowHidden();
}

export function IsWindowMinimized(): boolean {
  return L.IsWindowMinimized();
}

export function IsWindowMaximized(): boolean {
  return L.IsWindowMaximized();
}

export function IsWindowFocused(): boolean {
  return L.IsWindowFocused();
}

export function IsWindowResized(): boolean {
  return L.IsWindowResized();
}

export function IsWindowState(flag: number): boolean {
  return L.IsWindowState(flag);
}

export function SetWindowState(flags: number): void {
  L.SetWindowState(flags);
}

export function ClearWindowState(flags: number): void {
  L.ClearWindowState(flags);
}

export function ToggleFullscreen(): void {
  L.ToggleFullscreen();
}

export function ToggleBorderlessWindowed(): void {
  L.ToggleBorderlessWindowed();
}

export function MaximizeWindow(): void {
  L.MaximizeWindow();
}

export function MinimizeWindow(): void {
  L.MinimizeWindow();
}

export function RestoreWindow(): void {
  L.RestoreWindow();
}

export function SetWindowTitle(title: string): void {
  L.SetWindowTitle(cstr(title));
}

export function SetWindowPosition(x: number, y: number): void {
  L.SetWindowPosition(x, y);
}

export function SetWindowMonitor(monitor: number): void {
  L.SetWindowMonitor(monitor);
}

export function SetWindowMinSize(width: number, height: number): void {
  L.SetWindowMinSize(width, height);
}

export function SetWindowMaxSize(width: number, height: number): void {
  L.SetWindowMaxSize(width, height);
}

export function SetWindowSize(width: number, height: number): void {
  L.SetWindowSize(width, height);
}

export function SetWindowOpacity(opacity: number): void {
  L.SetWindowOpacity(opacity);
}

export function SetWindowFocused(): void {
  L.SetWindowFocused();
}

export function GetWindowHandle(): Pointer {
  return L.GetWindowHandle()!;
}

export function GetScreenWidth(): number {
  return L.GetScreenWidth();
}

export function GetScreenHeight(): number {
  return L.GetScreenHeight();
}

export function GetRenderWidth(): number {
  return L.GetRenderWidth();
}

export function GetRenderHeight(): number {
  return L.GetRenderHeight();
}

export function GetMonitorCount(): number {
  return L.GetMonitorCount();
}

export function GetCurrentMonitor(): number {
  return L.GetCurrentMonitor();
}

export function GetMonitorWidth(monitor: number): number {
  return L.GetMonitorWidth(monitor);
}

export function GetMonitorHeight(monitor: number): number {
  return L.GetMonitorHeight(monitor);
}

export function GetMonitorPhysicalWidth(monitor: number): number {
  return L.GetMonitorPhysicalWidth(monitor);
}

export function GetMonitorPhysicalHeight(monitor: number): number {
  return L.GetMonitorPhysicalHeight(monitor);
}

export function GetMonitorRefreshRate(monitor: number): number {
  return L.GetMonitorRefreshRate(monitor);
}

export function GetMonitorName(monitor: number): string {
  return L.GetMonitorName(monitor) as unknown as string;
}

export function GetMonitorPosition(monitor: number): Vector2 {
  const ptr = B.rlb_GetMonitorPosition(monitor)!;
  return readVector2(ptr);
}

export function GetWindowPosition(): Vector2 {
  const ptr = B.rlb_GetWindowPosition()!;
  return readVector2(ptr);
}

export function GetWindowScaleDPI(): Vector2 {
  const ptr = B.rlb_GetWindowScaleDPI()!;
  return readVector2(ptr);
}

export function SetClipboardText(text: string): void {
  L.SetClipboardText(cstr(text));
}

export function GetClipboardText(): string {
  return L.GetClipboardText() as unknown as string;
}

export function EnableEventWaiting(): void {
  L.EnableEventWaiting();
}

export function DisableEventWaiting(): void {
  L.DisableEventWaiting();
}

// ===== Cursor =====

export function ShowCursor(): void {
  L.ShowCursor();
}

export function HideCursor(): void {
  L.HideCursor();
}

export function IsCursorHidden(): boolean {
  return L.IsCursorHidden();
}

export function EnableCursor(): void {
  L.EnableCursor();
}

export function DisableCursor(): void {
  L.DisableCursor();
}

export function IsCursorOnScreen(): boolean {
  return L.IsCursorOnScreen();
}

// ===== Drawing =====

export function ClearBackground(color: Color): void {
  B.rlb_ClearBackground(color.r, color.g, color.b, color.a)!;
}

export function BeginDrawing(): void {
  L.BeginDrawing();
}

export function EndDrawing(): void {
  L.EndDrawing();
}

export function BeginMode2D(camera: { offset: Vector2; target: Vector2; rotation: number; zoom: number }): void {
  B.rlb_BeginMode2D(camera.offset.x, camera.offset.y, camera.target.x, camera.target.y, camera.rotation, camera.zoom)!;
}

export function EndMode2D(): void {
  L.EndMode2D();
}

export function BeginMode3D(camera: { position: Vector3; target: Vector3; up: Vector3; fovy: number; projection: number }): void {
  B.rlb_BeginMode3D(
    camera.position.x, camera.position.y, camera.position.z,
    camera.target.x, camera.target.y, camera.target.z,
    camera.up.x, camera.up.y, camera.up.z,
    camera.fovy, camera.projection,
  );
}

export function EndMode3D(): void {
  L.EndMode3D();
}

export function BeginTextureMode(target: RenderTexture2D): void {
  B.rlb_BeginTextureMode(
    target.id,
    target.texture.id, target.texture.width, target.texture.height, target.texture.mipmaps, target.texture.format,
    target.depth.id, target.depth.width, target.depth.height, target.depth.mipmaps, target.depth.format,
  );
}

export function EndTextureMode(): void {
  L.EndTextureMode();
}

export function BeginShaderMode(shader: { id: number; locs: number }): void {
  B.rlb_BeginShaderMode(shader.id, shader.locs)!;
}

export function EndShaderMode(): void {
  L.EndShaderMode();
}

export function BeginBlendMode(mode: number): void {
  L.BeginBlendMode(mode);
}

export function EndBlendMode(): void {
  L.EndBlendMode();
}

export function BeginScissorMode(x: number, y: number, width: number, height: number): void {
  L.BeginScissorMode(x, y, width, height);
}

export function EndScissorMode(): void {
  L.EndScissorMode();
}

// ===== Timing =====

export function SetTargetFPS(fps: number): void {
  L.SetTargetFPS(fps);
}

export function GetFrameTime(): number {
  return L.GetFrameTime();
}

export function GetTime(): number {
  return L.GetTime();
}

export function GetFPS(): number {
  return L.GetFPS();
}

// ===== Custom frame control =====

export function SwapScreenBuffer(): void {
  L.SwapScreenBuffer();
}

export function PollInputEvents(): void {
  L.PollInputEvents();
}

export function WaitTime(seconds: number): void {
  L.WaitTime(seconds);
}

// ===== Random =====

export function SetRandomSeed(seed: number): void {
  L.SetRandomSeed(seed);
}

export function GetRandomValue(min: number, max: number): number {
  return L.GetRandomValue(min, max);
}

// ===== Misc =====

export function TakeScreenshot(fileName: string): void {
  L.TakeScreenshot(cstr(fileName));
}

export function SetConfigFlags(flags: number): void {
  L.SetConfigFlags(flags);
}

export function OpenURL(url: string): void {
  L.OpenURL(cstr(url));
}

// ===== Logging =====

export function SetTraceLogLevel(logLevel: number): void {
  L.SetTraceLogLevel(logLevel);
}

// ===== Files =====

export function FileExists(fileName: string): boolean {
  return L.FileExists(cstr(fileName));
}

export function DirectoryExists(dirPath: string): boolean {
  return L.DirectoryExists(cstr(dirPath));
}

export function IsFileExtension(fileName: string, ext: string): boolean {
  return L.IsFileExtension(cstr(fileName), cstr(ext));
}

export function GetFileLength(fileName: string): number {
  return L.GetFileLength(cstr(fileName));
}

export function GetFileModTime(fileName: string): number {
  return L.GetFileModTime(cstr(fileName));
}

export function IsPathFile(path: string): boolean {
  return L.IsPathFile(cstr(path));
}

export function IsFileNameValid(fileName: string): boolean {
  return L.IsFileNameValid(cstr(fileName));
}

export function IsFileDropped(): boolean {
  return L.IsFileDropped();
}

export function GetWorkingDirectory(): string {
  return L.GetWorkingDirectory() as unknown as string;
}

export function GetApplicationDirectory(): string {
  return L.GetApplicationDirectory() as unknown as string;
}

export function ChangeDirectory(dir: string): boolean {
  return L.ChangeDirectory(cstr(dir));
}

export function GetFileName(filePath: string): string {
  return L.GetFileName(cstr(filePath)) as unknown as string;
}

export function GetFileNameWithoutExt(filePath: string): string {
  return L.GetFileNameWithoutExt(cstr(filePath)) as unknown as string;
}

export function GetDirectoryPath(filePath: string): string {
  return L.GetDirectoryPath(cstr(filePath)) as unknown as string;
}

export function GetPrevDirectoryPath(dirPath: string): string {
  return L.GetPrevDirectoryPath(cstr(dirPath)) as unknown as string;
}

export function GetFileExtension(fileName: string): string {
  return L.GetFileExtension(cstr(fileName)) as unknown as string;
}

// ===== Keyboard Input =====

export function IsKeyPressed(key: number): boolean {
  return L.IsKeyPressed(key);
}

export function IsKeyPressedRepeat(key: number): boolean {
  return L.IsKeyPressedRepeat(key);
}

export function IsKeyDown(key: number): boolean {
  return L.IsKeyDown(key);
}

export function IsKeyReleased(key: number): boolean {
  return L.IsKeyReleased(key);
}

export function IsKeyUp(key: number): boolean {
  return L.IsKeyUp(key);
}

export function GetKeyPressed(): number {
  return L.GetKeyPressed();
}

export function GetCharPressed(): number {
  return L.GetCharPressed();
}

export function SetExitKey(key: number): void {
  L.SetExitKey(key);
}

// ===== Mouse Input =====

export function IsMouseButtonPressed(button: number): boolean {
  return L.IsMouseButtonPressed(button);
}

export function IsMouseButtonDown(button: number): boolean {
  return L.IsMouseButtonDown(button);
}

export function IsMouseButtonReleased(button: number): boolean {
  return L.IsMouseButtonReleased(button);
}

export function IsMouseButtonUp(button: number): boolean {
  return L.IsMouseButtonUp(button);
}

export function GetMouseX(): number {
  return L.GetMouseX();
}

export function GetMouseY(): number {
  return L.GetMouseY();
}

export function GetMousePosition(): Vector2 {
  const ptr = B.rlb_GetMousePosition()!;
  return readVector2(ptr);
}

export function GetMouseDelta(): Vector2 {
  const ptr = B.rlb_GetMouseDelta()!;
  return readVector2(ptr);
}

export function SetMousePosition(x: number, y: number): void {
  L.SetMousePosition(x, y);
}

export function SetMouseOffset(offsetX: number, offsetY: number): void {
  L.SetMouseOffset(offsetX, offsetY);
}

export function SetMouseScale(scaleX: number, scaleY: number): void {
  L.SetMouseScale(scaleX, scaleY);
}

export function GetMouseWheelMove(): number {
  return L.GetMouseWheelMove();
}

export function GetMouseWheelMoveV(): Vector2 {
  const ptr = B.rlb_GetMouseWheelMoveV()!;
  return readVector2(ptr);
}

export function SetMouseCursor(cursor: number): void {
  L.SetMouseCursor(cursor);
}

// ===== Gamepad Input =====

export function IsGamepadAvailable(gamepad: number): boolean {
  return L.IsGamepadAvailable(gamepad);
}

export function GetGamepadName(gamepad: number): string {
  return L.GetGamepadName(gamepad) as unknown as string;
}

export function IsGamepadButtonPressed(gamepad: number, button: number): boolean {
  return L.IsGamepadButtonPressed(gamepad, button);
}

export function IsGamepadButtonDown(gamepad: number, button: number): boolean {
  return L.IsGamepadButtonDown(gamepad, button);
}

export function IsGamepadButtonReleased(gamepad: number, button: number): boolean {
  return L.IsGamepadButtonReleased(gamepad, button);
}

export function IsGamepadButtonUp(gamepad: number, button: number): boolean {
  return L.IsGamepadButtonUp(gamepad, button);
}

export function GetGamepadButtonPressed(): number {
  return L.GetGamepadButtonPressed();
}

export function GetGamepadAxisCount(gamepad: number): number {
  return L.GetGamepadAxisCount(gamepad);
}

export function GetGamepadAxisMovement(gamepad: number, axis: number): number {
  return L.GetGamepadAxisMovement(gamepad, axis);
}

export function SetGamepadMappings(mappings: string): number {
  return L.SetGamepadMappings(cstr(mappings));
}

export function SetGamepadVibration(gamepad: number, leftMotor: number, rightMotor: number, duration: number): void {
  L.SetGamepadVibration(gamepad, leftMotor, rightMotor, duration);
}

// ===== Touch Input =====

export function GetTouchX(): number {
  return L.GetTouchX();
}

export function GetTouchY(): number {
  return L.GetTouchY();
}

export function GetTouchPosition(index: number): Vector2 {
  const ptr = B.rlb_GetTouchPosition(index)!;
  return readVector2(ptr);
}

export function GetTouchPointId(index: number): number {
  return L.GetTouchPointId(index);
}

export function GetTouchPointCount(): number {
  return L.GetTouchPointCount();
}

// ===== Gestures =====

export function SetGesturesEnabled(flags: number): void {
  L.SetGesturesEnabled(flags);
}

export function IsGestureDetected(gesture: number): boolean {
  return L.IsGestureDetected(gesture);
}

export function GetGestureDetected(): number {
  return L.GetGestureDetected();
}

export function GetGestureHoldDuration(): number {
  return L.GetGestureHoldDuration();
}

export function GetGestureDragVector(): Vector2 {
  const ptr = B.rlb_GetGestureDragVector()!;
  return readVector2(ptr);
}

export function GetGestureDragAngle(): number {
  return L.GetGestureDragAngle();
}

export function GetGesturePinchVector(): Vector2 {
  const ptr = B.rlb_GetGesturePinchVector()!;
  return readVector2(ptr);
}

export function GetGesturePinchAngle(): number {
  return L.GetGesturePinchAngle();
}

// ===== Camera System =====

export function UpdateCamera(
  camera: { position: Vector3; target: Vector3; up: Vector3; fovy: number; projection: number },
  mode: number
): void {
  const org = new Float32Array(11);
  org[0] = camera.position.x; org[1] = camera.position.y; org[2] = camera.position.z;
  org[3] = camera.target.x; org[4] = camera.target.y; org[5] = camera.target.z;
  org[6] = camera.up.x; org[7] = camera.up.y; org[8] = camera.up.z;
  org[9] = camera.fovy;
  // Store projection as float bits
  // Store projection int as float in the float array
  const view = new DataView(new ArrayBuffer(4));
  view.setInt32(0, camera.projection, true);
  org[10] = view.getFloat32(0, true);

  const orgPtr = ptr(org);

  B.rlb_UpdateCamera(
    orgPtr, orgPtr + 4, orgPtr + 8,
    orgPtr + 12, orgPtr + 16, orgPtr + 20,
    orgPtr + 24, orgPtr + 28, orgPtr + 32,
    orgPtr + 36, orgPtr + 40, mode,
  );
}

// ===== Screen-space =====

export function GetScreenToWorldRay(position: Vector2, camera: {
  position: Vector3; target: Vector3; up: Vector3; fovy: number; projection: number;
}): Ray {
  const ptr: Pointer = B.rlb_GetScreenToWorldRay(
    position.x, position.y,
    camera.position.x, camera.position.y, camera.position.z,
    camera.target.x, camera.target.y, camera.target.z,
    camera.up.x, camera.up.y, camera.up.z,
    camera.fovy, camera.projection,
  )!;
  return readRay(ptr);
}

export function GetWorldToScreen(position: Vector3, camera: {
  position: Vector3; target: Vector3; up: Vector3; fovy: number; projection: number;
}): Vector2 {
  const ptr: Pointer = B.rlb_GetWorldToScreen(
    position.x, position.y, position.z,
    camera.position.x, camera.position.y, camera.position.z,
    camera.target.x, camera.target.y, camera.target.z,
    camera.up.x, camera.up.y, camera.up.z,
    camera.fovy, camera.projection,
  )!;
  return readVector2(ptr);
}

export function GetWorldToScreen2D(position: Vector2, camera: {
  offset: Vector2; target: Vector2; rotation: number; zoom: number;
}): Vector2 {
  const ptr: Pointer = B.rlb_GetWorldToScreen2D(
    position.x, position.y,
    camera.offset.x, camera.offset.y,
    camera.target.x, camera.target.y,
    camera.rotation, camera.zoom,
  )!;
  return readVector2(ptr);
}

export function GetScreenToWorld2D(position: Vector2, camera: {
  offset: Vector2; target: Vector2; rotation: number; zoom: number;
}): Vector2 {
  const ptr: Pointer = B.rlb_GetScreenToWorld2D(
    position.x, position.y,
    camera.offset.x, camera.offset.y,
    camera.target.x, camera.target.y,
    camera.rotation, camera.zoom,
  )!;
  return readVector2(ptr);
}

export function GetCameraMatrix(camera: {
  position: Vector3; target: Vector3; up: Vector3; fovy: number; projection: number;
}): Matrix {
  const ptr: Pointer = B.rlb_GetCameraMatrix(
    camera.position.x, camera.position.y, camera.position.z,
    camera.target.x, camera.target.y, camera.target.z,
    camera.up.x, camera.up.y, camera.up.z,
    camera.fovy, camera.projection,
  )!;
  return readMatrix(ptr);
}

export function GetCameraMatrix2D(camera: {
  offset: Vector2; target: Vector2; rotation: number; zoom: number;
}): Matrix {
  const ptr: Pointer = B.rlb_GetCameraMatrix2D(
    camera.offset.x, camera.offset.y,
    camera.target.x, camera.target.y,
    camera.rotation, camera.zoom,
  )!;
  return readMatrix(ptr);
}

// ===== Shapes Drawing =====

export function SetShapesTexture(texture: Texture2D, source: Rectangle): void {
  B.rlb_SetShapesTexture(texture.id, texture.width, texture.height, texture.mipmaps, texture.format,
    source.x, source.y, source.width, source.height);
}

export function GetShapesTexture(): Texture2D {
  const ptr = B.rlb_GetShapesTexture()!;
  return readTexture2D(ptr);
}

export function GetShapesTextureRectangle(): Rectangle {
  const ptr = B.rlb_GetShapesTextureRectangle()!;
  return readRectangle(ptr);
}

export function DrawPixel(posX: number, posY: number, color: Color): void {
  B.rlb_DrawPixel(posX, posY, color.r, color.g, color.b, color.a);
}

export function DrawPixelV(position: Vector2, color: Color): void {
  B.rlb_DrawPixelV(position.x, position.y, color.r, color.g, color.b, color.a)!;
}

export function DrawLine(startPosX: number, startPosY: number, endPosX: number, endPosY: number, color: Color): void {
  B.rlb_DrawLine(startPosX, startPosY, endPosX, endPosY, color.r, color.g, color.b, color.a);
}

export function DrawLineV(startPos: Vector2, endPos: Vector2, color: Color): void {
  B.rlb_DrawLineV(startPos.x, startPos.y, endPos.x, endPos.y, color.r, color.g, color.b, color.a)!;
}

export function DrawLineEx(startPos: Vector2, endPos: Vector2, thick: number, color: Color): void {
  B.rlb_DrawLineEx(startPos.x, startPos.y, endPos.x, endPos.y, thick, color.r, color.g, color.b, color.a)!;
}

export function DrawLineBezier(startPos: Vector2, endPos: Vector2, thick: number, color: Color): void {
  B.rlb_DrawLineBezier(startPos.x, startPos.y, endPos.x, endPos.y, thick, color.r, color.g, color.b, color.a)!;
}

export function DrawLineDashed(startPos: Vector2, endPos: Vector2, dashSize: number, spaceSize: number, color: Color): void {
  B.rlb_DrawLineDashed(startPos.x, startPos.y, endPos.x, endPos.y, dashSize, spaceSize, color.r, color.g, color.b, color.a)!;
}

export function DrawCircle(centerX: number, centerY: number, radius: number, color: Color): void {
  B.rlb_DrawCircle(centerX, centerY, radius, color.r, color.g, color.b, color.a);
}

export function DrawCircleV(center: Vector2, radius: number, color: Color): void {
  B.rlb_DrawCircleV(center.x, center.y, radius, color.r, color.g, color.b, color.a)!;
}

export function DrawCircleGradient(center: Vector2, radius: number, inner: Color, outer: Color): void {
  B.rlb_DrawCircleGradient(center.x, center.y, radius,
    inner.r, inner.g, inner.b, inner.a,
    outer.r, outer.g, outer.b, outer.a);
}

export function DrawCircleSector(center: Vector2, radius: number, startAngle: number, endAngle: number, segments: number, color: Color): void {
  B.rlb_DrawCircleSector(center.x, center.y, radius, startAngle, endAngle, segments, color.r, color.g, color.b, color.a)!;
}

export function DrawCircleSectorLines(center: Vector2, radius: number, startAngle: number, endAngle: number, segments: number, color: Color): void {
  B.rlb_DrawCircleSectorLines(center.x, center.y, radius, startAngle, endAngle, segments, color.r, color.g, color.b, color.a)!;
}

export function DrawCircleLines(centerX: number, centerY: number, radius: number, color: Color): void {
  B.rlb_DrawCircleLines(centerX, centerY, radius, color.r, color.g, color.b, color.a);
}

export function DrawCircleLinesV(center: Vector2, radius: number, color: Color): void {
  B.rlb_DrawCircleLinesV(center.x, center.y, radius, color.r, color.g, color.b, color.a)!;
}

export function DrawEllipse(centerX: number, centerY: number, radiusH: number, radiusV: number, color: Color): void {
  B.rlb_DrawEllipse(centerX, centerY, radiusH, radiusV, color.r, color.g, color.b, color.a);
}

export function DrawEllipseV(center: Vector2, radiusH: number, radiusV: number, color: Color): void {
  B.rlb_DrawEllipseV(center.x, center.y, radiusH, radiusV, color.r, color.g, color.b, color.a)!;
}

export function DrawEllipseLines(centerX: number, centerY: number, radiusH: number, radiusV: number, color: Color): void {
  B.rlb_DrawEllipseLines(centerX, centerY, radiusH, radiusV, color.r, color.g, color.b, color.a);
}

export function DrawEllipseLinesV(center: Vector2, radiusH: number, radiusV: number, color: Color): void {
  B.rlb_DrawEllipseLinesV(center.x, center.y, radiusH, radiusV, color.r, color.g, color.b, color.a)!;
}

export function DrawRing(center: Vector2, innerRadius: number, outerRadius: number,
  startAngle: number, endAngle: number, segments: number, color: Color): void {
  B.rlb_DrawRing(center.x, center.y, innerRadius, outerRadius,
    startAngle, endAngle, segments, color.r, color.g, color.b, color.a);
}

export function DrawRingLines(center: Vector2, innerRadius: number, outerRadius: number,
  startAngle: number, endAngle: number, segments: number, color: Color): void {
  B.rlb_DrawRingLines(center.x, center.y, innerRadius, outerRadius,
    startAngle, endAngle, segments, color.r, color.g, color.b, color.a);
}

export function DrawRectangle(posX: number, posY: number, width: number, height: number, color: Color): void {
  B.rlb_DrawRectangle(posX, posY, width, height, color.r, color.g, color.b, color.a);
}

export function DrawRectangleV(position: Vector2, size: Vector2, color: Color): void {
  B.rlb_DrawRectangleV(position.x, position.y, size.x, size.y, color.r, color.g, color.b, color.a)!;
}

export function DrawRectangleRec(rec: Rectangle, color: Color): void {
  B.rlb_DrawRectangleRec(rec.x, rec.y, rec.width, rec.height, color.r, color.g, color.b, color.a)!;
}

export function DrawRectanglePro(rec: Rectangle, origin: Vector2, rotation: number, color: Color): void {
  B.rlb_DrawRectanglePro(rec.x, rec.y, rec.width, rec.height, origin.x, origin.y, rotation,
    color.r, color.g, color.b, color.a);
}

export function DrawRectangleGradientV(posX: number, posY: number, width: number, height: number,
  top: Color, bottom: Color): void {
  B.rlb_DrawRectangleGradientV(posX, posY, width, height,
    top.r, top.g, top.b, top.a,
    bottom.r, bottom.g, bottom.b, bottom.a);
}

export function DrawRectangleGradientH(posX: number, posY: number, width: number, height: number,
  left: Color, right: Color): void {
  B.rlb_DrawRectangleGradientH(posX, posY, width, height,
    left.r, left.g, left.b, left.a,
    right.r, right.g, right.b, right.a);
}

export function DrawRectangleGradientEx(rec: Rectangle,
  topLeft: Color, bottomLeft: Color, bottomRight: Color, topRight: Color): void {
  B.rlb_DrawRectangleGradientEx(rec.x, rec.y, rec.width, rec.height,
    topLeft.r, topLeft.g, topLeft.b, topLeft.a,
    bottomLeft.r, bottomLeft.g, bottomLeft.b, bottomLeft.a,
    bottomRight.r, bottomRight.g, bottomRight.b, bottomRight.a,
    topRight.r, topRight.g, topRight.b, topRight.a);
}

export function DrawRectangleLines(posX: number, posY: number, width: number, height: number, color: Color): void {
  B.rlb_DrawRectangleLines(posX, posY, width, height, color.r, color.g, color.b, color.a);
}

export function DrawRectangleLinesEx(rec: Rectangle, lineThick: number, color: Color): void {
  B.rlb_DrawRectangleLinesEx(rec.x, rec.y, rec.width, rec.height, lineThick, color.r, color.g, color.b, color.a)!;
}

export function DrawRectangleRounded(rec: Rectangle, roundness: number, segments: number, color: Color): void {
  B.rlb_DrawRectangleRounded(rec.x, rec.y, rec.width, rec.height, roundness, segments, color.r, color.g, color.b, color.a)!;
}

export function DrawRectangleRoundedLines(rec: Rectangle, roundness: number, segments: number, color: Color): void {
  B.rlb_DrawRectangleRoundedLines(rec.x, rec.y, rec.width, rec.height, roundness, segments, color.r, color.g, color.b, color.a)!;
}

export function DrawRectangleRoundedLinesEx(rec: Rectangle, roundness: number, segments: number, lineThick: number, color: Color): void {
  B.rlb_DrawRectangleRoundedLinesEx(rec.x, rec.y, rec.width, rec.height, roundness, segments, lineThick, color.r, color.g, color.b, color.a)!;
}

export function DrawTriangle(v1: Vector2, v2: Vector2, v3: Vector2, color: Color): void {
  B.rlb_DrawTriangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, color.r, color.g, color.b, color.a)!;
}

export function DrawTriangleLines(v1: Vector2, v2: Vector2, v3: Vector2, color: Color): void {
  B.rlb_DrawTriangleLines(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, color.r, color.g, color.b, color.a)!;
}

export function DrawPoly(center: Vector2, sides: number, radius: number, rotation: number, color: Color): void {
  B.rlb_DrawPoly(center.x, center.y, sides, radius, rotation, color.r, color.g, color.b, color.a)!;
}

export function DrawPolyLines(center: Vector2, sides: number, radius: number, rotation: number, color: Color): void {
  B.rlb_DrawPolyLines(center.x, center.y, sides, radius, rotation, color.r, color.g, color.b, color.a)!;
}

export function DrawPolyLinesEx(center: Vector2, sides: number, radius: number, rotation: number, lineThick: number, color: Color): void {
  B.rlb_DrawPolyLinesEx(center.x, center.y, sides, radius, rotation, lineThick, color.r, color.g, color.b, color.a)!;
}

// ===== Spline Drawing =====

export function DrawSplineSegmentLinear(p1: Vector2, p2: Vector2, thick: number, color: Color): void {
  B.rlb_DrawSplineSegmentLinear(p1.x, p1.y, p2.x, p2.y, thick, color.r, color.g, color.b, color.a)!;
}

export function DrawSplineSegmentBasis(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2, thick: number, color: Color): void {
  B.rlb_DrawSplineSegmentBasis(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, thick, color.r, color.g, color.b, color.a)!;
}

export function DrawSplineSegmentCatmullRom(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2, thick: number, color: Color): void {
  B.rlb_DrawSplineSegmentCatmullRom(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, thick, color.r, color.g, color.b, color.a)!;
}

export function DrawSplineSegmentBezierQuadratic(p1: Vector2, c2: Vector2, p3: Vector2, thick: number, color: Color): void {
  B.rlb_DrawSplineSegmentBezierQuadratic(p1.x, p1.y, c2.x, c2.y, p3.x, p3.y, thick, color.r, color.g, color.b, color.a)!;
}

export function DrawSplineSegmentBezierCubic(p1: Vector2, c2: Vector2, c3: Vector2, p4: Vector2, thick: number, color: Color): void {
  B.rlb_DrawSplineSegmentBezierCubic(p1.x, p1.y, c2.x, c2.y, c3.x, c3.y, p4.x, p4.y, thick, color.r, color.g, color.b, color.a)!;
}

// ===== Spline Point Evaluation =====

export function GetSplinePointLinear(startPos: Vector2, endPos: Vector2, t: number): Vector2 {
  return readVector2(B.rlb_GetSplinePointLinear(startPos.x, startPos.y, endPos.x, endPos.y, t)!);
}

export function GetSplinePointBasis(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2, t: number): Vector2 {
  return readVector2(B.rlb_GetSplinePointBasis(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, t)!);
}

export function GetSplinePointCatmullRom(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2, t: number): Vector2 {
  return readVector2(B.rlb_GetSplinePointCatmullRom(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, t)!);
}

export function GetSplinePointBezierQuad(p1: Vector2, c2: Vector2, p3: Vector2, t: number): Vector2 {
  return readVector2(B.rlb_GetSplinePointBezierQuad(p1.x, p1.y, c2.x, c2.y, p3.x, p3.y, t)!);
}

export function GetSplinePointBezierCubic(p1: Vector2, c2: Vector2, c3: Vector2, p4: Vector2, t: number): Vector2 {
  return readVector2(B.rlb_GetSplinePointBezierCubic(p1.x, p1.y, c2.x, c2.y, c3.x, c3.y, p4.x, p4.y, t)!);
}

// ===== Collision Detection 2D =====

export function CheckCollisionRecs(rec1: Rectangle, rec2: Rectangle): boolean {
  return B.rlb_CheckCollisionRecs(rec1.x, rec1.y, rec1.width, rec1.height, rec2.x, rec2.y, rec2.width, rec2.height)!;
}

export function CheckCollisionCircles(center1: Vector2, radius1: number, center2: Vector2, radius2: number): boolean {
  return B.rlb_CheckCollisionCircles(center1.x, center1.y, radius1, center2.x, center2.y, radius2)!;
}

export function CheckCollisionCircleRec(center: Vector2, radius: number, rec: Rectangle): boolean {
  return B.rlb_CheckCollisionCircleRec(center.x, center.y, radius, rec.x, rec.y, rec.width, rec.height)!;
}

export function CheckCollisionCircleLine(center: Vector2, radius: number, p1: Vector2, p2: Vector2): boolean {
  return B.rlb_CheckCollisionCircleLine(center.x, center.y, radius, p1.x, p1.y, p2.x, p2.y)!;
}

export function CheckCollisionPointRec(point: Vector2, rec: Rectangle): boolean {
  return B.rlb_CheckCollisionPointRec(point.x, point.y, rec.x, rec.y, rec.width, rec.height)!;
}

export function CheckCollisionPointCircle(point: Vector2, center: Vector2, radius: number): boolean {
  return B.rlb_CheckCollisionPointCircle(point.x, point.y, center.x, center.y, radius)!;
}

export function CheckCollisionPointTriangle(point: Vector2, v1: Vector2, v2: Vector2, v3: Vector2): boolean {
  return B.rlb_CheckCollisionPointTriangle(point.x, point.y, v1.x, v1.y, v2.x, v2.y, v3.x, v3.y)!;
}

export function CheckCollisionPointLine(point: Vector2, p1: Vector2, p2: Vector2, threshold: number): boolean {
  return B.rlb_CheckCollisionPointLine(point.x, point.y, p1.x, p1.y, p2.x, p2.y, threshold)!;
}

export function GetCollisionRec(rec1: Rectangle, rec2: Rectangle): Rectangle {
  return readRectangle(B.rlb_GetCollisionRec(rec1.x, rec1.y, rec1.width, rec1.height, rec2.x, rec2.y, rec2.width, rec2.height)!);
}

// ===== Text Drawing =====

export function DrawFPS(posX: number, posY: number): void {
  L.DrawFPS(posX, posY);
}

export function DrawText(text: string, posX: number, posY: number, fontSize: number, color: Color): void {
  B.rlb_DrawText(cstr(text), posX, posY, fontSize, color.r, color.g, color.b, color.a);
}

export function DrawTextEx(font: Font, text: string, position: Vector2, fontSize: number, spacing: number, tint: Color): void {
  B.rlb_DrawTextEx(
    font.baseSize, font.glyphCount, font.glyphPadding,
    font.texture.id, font.texture.width, font.texture.height, font.texture.mipmaps, font.texture.format,
    font.recs, font.glyphs,
    cstr(text), position.x, position.y, fontSize, spacing,
    tint.r, tint.g, tint.b, tint.a,
  );
}

export function DrawTextPro(font: Font, text: string, position: Vector2, origin: Vector2,
  rotation: number, fontSize: number, spacing: number, tint: Color): void {
  B.rlb_DrawTextPro(
    font.baseSize, font.glyphCount, font.glyphPadding,
    font.texture.id, font.texture.width, font.texture.height, font.texture.mipmaps, font.texture.format,
    font.recs, font.glyphs,
    cstr(text), position.x, position.y, origin.x, origin.y, rotation, fontSize, spacing,
    tint.r, tint.g, tint.b, tint.a,
  );
}

export function MeasureTextEx(font: Font, text: string, fontSize: number, spacing: number): Vector2 {
  const ptr: Pointer = B.rlb_MeasureTextEx(
    font.baseSize, font.glyphCount, font.glyphPadding,
    font.texture.id, font.texture.width, font.texture.height, font.texture.mipmaps, font.texture.format,
    font.recs, font.glyphs,
    cstr(text), fontSize, spacing,
  )!;
  return readVector2(ptr);
}

export function MeasureText(text: string, fontSize: number): number {
  return L.MeasureText(cstr(text), fontSize);
}

export function SetTextLineSpacing(spacing: number): void {
  L.SetTextLineSpacing(spacing);
}

// ===== Font =====

export function GetFontDefault(): Font {
  const ptr = B.rlb_GetFontDefault()!;
  return readFont(ptr);
}

export function LoadFont(fileName: string): Font {
  const ptr = B.rlb_LoadFont(cstr(fileName))!;
  return readFont(ptr);
}

export function UnloadFont(font: Font): void {
  L.UnloadFont(font.baseSize, font.glyphCount, font.glyphPadding,
    font.texture.id, font.texture.width, font.texture.height, font.texture.mipmaps, font.texture.format,
    font.recs, font.glyphs);
}

// ===== Image =====

export function LoadImage(fileName: string): Image {
  const ptr = B.rlb_LoadImage(cstr(fileName))!;
  return readImage(ptr);
}

export function LoadImageFromTexture(texture: Texture2D): Image {
  const ptr = B.rlb_LoadImageFromTexture(texture.id, texture.width, texture.height, texture.mipmaps, texture.format)!;
  return readImage(ptr);
}

export function LoadImageFromScreen(): Image {
  const ptr = B.rlb_LoadImageFromScreen()!;
  return readImage(ptr);
}

export function GenImageColor(width: number, height: number, color: Color): Image {
  const ptr = B.rlb_GenImageColor(width, height, color.r, color.g, color.b, color.a)!;
  return readImage(ptr);
}

export function ImageFromImage(image: Image, rec: Rectangle): Image {
  const ptr: Pointer = B.rlb_ImageFromImage(image.data, image.width, image.height, image.mipmaps, image.format,
    rec.x, rec.y, rec.width, rec.height)!;
  return readImage(ptr);
}

export function ImageText(text: string, fontSize: number, color: Color): Image {
  const ptr = B.rlb_ImageText(cstr(text), fontSize, color.r, color.g, color.b, color.a)!;
  return readImage(ptr);
}

export function IsImageValid(image: Image): boolean {
  return L.IsImageValid(image.data, image.width, image.height, image.mipmaps, image.format);
}

export function UnloadImage(image: Image): void {
  L.UnloadImage(image.data, image.width, image.height, image.mipmaps, image.format);
}

export function ExportImage(image: Image, fileName: string): boolean {
  return L.ExportImage(image.data, image.width, image.height, image.mipmaps, image.format, cstr(fileName));
}

// ===== Texture =====

export function LoadTexture(fileName: string): Texture2D {
  const ptr = B.rlb_LoadTexture(cstr(fileName))!;
  return readTexture2D(ptr);
}

export function LoadTextureFromImage(image: Image): Texture2D {
  const ptr = B.rlb_LoadTextureFromImage(image.data, image.width, image.height, image.mipmaps, image.format)!;
  return readTexture2D(ptr);
}

export function LoadRenderTexture(width: number, height: number): RenderTexture2D {
  const ptr = B.rlb_LoadRenderTexture(width, height)!;
  return readRenderTexture2D(ptr);
}

export function IsTextureValid(texture: Texture2D): boolean {
  return L.IsTextureValid(texture.id, texture.width, texture.height, texture.mipmaps, texture.format);
}

export function IsRenderTextureValid(target: RenderTexture2D): boolean {
  return L.IsRenderTextureValid(target.id,
    target.texture.id, target.texture.width, target.texture.height, target.texture.mipmaps, target.texture.format,
    target.depth.id, target.depth.width, target.depth.height, target.depth.mipmaps, target.depth.format);
}

export function UnloadTexture(texture: Texture2D): void {
  L.UnloadTexture(texture.id, texture.width, texture.height, texture.mipmaps, texture.format);
}

export function UnloadRenderTexture(target: RenderTexture2D): void {
  L.UnloadRenderTexture(target.id,
    target.texture.id, target.texture.width, target.texture.height, target.texture.mipmaps, target.texture.format,
    target.depth.id, target.depth.width, target.depth.height, target.depth.mipmaps, target.depth.format);
}

export function SetTextureFilter(texture: Texture2D, filter: number): void {
  L.SetTextureFilter(texture.id, texture.width, texture.height, texture.mipmaps, texture.format, filter);
}

export function SetTextureWrap(texture: Texture2D, wrap: number): void {
  L.SetTextureWrap(texture.id, texture.width, texture.height, texture.mipmaps, texture.format, wrap);
}

// ===== Texture Drawing =====

export function DrawTexture(texture: Texture2D, posX: number, posY: number, tint: Color): void {
  // DrawTexture takes Texture2D by value - need bridge
  B.rlb_DrawTextureV(texture.id, texture.width, texture.height, texture.mipmaps, texture.format,
    posX, posY, tint.r, tint.g, tint.b, tint.a);
}

export function DrawTextureV(texture: Texture2D, position: Vector2, tint: Color): void {
  B.rlb_DrawTextureV(texture.id, texture.width, texture.height, texture.mipmaps, texture.format,
    position.x, position.y, tint.r, tint.g, tint.b, tint.a);
}

export function DrawTextureEx(texture: Texture2D, position: Vector2, rotation: number, scale: number, tint: Color): void {
  B.rlb_DrawTextureEx(texture.id, texture.width, texture.height, texture.mipmaps, texture.format,
    position.x, position.y, rotation, scale, tint.r, tint.g, tint.b, tint.a);
}

export function DrawTextureRec(texture: Texture2D, source: Rectangle, position: Vector2, tint: Color): void {
  B.rlb_DrawTextureRec(texture.id, texture.width, texture.height, texture.mipmaps, texture.format,
    source.x, source.y, source.width, source.height,
    position.x, position.y, tint.r, tint.g, tint.b, tint.a);
}

export function DrawTexturePro(texture: Texture2D, source: Rectangle, dest: Rectangle,
  origin: Vector2, rotation: number, tint: Color): void {
  B.rlb_DrawTexturePro(texture.id, texture.width, texture.height, texture.mipmaps, texture.format,
    source.x, source.y, source.width, source.height,
    dest.x, dest.y, dest.width, dest.height,
    origin.x, origin.y, rotation, tint.r, tint.g, tint.b, tint.a);
}

export function DrawTextureNPatch(texture: Texture2D, nPatchInfo: {
  source: Rectangle; left: number; top: number; right: number; bottom: number; layout: number;
}, dest: Rectangle, origin: Vector2, rotation: number, tint: Color): void {
  B.rlb_DrawTextureNPatch(texture.id, texture.width, texture.height, texture.mipmaps, texture.format,
    nPatchInfo.source.x, nPatchInfo.source.y, nPatchInfo.source.width, nPatchInfo.source.height,
    nPatchInfo.left, nPatchInfo.top, nPatchInfo.right, nPatchInfo.bottom, nPatchInfo.layout,
    dest.x, dest.y, dest.width, dest.height,
    origin.x, origin.y, rotation, tint.r, tint.g, tint.b, tint.a);
}

// ===== Color Functions =====

export function Fade(color: Color, alpha: number): Color {
  const ptr = B.rlb_Fade(color.r, color.g, color.b, color.a, alpha)!;
  return readColor(ptr);
}

export function ColorToInt(color: Color): number {
  return B.rlb_ColorToInt(color.r, color.g, color.b, color.a)!;
}

export function ColorNormalize(color: Color): Vector4 {
  const ptr = B.rlb_ColorNormalize(color.r, color.g, color.b, color.a)!;
  return readVector4(ptr);
}

export function ColorFromNormalized(normalized: Vector4): Color {
  const ptr = B.rlb_ColorFromNormalized(normalized.x, normalized.y, normalized.z, normalized.w)!;
  return readColor(ptr);
}

export function ColorToHSV(color: Color): Vector3 {
  const ptr = B.rlb_ColorToHSV(color.r, color.g, color.b, color.a)!;
  return readVector3(ptr);
}

export function ColorFromHSV(hue: number, saturation: number, value: number): Color {
  const ptr = B.rlb_ColorFromHSV(hue, saturation, value)!;
  return readColor(ptr);
}

export function ColorTint(color: Color, tint: Color): Color {
  const ptr = B.rlb_ColorTint(color.r, color.g, color.b, color.a, tint.r, tint.g, tint.b, tint.a)!;
  return readColor(ptr);
}

export function ColorBrightness(color: Color, factor: number): Color {
  const ptr = B.rlb_ColorBrightness(color.r, color.g, color.b, color.a, factor)!;
  return readColor(ptr);
}

export function ColorContrast(color: Color, contrast: number): Color {
  const ptr = B.rlb_ColorContrast(color.r, color.g, color.b, color.a, contrast)!;
  return readColor(ptr);
}

export function ColorAlpha(color: Color, alpha: number): Color {
  const ptr = B.rlb_ColorAlpha(color.r, color.g, color.b, color.a, alpha)!;
  return readColor(ptr);
}

export function ColorAlphaBlend(dst: Color, src: Color, tint: Color): Color {
  const ptr = B.rlb_ColorAlphaBlend(dst.r, dst.g, dst.b, dst.a, src.r, src.g, src.b, src.a, tint.r, tint.g, tint.b, tint.a)!;
  return readColor(ptr);
}

export function ColorLerp(color1: Color, color2: Color, factor: number): Color {
  const ptr = B.rlb_ColorLerp(color1.r, color1.g, color1.b, color1.a, color2.r, color2.g, color2.b, color2.a, factor)!;
  return readColor(ptr);
}

export function ColorIsEqual(col1: Color, col2: Color): boolean {
  return B.rlb_ColorIsEqual(col1.r, col1.g, col1.b, col1.a, col2.r, col2.g, col2.b, col2.a)!;
}

export function GetColor(hexValue: number): Color {
  const ptr = B.rlb_GetColor(hexValue)!;
  return readColor(ptr);
}

// ===== 3D Drawing =====

export function DrawLine3D(startPos: Vector3, endPos: Vector3, color: Color): void {
  B.rlb_DrawLine3D(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, color.r, color.g, color.b, color.a)!;
}

export function DrawPoint3D(position: Vector3, color: Color): void {
  B.rlb_DrawPoint3D(position.x, position.y, position.z, color.r, color.g, color.b, color.a)!;
}

export function DrawCircle3D(center: Vector3, radius: number, rotationAxis: Vector3, rotationAngle: number, color: Color): void {
  B.rlb_DrawCircle3D(center.x, center.y, center.z, radius,
    rotationAxis.x, rotationAxis.y, rotationAxis.z, rotationAngle, color.r, color.g, color.b, color.a);
}

export function DrawTriangle3D(v1: Vector3, v2: Vector3, v3: Vector3, color: Color): void {
  B.rlb_DrawTriangle3D(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z, color.r, color.g, color.b, color.a)!;
}

export function DrawCube(position: Vector3, width: number, height: number, length: number, color: Color): void {
  B.rlb_DrawCube(position.x, position.y, position.z, width, height, length, color.r, color.g, color.b, color.a)!;
}

export function DrawCubeV(position: Vector3, size: Vector3, color: Color): void {
  B.rlb_DrawCubeV(position.x, position.y, position.z, size.x, size.y, size.z, color.r, color.g, color.b, color.a)!;
}

export function DrawCubeWires(position: Vector3, width: number, height: number, length: number, color: Color): void {
  B.rlb_DrawCubeWires(position.x, position.y, position.z, width, height, length, color.r, color.g, color.b, color.a)!;
}

export function DrawCubeWiresV(position: Vector3, size: Vector3, color: Color): void {
  B.rlb_DrawCubeWiresV(position.x, position.y, position.z, size.x, size.y, size.z, color.r, color.g, color.b, color.a)!;
}

export function DrawSphere(centerPos: Vector3, radius: number, color: Color): void {
  B.rlb_DrawSphere(centerPos.x, centerPos.y, centerPos.z, radius, color.r, color.g, color.b, color.a)!;
}

export function DrawSphereEx(centerPos: Vector3, radius: number, rings: number, slices: number, color: Color): void {
  B.rlb_DrawSphereEx(centerPos.x, centerPos.y, centerPos.z, radius, rings, slices, color.r, color.g, color.b, color.a)!;
}

export function DrawSphereWires(centerPos: Vector3, radius: number, rings: number, slices: number, color: Color): void {
  B.rlb_DrawSphereWires(centerPos.x, centerPos.y, centerPos.z, radius, rings, slices, color.r, color.g, color.b, color.a)!;
}

export function DrawCylinder(position: Vector3, radiusTop: number, radiusBottom: number, height: number, slices: number, color: Color): void {
  B.rlb_DrawCylinder(position.x, position.y, position.z, radiusTop, radiusBottom, height, slices, color.r, color.g, color.b, color.a)!;
}

export function DrawCylinderEx(startPos: Vector3, endPos: Vector3, startRadius: number, endRadius: number, sides: number, color: Color): void {
  B.rlb_DrawCylinderEx(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z,
    startRadius, endRadius, sides, color.r, color.g, color.b, color.a);
}

export function DrawCylinderWires(position: Vector3, radiusTop: number, radiusBottom: number, height: number, slices: number, color: Color): void {
  B.rlb_DrawCylinderWires(position.x, position.y, position.z, radiusTop, radiusBottom, height, slices, color.r, color.g, color.b, color.a)!;
}

export function DrawCylinderWiresEx(startPos: Vector3, endPos: Vector3, startRadius: number, endRadius: number, sides: number, color: Color): void {
  B.rlb_DrawCylinderWiresEx(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z,
    startRadius, endRadius, sides, color.r, color.g, color.b, color.a);
}

export function DrawCapsule(startPos: Vector3, endPos: Vector3, radius: number, slices: number, rings: number, color: Color): void {
  B.rlb_DrawCapsule(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, radius, slices, rings, color.r, color.g, color.b, color.a)!;
}

export function DrawCapsuleWires(startPos: Vector3, endPos: Vector3, radius: number, slices: number, rings: number, color: Color): void {
  B.rlb_DrawCapsuleWires(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, radius, slices, rings, color.r, color.g, color.b, color.a)!;
}

export function DrawPlane(centerPos: Vector3, size: Vector2, color: Color): void {
  B.rlb_DrawPlane(centerPos.x, centerPos.y, centerPos.z, size.x, size.y, color.r, color.g, color.b, color.a)!;
}

export function DrawRay(ray: Ray, color: Color): void {
  B.rlb_DrawRay(ray.position.x, ray.position.y, ray.position.z,
    ray.direction.x, ray.direction.y, ray.direction.z, color.r, color.g, color.b, color.a);
}

export function DrawGrid(slices: number, spacing: number): void {
  L.DrawGrid(slices, spacing);
}

// ===== Collision Detection 3D =====

export function CheckCollisionSpheres(center1: Vector3, radius1: number, center2: Vector3, radius2: number): boolean {
  return B.rlb_CheckCollisionSpheres(center1.x, center1.y, center1.z, radius1, center2.x, center2.y, center2.z, radius2)!;
}

export function CheckCollisionBoxes(box1: { min: Vector3; max: Vector3 }, box2: { min: Vector3; max: Vector3 }): boolean {
  return B.rlb_CheckCollisionBoxes(
    box1.min.x, box1.min.y, box1.min.z, box1.max.x, box1.max.y, box1.max.z,
    box2.min.x, box2.min.y, box2.min.z, box2.max.x, box2.max.y, box2.max.z);
}

export function CheckCollisionBoxSphere(box: { min: Vector3; max: Vector3 }, center: Vector3, radius: number): boolean {
  return B.rlb_CheckCollisionBoxSphere(box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z,
    center.x, center.y, center.z, radius);
}

export function GetRayCollisionSphere(ray: Ray, center: Vector3, radius: number): RayCollision {
  const ptr: Pointer = B.rlb_GetRayCollisionSphere(ray.position.x, ray.position.y, ray.position.z,
    ray.direction.x, ray.direction.y, ray.direction.z, center.x, center.y, center.z, radius)!;
  return readRayCollision(ptr);
}

export function GetRayCollisionBox(ray: Ray, box: { min: Vector3; max: Vector3 }): RayCollision {
  const ptr: Pointer = B.rlb_GetRayCollisionBox(ray.position.x, ray.position.y, ray.position.z,
    ray.direction.x, ray.direction.y, ray.direction.z,
    box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z)!;
  return readRayCollision(ptr);
}

export function GetRayCollisionTriangle(ray: Ray, p1: Vector3, p2: Vector3, p3: Vector3): RayCollision {
  const ptr: Pointer = B.rlb_GetRayCollisionTriangle(ray.position.x, ray.position.y, ray.position.z,
    ray.direction.x, ray.direction.y, ray.direction.z,
    p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z)!;
  return readRayCollision(ptr);
}

export function GetRayCollisionQuad(ray: Ray, p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3): RayCollision {
  const ptr: Pointer = B.rlb_GetRayCollisionQuad(ray.position.x, ray.position.y, ray.position.z,
    ray.direction.x, ray.direction.y, ray.direction.z,
    p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z)!;
  return readRayCollision(ptr);
}

// ===== Audio =====

export function InitAudioDevice(): void {
  L.InitAudioDevice();
}

export function CloseAudioDevice(): void {
  L.CloseAudioDevice();
}

export function IsAudioDeviceReady(): boolean {
  return L.IsAudioDeviceReady();
}

export function SetMasterVolume(volume: number): void {
  L.SetMasterVolume(volume);
}

export function GetMasterVolume(): number {
  return L.GetMasterVolume();
}

export function LoadWave(fileName: string): Wave {
  const ptr = B.rlb_LoadWave(cstr(fileName))!;
  return readWave(ptr);
}

export function LoadSound(fileName: string): Sound {
  const ptr = B.rlb_LoadSound(cstr(fileName))!;
  return readSound(ptr);
}

export function LoadSoundFromWave(wave: Wave): Sound {
  const ptr = B.rlb_LoadSoundFromWave(wave.frameCount, wave.sampleRate, wave.sampleSize, wave.channels, wave.data)!;
  return readSound(ptr);
}

export function LoadMusicStream(fileName: string): Music {
  const ptr = B.rlb_LoadMusicStream(cstr(fileName))!;
  return readMusic(ptr);
}

// ===== Shader =====

export function SetShaderValueMatrix(shader: { id: number; locs: number }, locIndex: number, mat: Matrix): void {
  B.rlb_SetShaderValueMatrix(shader.id, shader.locs, locIndex,
    mat.m0, mat.m4, mat.m8, mat.m12,
    mat.m1, mat.m5, mat.m9, mat.m13,
    mat.m2, mat.m6, mat.m10, mat.m14,
    mat.m3, mat.m7, mat.m11, mat.m15);
}

// ===== DrawBoundingBox =====

export function DrawBoundingBox(box: { min: Vector3; max: Vector3 }, color: Color): void {
  B.rlb_DrawBoundingBox(box.min.x, box.min.y, box.min.z, box.max.x, box.max.y, box.max.z,
    color.r, color.g, color.b, color.a);
}

// ===== DrawBillboard =====

export function DrawBillboard(camera: {
  position: Vector3; target: Vector3; up: Vector3; fovy: number; projection: number;
}, texture: Texture2D, position: Vector3, scale: number, tint: Color): void {
  B.rlb_DrawBillboard(
    camera.position.x, camera.position.y, camera.position.z,
    camera.target.x, camera.target.y, camera.target.z,
    camera.up.x, camera.up.y, camera.up.z,
    camera.fovy, camera.projection,
    texture.id, texture.width, texture.height, texture.mipmaps, texture.format,
    position.x, position.y, position.z, scale,
    tint.r, tint.g, tint.b, tint.a);
}
