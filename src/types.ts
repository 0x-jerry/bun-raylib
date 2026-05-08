export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export type Quaternion = Vector4;

export interface Matrix {
  m0: number; m4: number; m8: number; m12: number;
  m1: number; m5: number; m9: number; m13: number;
  m2: number; m6: number; m10: number; m14: number;
  m3: number; m7: number; m11: number; m15: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Image {
  data: number;
  width: number;
  height: number;
  mipmaps: number;
  format: number;
}

export interface Texture {
  id: number;
  width: number;
  height: number;
  mipmaps: number;
  format: number;
}

export type Texture2D = Texture;
export type TextureCubemap = Texture;

export interface RenderTexture {
  id: number;
  texture: Texture;
  depth: Texture;
}

export type RenderTexture2D = RenderTexture;

export interface NPatchInfo {
  source: Rectangle;
  left: number;
  top: number;
  right: number;
  bottom: number;
  layout: number;
}

export interface GlyphInfo {
  value: number;
  offsetX: number;
  offsetY: number;
  advanceX: number;
  image: Image;
}

export interface Font {
  baseSize: number;
  glyphCount: number;
  glyphPadding: number;
  texture: Texture2D;
  recs: number;
  glyphs: number;
}

export interface Camera3D {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fovy: number;
  projection: number;
}

export type Camera = Camera3D;

export interface Camera2D {
  offset: Vector2;
  target: Vector2;
  rotation: number;
  zoom: number;
}

export interface Mesh {
  vertexCount: number;
  triangleCount: number;
  vertices: number;
  texcoords: number;
  texcoords2: number;
  normals: number;
  tangents: number;
  colors: number;
  indices: number;
  boneCount: number;
  boneIndices: number;
  boneWeights: number;
  animVertices: number;
  animNormals: number;
  vaoId: number;
  vboId: number;
}

export interface Shader {
  id: number;
  locs: number;
}

export interface MaterialMap {
  texture: Texture2D;
  color: Color;
  value: number;
}

export interface Material {
  shader: Shader;
  maps: number;
  params: [number, number, number, number];
}

export interface Transform {
  translation: Vector3;
  rotation: Quaternion;
  scale: Vector3;
}

export interface BoneInfo {
  name: string;
  parent: number;
}

export interface Model {
  transform: Matrix;
  meshCount: number;
  materialCount: number;
  meshes: number;
  materials: number;
  meshMaterial: number;
  skeleton: number;
  currentPose: number;
  boneMatrices: number;
}

export interface ModelAnimation {
  name: string;
  boneCount: number;
  keyframeCount: number;
  keyframePoses: number;
}

export interface Ray {
  position: Vector3;
  direction: Vector3;
}

export interface RayCollision {
  hit: boolean;
  distance: number;
  point: Vector3;
  normal: Vector3;
}

export interface BoundingBox {
  min: Vector3;
  max: Vector3;
}

export interface Wave {
  frameCount: number;
  sampleRate: number;
  sampleSize: number;
  channels: number;
  data: number;
}

export interface AudioStream {
  buffer: number;
  processor: number;
  sampleRate: number;
  sampleSize: number;
  channels: number;
}

export interface Sound {
  stream: AudioStream;
  frameCount: number;
}

export interface Music {
  stream: AudioStream;
  frameCount: number;
  looping: boolean;
  ctxType: number;
  ctxData: number;
}

export interface VrDeviceInfo {
  hResolution: number;
  vResolution: number;
  hScreenSize: number;
  vScreenSize: number;
  eyeToScreenDistance: number;
  lensSeparationDistance: number;
  interpupillaryDistance: number;
  lensDistortionValues: [number, number, number, number];
  chromaAbCorrection: [number, number, number, number];
}

export interface VrStereoConfig {
  projection: [Matrix, Matrix];
  viewOffset: [Matrix, Matrix];
  leftLensCenter: [number, number];
  rightLensCenter: [number, number];
  leftScreenCenter: [number, number];
  rightScreenCenter: [number, number];
  scale: [number, number];
  scaleIn: [number, number];
}

export interface FilePathList {
  count: number;
  paths: number;
}

// ===== Enums =====

export enum ConfigFlags {
  FLAG_VSYNC_HINT          = 0x00000040,
  FLAG_FULLSCREEN_MODE     = 0x00000002,
  FLAG_WINDOW_RESIZABLE    = 0x00000004,
  FLAG_WINDOW_UNDECORATED  = 0x00000008,
  FLAG_WINDOW_HIDDEN       = 0x00000080,
  FLAG_WINDOW_MINIMIZED    = 0x00000200,
  FLAG_WINDOW_MAXIMIZED    = 0x00000400,
  FLAG_WINDOW_UNFOCUSED    = 0x00000800,
  FLAG_WINDOW_TOPMOST      = 0x00001000,
  FLAG_WINDOW_ALWAYS_RUN   = 0x00000100,
  FLAG_WINDOW_TRANSPARENT  = 0x00000010,
  FLAG_WINDOW_HIGHDPI      = 0x00002000,
  FLAG_WINDOW_MOUSE_PASSTHROUGH = 0x00004000,
  FLAG_BORDERLESS_WINDOWED_MODE = 0x00008000,
  FLAG_MSAA_4X_HINT        = 0x00000020,
  FLAG_INTERLACED_HINT     = 0x00010000,
}

export enum TraceLogLevel {
  LOG_ALL = 0,
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARNING,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NONE,
}

export enum KeyboardKey {
  KEY_NULL            = 0,
  KEY_APOSTROPHE      = 39,
  KEY_COMMA           = 44,
  KEY_MINUS           = 45,
  KEY_PERIOD          = 46,
  KEY_SLASH           = 47,
  KEY_ZERO            = 48,
  KEY_ONE             = 49,
  KEY_TWO             = 50,
  KEY_THREE           = 51,
  KEY_FOUR            = 52,
  KEY_FIVE            = 53,
  KEY_SIX             = 54,
  KEY_SEVEN           = 55,
  KEY_EIGHT           = 56,
  KEY_NINE            = 57,
  KEY_SEMICOLON       = 59,
  KEY_EQUAL           = 61,
  KEY_A               = 65,
  KEY_B               = 66,
  KEY_C               = 67,
  KEY_D               = 68,
  KEY_E               = 69,
  KEY_F               = 70,
  KEY_G               = 71,
  KEY_H               = 72,
  KEY_I               = 73,
  KEY_J               = 74,
  KEY_K               = 75,
  KEY_L               = 76,
  KEY_M               = 77,
  KEY_N               = 78,
  KEY_O               = 79,
  KEY_P               = 80,
  KEY_Q               = 81,
  KEY_R               = 82,
  KEY_S               = 83,
  KEY_T               = 84,
  KEY_U               = 85,
  KEY_V               = 86,
  KEY_W               = 87,
  KEY_X               = 88,
  KEY_Y               = 89,
  KEY_Z               = 90,
  KEY_LEFT_BRACKET    = 91,
  KEY_BACKSLASH       = 92,
  KEY_RIGHT_BRACKET   = 93,
  KEY_GRAVE           = 96,
  KEY_SPACE           = 32,
  KEY_ESCAPE          = 256,
  KEY_ENTER           = 257,
  KEY_TAB             = 258,
  KEY_BACKSPACE       = 259,
  KEY_INSERT          = 260,
  KEY_DELETE          = 261,
  KEY_RIGHT           = 262,
  KEY_LEFT            = 263,
  KEY_DOWN            = 264,
  KEY_UP              = 265,
  KEY_PAGE_UP         = 266,
  KEY_PAGE_DOWN       = 267,
  KEY_HOME            = 268,
  KEY_END             = 269,
  KEY_CAPS_LOCK       = 280,
  KEY_SCROLL_LOCK     = 281,
  KEY_NUM_LOCK        = 282,
  KEY_PRINT_SCREEN    = 283,
  KEY_PAUSE           = 284,
  KEY_F1              = 290,
  KEY_F2              = 291,
  KEY_F3              = 292,
  KEY_F4              = 293,
  KEY_F5              = 294,
  KEY_F6              = 295,
  KEY_F7              = 296,
  KEY_F8              = 297,
  KEY_F9              = 298,
  KEY_F10             = 299,
  KEY_F11             = 300,
  KEY_F12             = 301,
  KEY_LEFT_SHIFT      = 340,
  KEY_LEFT_CONTROL    = 341,
  KEY_LEFT_ALT        = 342,
  KEY_LEFT_SUPER      = 343,
  KEY_RIGHT_SHIFT     = 344,
  KEY_RIGHT_CONTROL   = 345,
  KEY_RIGHT_ALT       = 346,
  KEY_RIGHT_SUPER     = 347,
  KEY_KB_MENU         = 348,
  KEY_KP_0            = 320,
  KEY_KP_1            = 321,
  KEY_KP_2            = 322,
  KEY_KP_3            = 323,
  KEY_KP_4            = 324,
  KEY_KP_5            = 325,
  KEY_KP_6            = 326,
  KEY_KP_7            = 327,
  KEY_KP_8            = 328,
  KEY_KP_9            = 329,
  KEY_KP_DECIMAL      = 330,
  KEY_KP_DIVIDE       = 331,
  KEY_KP_MULTIPLY     = 332,
  KEY_KP_SUBTRACT     = 333,
  KEY_KP_ADD          = 334,
  KEY_KP_ENTER        = 335,
  KEY_KP_EQUAL        = 336,
}

export enum MouseButton {
  MOUSE_BUTTON_LEFT    = 0,
  MOUSE_BUTTON_RIGHT   = 1,
  MOUSE_BUTTON_MIDDLE  = 2,
  MOUSE_BUTTON_SIDE    = 3,
  MOUSE_BUTTON_EXTRA   = 4,
  MOUSE_BUTTON_FORWARD = 5,
  MOUSE_BUTTON_BACK    = 6,
}

export enum MouseCursor {
  MOUSE_CURSOR_DEFAULT       = 0,
  MOUSE_CURSOR_ARROW         = 1,
  MOUSE_CURSOR_IBEAM         = 2,
  MOUSE_CURSOR_CROSSHAIR     = 3,
  MOUSE_CURSOR_POINTING_HAND = 4,
  MOUSE_CURSOR_RESIZE_EW     = 5,
  MOUSE_CURSOR_RESIZE_NS     = 6,
  MOUSE_CURSOR_RESIZE_NWSE   = 7,
  MOUSE_CURSOR_RESIZE_NESW   = 8,
  MOUSE_CURSOR_RESIZE_ALL    = 9,
  MOUSE_CURSOR_NOT_ALLOWED   = 10,
}

export enum GamepadButton {
  GAMEPAD_BUTTON_UNKNOWN = 0,
  GAMEPAD_BUTTON_LEFT_FACE_UP,
  GAMEPAD_BUTTON_LEFT_FACE_RIGHT,
  GAMEPAD_BUTTON_LEFT_FACE_DOWN,
  GAMEPAD_BUTTON_LEFT_FACE_LEFT,
  GAMEPAD_BUTTON_RIGHT_FACE_UP,
  GAMEPAD_BUTTON_RIGHT_FACE_RIGHT,
  GAMEPAD_BUTTON_RIGHT_FACE_DOWN,
  GAMEPAD_BUTTON_RIGHT_FACE_LEFT,
  GAMEPAD_BUTTON_LEFT_TRIGGER_1,
  GAMEPAD_BUTTON_LEFT_TRIGGER_2,
  GAMEPAD_BUTTON_RIGHT_TRIGGER_1,
  GAMEPAD_BUTTON_RIGHT_TRIGGER_2,
  GAMEPAD_BUTTON_MIDDLE_LEFT,
  GAMEPAD_BUTTON_MIDDLE,
  GAMEPAD_BUTTON_MIDDLE_RIGHT,
  GAMEPAD_BUTTON_LEFT_THUMB,
  GAMEPAD_BUTTON_RIGHT_THUMB,
}

export enum GamepadAxis {
  GAMEPAD_AXIS_LEFT_X = 0,
  GAMEPAD_AXIS_LEFT_Y = 1,
  GAMEPAD_AXIS_RIGHT_X = 2,
  GAMEPAD_AXIS_RIGHT_Y = 3,
  GAMEPAD_AXIS_LEFT_TRIGGER = 4,
  GAMEPAD_AXIS_RIGHT_TRIGGER = 5,
}

export enum BlendMode {
  BLEND_ALPHA = 0,
  BLEND_ADDITIVE,
  BLEND_MULTIPLIED,
  BLEND_ADD_COLORS,
  BLEND_SUBTRACT_COLORS,
  BLEND_ALPHA_PREMULTIPLY,
  BLEND_CUSTOM,
  BLEND_CUSTOM_SEPARATE,
}

export enum CameraMode {
  CAMERA_CUSTOM = 0,
  CAMERA_FREE,
  CAMERA_ORBITAL,
  CAMERA_FIRST_PERSON,
  CAMERA_THIRD_PERSON,
}

export enum CameraProjection {
  CAMERA_PERSPECTIVE = 0,
  CAMERA_ORTHOGRAPHIC,
}

export enum TextureFilter {
  TEXTURE_FILTER_POINT = 0,
  TEXTURE_FILTER_BILINEAR,
  TEXTURE_FILTER_TRILINEAR,
  TEXTURE_FILTER_ANISOTROPIC_4X,
  TEXTURE_FILTER_ANISOTROPIC_8X,
  TEXTURE_FILTER_ANISOTROPIC_16X,
}

export enum TextureWrap {
  TEXTURE_WRAP_REPEAT = 0,
  TEXTURE_WRAP_CLAMP,
  TEXTURE_WRAP_MIRROR_REPEAT,
  TEXTURE_WRAP_MIRROR_CLAMP,
}

export enum PixelFormat {
  PIXELFORMAT_UNCOMPRESSED_GRAYSCALE = 1,
  PIXELFORMAT_UNCOMPRESSED_GRAY_ALPHA,
  PIXELFORMAT_UNCOMPRESSED_R5G6B5,
  PIXELFORMAT_UNCOMPRESSED_R8G8B8,
  PIXELFORMAT_UNCOMPRESSED_R5G5B5A1,
  PIXELFORMAT_UNCOMPRESSED_R4G4B4A4,
  PIXELFORMAT_UNCOMPRESSED_R8G8B8A8,
  PIXELFORMAT_UNCOMPRESSED_R32,
  PIXELFORMAT_UNCOMPRESSED_R32G32B32,
  PIXELFORMAT_UNCOMPRESSED_R32G32B32A32,
  PIXELFORMAT_UNCOMPRESSED_R16,
  PIXELFORMAT_UNCOMPRESSED_R16G16B16,
  PIXELFORMAT_UNCOMPRESSED_R16G16B16A16,
  PIXELFORMAT_COMPRESSED_DXT1_RGB,
  PIXELFORMAT_COMPRESSED_DXT1_RGBA,
  PIXELFORMAT_COMPRESSED_DXT3_RGBA,
  PIXELFORMAT_COMPRESSED_DXT5_RGBA,
  PIXELFORMAT_COMPRESSED_ETC1_RGB,
  PIXELFORMAT_COMPRESSED_ETC2_RGB,
  PIXELFORMAT_COMPRESSED_ETC2_EAC_RGBA,
  PIXELFORMAT_COMPRESSED_PVRT_RGB,
  PIXELFORMAT_COMPRESSED_PVRT_RGBA,
  PIXELFORMAT_COMPRESSED_ASTC_4x4_RGBA,
  PIXELFORMAT_COMPRESSED_ASTC_8x8_RGBA,
}

// ===== Color Constants =====

export function Color(r: number, g: number, b: number, a: number): Color {
  return { r, g, b, a };
}

export const LIGHTGRAY: Color  = { r: 200, g: 200, b: 200, a: 255 };
export const GRAY: Color       = { r: 130, g: 130, b: 130, a: 255 };
export const DARKGRAY: Color   = { r: 80, g: 80, b: 80, a: 255 };
export const YELLOW: Color     = { r: 253, g: 249, b: 0, a: 255 };
export const GOLD: Color       = { r: 255, g: 203, b: 0, a: 255 };
export const ORANGE: Color     = { r: 255, g: 161, b: 0, a: 255 };
export const PINK: Color       = { r: 255, g: 109, b: 194, a: 255 };
export const RED: Color        = { r: 230, g: 41, b: 55, a: 255 };
export const MAROON: Color     = { r: 190, g: 33, b: 55, a: 255 };
export const GREEN: Color      = { r: 0, g: 228, b: 48, a: 255 };
export const LIME: Color       = { r: 0, g: 158, b: 47, a: 255 };
export const DARKGREEN: Color  = { r: 0, g: 117, b: 44, a: 255 };
export const SKYBLUE: Color    = { r: 102, g: 191, b: 255, a: 255 };
export const BLUE: Color       = { r: 0, g: 121, b: 241, a: 255 };
export const DARKBLUE: Color   = { r: 0, g: 82, b: 172, a: 255 };
export const PURPLE: Color     = { r: 200, g: 122, b: 255, a: 255 };
export const VIOLET: Color     = { r: 135, g: 60, b: 190, a: 255 };
export const DARKPURPLE: Color = { r: 112, g: 31, b: 126, a: 255 };
export const BEIGE: Color      = { r: 211, g: 176, b: 131, a: 255 };
export const BROWN: Color      = { r: 127, g: 106, b: 79, a: 255 };
export const DARKBROWN: Color  = { r: 76, g: 63, b: 47, a: 255 };
export const WHITE: Color      = { r: 255, g: 255, b: 255, a: 255 };
export const BLACK: Color      = { r: 0, g: 0, b: 0, a: 255 };
export const BLANK: Color      = { r: 0, g: 0, b: 0, a: 0 };
export const MAGENTA: Color    = { r: 255, g: 0, b: 255, a: 255 };
export const RAYWHITE: Color   = { r: 245, g: 245, b: 245, a: 255 };
