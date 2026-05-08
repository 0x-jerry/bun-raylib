#include "raylib.h"
#include <string.h>

// ===== Helpers: static buffers for struct returns =====
// These are NOT thread-safe, but fine for single-threaded raylib usage

static Vector2 __rlb_v2;
static Vector3 __rlb_v3;
static Vector4 __rlb_v4;
static Rectangle __rlb_rec;
static Color __rlb_color;
static Matrix __rlb_mat;
static Ray __rlb_ray;
static RayCollision __rlb_raycol;
static BoundingBox __rlb_bbox;
static Image __rlb_img;
static Texture2D __rlb_tex;
static RenderTexture2D __rlb_rtex;
static Font __rlb_font;
static GlyphInfo __rlb_glyph;
static Mesh __rlb_mesh;
static Shader __rlb_shader;
static Material __rlb_material;
static Model __rlb_model;
static Wave __rlb_wave;
static Sound __rlb_sound;
static Music __rlb_music;
static Camera3D __rlb_cam3d;
static Camera2D __rlb_cam2d;
static NPatchInfo __rlb_npatch;
static VrStereoConfig __rlb_vrconfig;
static FilePathList __rlb_fpl;

// ===== Window-related functions (struct args: Color, Image, Camera2D, Camera3D) =====

void rlb_ClearBackground(unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    ClearBackground((Color){ r, g, b, a });
}

void rlb_BeginMode2D(float offsetX, float offsetY, float targetX, float targetY, float rotation, float zoom) {
    BeginMode2D((Camera2D){ { offsetX, offsetY }, { targetX, targetY }, rotation, zoom });
}

void rlb_BeginMode3D(float posX, float posY, float posZ,
                     float targetX, float targetY, float targetZ,
                     float upX, float upY, float upZ,
                     float fovy, int projection) {
    BeginMode3D((Camera3D){ { posX, posY, posZ }, { targetX, targetY, targetZ }, { upX, upY, upZ }, fovy, projection });
}

void rlb_BeginTextureMode(unsigned int id, unsigned int texId, int texWidth, int texHeight,
                           int texMipmaps, int texFmt,
                           unsigned int depthId, int depthWidth, int depthHeight,
                           int depthMipmaps, int depthFmt) {
    RenderTexture2D target;
    target.id = id;
    target.texture.id = texId;
    target.texture.width = texWidth;
    target.texture.height = texHeight;
    target.texture.mipmaps = texMipmaps;
    target.texture.format = texFmt;
    target.depth.id = depthId;
    target.depth.width = depthWidth;
    target.depth.height = depthHeight;
    target.depth.mipmaps = depthMipmaps;
    target.depth.format = depthFmt;
    BeginTextureMode(target);
}

void rlb_BeginShaderMode(unsigned int id, int* locs) {
    BeginShaderMode((Shader){ id, locs });
}

void rlb_BeginScissorMode(int x, int y, int width, int height) {
    BeginScissorMode(x, y, width, height);
}

// ===== Monitor functions returning Vector2 =====

Vector2* rlb_GetMonitorPosition(int monitor) {
    __rlb_v2 = GetMonitorPosition(monitor);
    return &__rlb_v2;
}

Vector2* rlb_GetWindowPosition(void) {
    __rlb_v2 = GetWindowPosition();
    return &__rlb_v2;
}

Vector2* rlb_GetWindowScaleDPI(void) {
    __rlb_v2 = GetWindowScaleDPI();
    return &__rlb_v2;
}

// ===== Drawing-related functions =====

void rlb_ClearBackground_rgba(unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    ClearBackground((Color){ r, g, b, a });
}

// ===== Shader management =====

int rlb_IsShaderValid(unsigned int id, int* locs) {
    return IsShaderValid((Shader){ id, locs });
}

void rlb_SetShaderValueMatrix(unsigned int shaderId, int* shaderLocs, int locIndex,
                              float m0, float m4, float m8, float m12,
                              float m1, float m5, float m9, float m13,
                              float m2, float m6, float m10, float m14,
                              float m3, float m7, float m11, float m15) {
    Matrix mat = { m0, m4, m8, m12, m1, m5, m9, m13, m2, m6, m10, m14, m3, m7, m11, m15 };
    Shader shader = { shaderId, shaderLocs };
    SetShaderValueMatrix(shader, locIndex, mat);
}

// ===== Screen-space functions =====

Ray* rlb_GetScreenToWorldRay(float screenX, float screenY,
                              float camPosX, float camPosY, float camPosZ,
                              float camTargetX, float camTargetY, float camTargetZ,
                              float camUpX, float camUpY, float camUpZ,
                              float camFovy, int camProjection) {
    Camera cam = { { camPosX, camPosY, camPosZ }, { camTargetX, camTargetY, camTargetZ },
                   { camUpX, camUpY, camUpZ }, camFovy, camProjection };
    __rlb_ray = GetScreenToWorldRay((Vector2){ screenX, screenY }, cam);
    return &__rlb_ray;
}

Vector2* rlb_GetWorldToScreen(float worldX, float worldY, float worldZ,
                               float camPosX, float camPosY, float camPosZ,
                               float camTargetX, float camTargetY, float camTargetZ,
                               float camUpX, float camUpY, float camUpZ,
                               float camFovy, int camProjection) {
    Camera cam = { { camPosX, camPosY, camPosZ }, { camTargetX, camTargetY, camTargetZ },
                   { camUpX, camUpY, camUpZ }, camFovy, camProjection };
    __rlb_v2 = GetWorldToScreen((Vector3){ worldX, worldY, worldZ }, cam);
    return &__rlb_v2;
}

Vector2* rlb_GetWorldToScreen2D(float worldX, float worldY,
                                 float camOffsetX, float camOffsetY,
                                 float camTargetX, float camTargetY,
                                 float camRotation, float camZoom) {
    Camera2D cam = { { camOffsetX, camOffsetY }, { camTargetX, camTargetY }, camRotation, camZoom };
    __rlb_v2 = GetWorldToScreen2D((Vector2){ worldX, worldY }, cam);
    return &__rlb_v2;
}

Vector2* rlb_GetScreenToWorld2D(float screenX, float screenY,
                                 float camOffsetX, float camOffsetY,
                                 float camTargetX, float camTargetY,
                                 float camRotation, float camZoom) {
    Camera2D cam = { { camOffsetX, camOffsetY }, { camTargetX, camTargetY }, camRotation, camZoom };
    __rlb_v2 = GetScreenToWorld2D((Vector2){ screenX, screenY }, cam);
    return &__rlb_v2;
}

Matrix* rlb_GetCameraMatrix(float camPosX, float camPosY, float camPosZ,
                             float camTargetX, float camTargetY, float camTargetZ,
                             float camUpX, float camUpY, float camUpZ,
                             float camFovy, int camProjection) {
    Camera cam = { { camPosX, camPosY, camPosZ }, { camTargetX, camTargetY, camTargetZ },
                   { camUpX, camUpY, camUpZ }, camFovy, camProjection };
    __rlb_mat = GetCameraMatrix(cam);
    return &__rlb_mat;
}

Matrix* rlb_GetCameraMatrix2D(float offsetX, float offsetY,
                               float targetX, float targetY,
                               float rotation, float zoom) {
    Camera2D cam = { { offsetX, offsetY }, { targetX, targetY }, rotation, zoom };
    __rlb_mat = GetCameraMatrix2D(cam);
    return &__rlb_mat;
}

// ===== Input functions returning Vector2 =====

Vector2* rlb_GetMousePosition(void) {
    __rlb_v2 = GetMousePosition();
    return &__rlb_v2;
}

Vector2* rlb_GetMouseDelta(void) {
    __rlb_v2 = GetMouseDelta();
    return &__rlb_v2;
}

Vector2* rlb_GetMouseWheelMoveV(void) {
    __rlb_v2 = GetMouseWheelMoveV();
    return &__rlb_v2;
}

Vector2* rlb_GetTouchPosition(int index) {
    __rlb_v2 = GetTouchPosition(index);
    return &__rlb_v2;
}

// ===== Gesture functions =====

Vector2* rlb_GetGestureDragVector(void) {
    __rlb_v2 = GetGestureDragVector();
    return &__rlb_v2;
}

Vector2* rlb_GetGesturePinchVector(void) {
    __rlb_v2 = GetGesturePinchVector();
    return &__rlb_v2;
}

// ===== Camera System =====

void rlb_UpdateCamera(float* posX, float* posY, float* posZ,
                      float* targetX, float* targetY, float* targetZ,
                      float* upX, float* upY, float* upZ,
                      float* fovy, int* projection, int mode) {
    Camera cam = { { *posX, *posY, *posZ }, { *targetX, *targetY, *targetZ },
                   { *upX, *upY, *upZ }, *fovy, *projection };
    UpdateCamera(&cam, mode);
    *posX = cam.position.x; *posY = cam.position.y; *posZ = cam.position.z;
    *targetX = cam.target.x; *targetY = cam.target.y; *targetZ = cam.target.z;
    *upX = cam.up.x; *upY = cam.up.y; *upZ = cam.up.z;
    *fovy = cam.fovy;
    *projection = cam.projection;
}

// ===== Shapes Drawing Functions =====

// --- SetShapesTexture ---
void rlb_SetShapesTexture(unsigned int texId, int texWidth, int texHeight, int texMipmaps, int texFmt,
                           float recX, float recY, float recWidth, float recHeight) {
    Texture2D tex = { texId, texWidth, texHeight, texMipmaps, texFmt };
    Rectangle rec = { recX, recY, recWidth, recHeight };
    SetShapesTexture(tex, rec);
}

Texture2D* rlb_GetShapesTexture(void) {
    __rlb_tex = GetShapesTexture();
    return &__rlb_tex;
}

Rectangle* rlb_GetShapesTextureRectangle(void) {
    __rlb_rec = GetShapesTextureRectangle();
    return &__rlb_rec;
}

// --- DrawPixelV ---
void rlb_DrawPixelV(float posX, float posY, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawPixelV((Vector2){ posX, posY }, (Color){ r, g, b, a });
}

// --- DrawLineV ---
void rlb_DrawLineV(float startX, float startY, float endX, float endY,
                   unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawLineV((Vector2){ startX, startY }, (Vector2){ endX, endY }, (Color){ r, g, b, a });
}

// --- DrawLineEx ---
void rlb_DrawLineEx(float startX, float startY, float endX, float endY, float thick,
                    unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawLineEx((Vector2){ startX, startY }, (Vector2){ endX, endY }, thick, (Color){ r, g, b, a });
}

// --- DrawLineBezier ---
void rlb_DrawLineBezier(float startX, float startY, float endX, float endY, float thick,
                        unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawLineBezier((Vector2){ startX, startY }, (Vector2){ endX, endY }, thick, (Color){ r, g, b, a });
}

// --- DrawLineDashed ---
void rlb_DrawLineDashed(float startX, float startY, float endX, float endY, int dashSize, int spaceSize,
                        unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawLineDashed((Vector2){ startX, startY }, (Vector2){ endX, endY }, dashSize, spaceSize, (Color){ r, g, b, a });
}

// --- DrawCircleV ---
void rlb_DrawCircleV(float centerX, float centerY, float radius,
                     unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCircleV((Vector2){ centerX, centerY }, radius, (Color){ r, g, b, a });
}

// --- DrawCircleGradient ---
void rlb_DrawCircleGradient(float centerX, float centerY, float radius,
                            unsigned char ir, unsigned char ig, unsigned char ib, unsigned char ia,
                            unsigned char or, unsigned char og, unsigned char ob, unsigned char oa) {
    DrawCircleGradient((Vector2){ centerX, centerY }, radius,
                       (Color){ ir, ig, ib, ia }, (Color){ or, og, ob, oa });
}

// --- DrawCircleSector ---
void rlb_DrawCircleSector(float centerX, float centerY, float radius,
                          float startAngle, float endAngle, int segments,
                          unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCircleSector((Vector2){ centerX, centerY }, radius, startAngle, endAngle, segments, (Color){ r, g, b, a });
}

// --- DrawCircleSectorLines ---
void rlb_DrawCircleSectorLines(float centerX, float centerY, float radius,
                               float startAngle, float endAngle, int segments,
                               unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCircleSectorLines((Vector2){ centerX, centerY }, radius, startAngle, endAngle, segments, (Color){ r, g, b, a });
}

// --- DrawCircleLinesV ---
void rlb_DrawCircleLinesV(float centerX, float centerY, float radius,
                          unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCircleLinesV((Vector2){ centerX, centerY }, radius, (Color){ r, g, b, a });
}

// --- DrawEllipseV ---
void rlb_DrawEllipseV(float centerX, float centerY, float radiusH, float radiusV,
                      unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawEllipseV((Vector2){ centerX, centerY }, radiusH, radiusV, (Color){ r, g, b, a });
}

// --- DrawEllipseLinesV ---
void rlb_DrawEllipseLinesV(float centerX, float centerY, float radiusH, float radiusV,
                           unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawEllipseLinesV((Vector2){ centerX, centerY }, radiusH, radiusV, (Color){ r, g, b, a });
}

// --- DrawRing ---
void rlb_DrawRing(float centerX, float centerY, float innerRadius, float outerRadius,
                  float startAngle, float endAngle, int segments,
                  unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRing((Vector2){ centerX, centerY }, innerRadius, outerRadius, startAngle, endAngle, segments, (Color){ r, g, b, a });
}

// --- DrawRingLines ---
void rlb_DrawRingLines(float centerX, float centerY, float innerRadius, float outerRadius,
                       float startAngle, float endAngle, int segments,
                       unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRingLines((Vector2){ centerX, centerY }, innerRadius, outerRadius, startAngle, endAngle, segments, (Color){ r, g, b, a });
}

// --- DrawRectangleV ---
void rlb_DrawRectangleV(float posX, float posY, float width, float height,
                        unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectangleV((Vector2){ posX, posY }, (Vector2){ width, height }, (Color){ r, g, b, a });
}

// --- DrawRectangleRec ---
void rlb_DrawRectangleRec(float x, float y, float width, float height,
                          unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectangleRec((Rectangle){ x, y, width, height }, (Color){ r, g, b, a });
}

// --- DrawRectanglePro ---
void rlb_DrawRectanglePro(float x, float y, float width, float height,
                          float originX, float originY, float rotation,
                          unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectanglePro((Rectangle){ x, y, width, height }, (Vector2){ originX, originY }, rotation, (Color){ r, g, b, a });
}

// --- DrawRectangleGradientEx ---
void rlb_DrawRectangleGradientEx(float x, float y, float width, float height,
                                 unsigned char tlR, unsigned char tlG, unsigned char tlB, unsigned char tlA,
                                 unsigned char blR, unsigned char blG, unsigned char blB, unsigned char blA,
                                 unsigned char brR, unsigned char brG, unsigned char brB, unsigned char brA,
                                 unsigned char trR, unsigned char trG, unsigned char trB, unsigned char trA) {
    DrawRectangleGradientEx((Rectangle){ x, y, width, height },
                            (Color){ tlR, tlG, tlB, tlA },
                            (Color){ blR, blG, blB, blA },
                            (Color){ brR, brG, brB, brA },
                            (Color){ trR, trG, trB, trA });
}

// --- DrawRectangleLinesEx ---
void rlb_DrawRectangleLinesEx(float x, float y, float width, float height, float lineThick,
                              unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectangleLinesEx((Rectangle){ x, y, width, height }, lineThick, (Color){ r, g, b, a });
}

// --- DrawRectangleRounded ---
void rlb_DrawRectangleRounded(float x, float y, float width, float height, float roundness, int segments,
                              unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectangleRounded((Rectangle){ x, y, width, height }, roundness, segments, (Color){ r, g, b, a });
}

// --- DrawRectangleRoundedLines ---
void rlb_DrawRectangleRoundedLines(float x, float y, float width, float height, float roundness, int segments,
                                   unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectangleRoundedLines((Rectangle){ x, y, width, height }, roundness, segments, (Color){ r, g, b, a });
}

// --- DrawRectangleRoundedLinesEx ---
void rlb_DrawRectangleRoundedLinesEx(float x, float y, float width, float height, float roundness,
                                     int segments, float lineThick,
                                     unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectangleRoundedLinesEx((Rectangle){ x, y, width, height }, roundness, segments, lineThick, (Color){ r, g, b, a });
}

// --- DrawTriangle ---
void rlb_DrawTriangle(float v1x, float v1y, float v2x, float v2y, float v3x, float v3y,
                      unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawTriangle((Vector2){ v1x, v1y }, (Vector2){ v2x, v2y }, (Vector2){ v3x, v3y }, (Color){ r, g, b, a });
}

// --- DrawTriangleLines ---
void rlb_DrawTriangleLines(float v1x, float v1y, float v2x, float v2y, float v3x, float v3y,
                           unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawTriangleLines((Vector2){ v1x, v1y }, (Vector2){ v2x, v2y }, (Vector2){ v3x, v3y }, (Color){ r, g, b, a });
}

// --- DrawPoly ---
void rlb_DrawPoly(float centerX, float centerY, int sides, float radius, float rotation,
                  unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawPoly((Vector2){ centerX, centerY }, sides, radius, rotation, (Color){ r, g, b, a });
}

// --- DrawPolyLines ---
void rlb_DrawPolyLines(float centerX, float centerY, int sides, float radius, float rotation,
                       unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawPolyLines((Vector2){ centerX, centerY }, sides, radius, rotation, (Color){ r, g, b, a });
}

// --- DrawPolyLinesEx ---
void rlb_DrawPolyLinesEx(float centerX, float centerY, int sides, float radius, float rotation,
                         float lineThick, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawPolyLinesEx((Vector2){ centerX, centerY }, sides, radius, rotation, lineThick, (Color){ r, g, b, a });
}

// --- Spline functions ---
void rlb_DrawSplineSegmentLinear(float p1x, float p1y, float p2x, float p2y, float thick,
                                  unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawSplineSegmentLinear((Vector2){ p1x, p1y }, (Vector2){ p2x, p2y }, thick, (Color){ r, g, b, a });
}

void rlb_DrawSplineSegmentBasis(float p1x, float p1y, float p2x, float p2y,
                                float p3x, float p3y, float p4x, float p4y, float thick,
                                unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawSplineSegmentBasis((Vector2){ p1x, p1y }, (Vector2){ p2x, p2y },
                           (Vector2){ p3x, p3y }, (Vector2){ p4x, p4y }, thick, (Color){ r, g, b, a });
}

void rlb_DrawSplineSegmentCatmullRom(float p1x, float p1y, float p2x, float p2y,
                                     float p3x, float p3y, float p4x, float p4y, float thick,
                                     unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawSplineSegmentCatmullRom((Vector2){ p1x, p1y }, (Vector2){ p2x, p2y },
                                (Vector2){ p3x, p3y }, (Vector2){ p4x, p4y }, thick, (Color){ r, g, b, a });
}

void rlb_DrawSplineSegmentBezierQuadratic(float p1x, float p1y, float c2x, float c2y, float p3x, float p3y,
                                          float thick, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawSplineSegmentBezierQuadratic((Vector2){ p1x, p1y }, (Vector2){ c2x, c2y }, (Vector2){ p3x, p3y }, thick, (Color){ r, g, b, a });
}

void rlb_DrawSplineSegmentBezierCubic(float p1x, float p1y, float c2x, float c2y,
                                      float c3x, float c3y, float p4x, float p4y, float thick,
                                      unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawSplineSegmentBezierCubic((Vector2){ p1x, p1y }, (Vector2){ c2x, c2y },
                                 (Vector2){ c3x, c3y }, (Vector2){ p4x, p4y }, thick, (Color){ r, g, b, a });
}

// --- Spline point evaluation (returning Vector2) ---
Vector2* rlb_GetSplinePointLinear(float startX, float startY, float endX, float endY, float t) {
    __rlb_v2 = GetSplinePointLinear((Vector2){ startX, startY }, (Vector2){ endX, endY }, t);
    return &__rlb_v2;
}

Vector2* rlb_GetSplinePointBasis(float p1x, float p1y, float p2x, float p2y,
                                  float p3x, float p3y, float p4x, float p4y, float t) {
    __rlb_v2 = GetSplinePointBasis((Vector2){ p1x, p1y }, (Vector2){ p2x, p2y },
                                    (Vector2){ p3x, p3y }, (Vector2){ p4x, p4y }, t);
    return &__rlb_v2;
}

Vector2* rlb_GetSplinePointCatmullRom(float p1x, float p1y, float p2x, float p2y,
                                       float p3x, float p3y, float p4x, float p4y, float t) {
    __rlb_v2 = GetSplinePointCatmullRom((Vector2){ p1x, p1y }, (Vector2){ p2x, p2y },
                                         (Vector2){ p3x, p3y }, (Vector2){ p4x, p4y }, t);
    return &__rlb_v2;
}

Vector2* rlb_GetSplinePointBezierQuad(float p1x, float p1y, float c2x, float c2y, float p3x, float p3y, float t) {
    __rlb_v2 = GetSplinePointBezierQuad((Vector2){ p1x, p1y }, (Vector2){ c2x, c2y }, (Vector2){ p3x, p3y }, t);
    return &__rlb_v2;
}

Vector2* rlb_GetSplinePointBezierCubic(float p1x, float p1y, float c2x, float c2y,
                                        float c3x, float c3y, float p4x, float p4y, float t) {
    __rlb_v2 = GetSplinePointBezierCubic((Vector2){ p1x, p1y }, (Vector2){ c2x, c2y },
                                          (Vector2){ c3x, c3y }, (Vector2){ p4x, p4y }, t);
    return &__rlb_v2;
}

// --- Collision detection functions ---
int rlb_CheckCollisionRecs(float x1, float y1, float w1, float h1,
                            float x2, float y2, float w2, float h2) {
    return CheckCollisionRecs((Rectangle){ x1, y1, w1, h1 }, (Rectangle){ x2, y2, w2, h2 });
}

int rlb_CheckCollisionCircles(float c1x, float c1y, float r1,
                               float c2x, float c2y, float r2) {
    return CheckCollisionCircles((Vector2){ c1x, c1y }, r1, (Vector2){ c2x, c2y }, r2);
}

int rlb_CheckCollisionCircleRec(float cx, float cy, float radius,
                                 float rx, float ry, float rw, float rh) {
    return CheckCollisionCircleRec((Vector2){ cx, cy }, radius, (Rectangle){ rx, ry, rw, rh });
}

int rlb_CheckCollisionCircleLine(float cx, float cy, float radius,
                                  float p1x, float p1y, float p2x, float p2y) {
    return CheckCollisionCircleLine((Vector2){ cx, cy }, radius, (Vector2){ p1x, p1y }, (Vector2){ p2x, p2y });
}

int rlb_CheckCollisionPointRec(float px, float py, float rx, float ry, float rw, float rh) {
    return CheckCollisionPointRec((Vector2){ px, py }, (Rectangle){ rx, ry, rw, rh });
}

int rlb_CheckCollisionPointCircle(float px, float py, float cx, float cy, float radius) {
    return CheckCollisionPointCircle((Vector2){ px, py }, (Vector2){ cx, cy }, radius);
}

int rlb_CheckCollisionPointTriangle(float px, float py,
                                     float v1x, float v1y, float v2x, float v2y, float v3x, float v3y) {
    return CheckCollisionPointTriangle((Vector2){ px, py },
                                        (Vector2){ v1x, v1y }, (Vector2){ v2x, v2y }, (Vector2){ v3x, v3y });
}

int rlb_CheckCollisionPointLine(float px, float py, float p1x, float p1y, float p2x, float p2y, int threshold) {
    return CheckCollisionPointLine((Vector2){ px, py }, (Vector2){ p1x, p1y }, (Vector2){ p2x, p2y }, threshold);
}

Rectangle* rlb_GetCollisionRec(float x1, float y1, float w1, float h1,
                                float x2, float y2, float w2, float h2) {
    __rlb_rec = GetCollisionRec((Rectangle){ x1, y1, w1, h1 }, (Rectangle){ x2, y2, w2, h2 });
    return &__rlb_rec;
}

// ===== Texture Functions =====

// --- Image loading ---
Image* rlb_LoadImage(const char* fileName) {
    __rlb_img = LoadImage(fileName);
    return &__rlb_img;
}

Image* rlb_LoadImageFromTexture(unsigned int texId, int texWidth, int texHeight, int texMipmaps, int texFmt) {
    Texture2D tex = { texId, texWidth, texHeight, texMipmaps, texFmt };
    __rlb_img = LoadImageFromTexture(tex);
    return &__rlb_img;
}

Image* rlb_LoadImageFromScreen(void) {
    __rlb_img = LoadImageFromScreen();
    return &__rlb_img;
}

Image* rlb_GenImageColor(int width, int height, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    __rlb_img = GenImageColor(width, height, (Color){ r, g, b, a });
    return &__rlb_img;
}

// --- Image manipulation ---
Image* rlb_ImageFromImage(int data, int width, int height, int mipmaps, int format,
                           float rx, float ry, float rw, float rh) {
    Image src = { (void*)(intptr_t)data, width, height, mipmaps, format };
    __rlb_img = ImageFromImage(src, (Rectangle){ rx, ry, rw, rh });
    return &__rlb_img;
}

Image* rlb_ImageText(const char* text, int fontSize, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    __rlb_img = ImageText(text, fontSize, (Color){ r, g, b, a });
    return &__rlb_img;
}

// --- Texture loading ---
Texture2D* rlb_LoadTexture(const char* fileName) {
    __rlb_tex = LoadTexture(fileName);
    return &__rlb_tex;
}

Texture2D* rlb_LoadTextureFromImage(int data, int width, int height, int mipmaps, int format) {
    Image img = { (void*)(intptr_t)data, width, height, mipmaps, format };
    __rlb_tex = LoadTextureFromImage(img);
    return &__rlb_tex;
}

RenderTexture2D* rlb_LoadRenderTexture(int width, int height) {
    __rlb_rtex = LoadRenderTexture(width, height);
    return &__rlb_rtex;
}

// --- Texture drawing ---
void rlb_DrawTextureV(unsigned int id, int width, int height, int mipmaps, int format,
                      float posX, float posY,
                      unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Texture2D tex = { id, width, height, mipmaps, format };
    DrawTextureV(tex, (Vector2){ posX, posY }, (Color){ r, g, b, a });
}

void rlb_DrawTextureEx(unsigned int id, int width, int height, int mipmaps, int format,
                       float posX, float posY, float rotation, float scale,
                       unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Texture2D tex = { id, width, height, mipmaps, format };
    DrawTextureEx(tex, (Vector2){ posX, posY }, rotation, scale, (Color){ r, g, b, a });
}

void rlb_DrawTextureRec(unsigned int id, int width, int height, int mipmaps, int format,
                        float srcX, float srcY, float srcW, float srcH,
                        float posX, float posY,
                        unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Texture2D tex = { id, width, height, mipmaps, format };
    DrawTextureRec(tex, (Rectangle){ srcX, srcY, srcW, srcH }, (Vector2){ posX, posY }, (Color){ r, g, b, a });
}

void rlb_DrawTexturePro(unsigned int id, int width, int height, int mipmaps, int format,
                        float srcX, float srcY, float srcW, float srcH,
                        float dstX, float dstY, float dstW, float dstH,
                        float originX, float originY, float rotation,
                        unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Texture2D tex = { id, width, height, mipmaps, format };
    DrawTexturePro(tex, (Rectangle){ srcX, srcY, srcW, srcH },
                   (Rectangle){ dstX, dstY, dstW, dstH },
                   (Vector2){ originX, originY }, rotation, (Color){ r, g, b, a });
}

void rlb_DrawTextureNPatch(unsigned int id, int width, int height, int mipmaps, int format,
                           float srcX, float srcY, float srcW, float srcH,
                           int nLeft, int nTop, int nRight, int nBottom, int nLayout,
                           float dstX, float dstY, float dstW, float dstH,
                           float originX, float originY, float rotation,
                           unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Texture2D tex = { id, width, height, mipmaps, format };
    NPatchInfo nInfo = { { srcX, srcY, srcW, srcH }, nLeft, nTop, nRight, nBottom, nLayout };
    DrawTextureNPatch(tex, nInfo, (Rectangle){ dstX, dstY, dstW, dstH },
                      (Vector2){ originX, originY }, rotation, (Color){ r, g, b, a });
}

// --- Color functions ---
int rlb_ColorIsEqual(unsigned char r1, unsigned char g1, unsigned char b1, unsigned char a1,
                     unsigned char r2, unsigned char g2, unsigned char b2, unsigned char a2) {
    return ColorIsEqual((Color){ r1, g1, b1, a1 }, (Color){ r2, g2, b2, a2 });
}

int rlb_ColorToInt(unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    return ColorToInt((Color){ r, g, b, a });
}

Vector4* rlb_ColorNormalize(unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    __rlb_v4 = ColorNormalize((Color){ r, g, b, a });
    return &__rlb_v4;
}

Color* rlb_ColorFromNormalized(float x, float y, float z, float w) {
    __rlb_color = ColorFromNormalized((Vector4){ x, y, z, w });
    return &__rlb_color;
}

Vector3* rlb_ColorToHSV(unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    __rlb_v3 = ColorToHSV((Color){ r, g, b, a });
    return &__rlb_v3;
}

Color* rlb_ColorFromHSV(float hue, float saturation, float value) {
    __rlb_color = ColorFromHSV(hue, saturation, value);
    return &__rlb_color;
}

Color* rlb_ColorTint(unsigned char r, unsigned char g, unsigned char b, unsigned char a,
                     unsigned char tr, unsigned char tg, unsigned char tb, unsigned char ta) {
    __rlb_color = ColorTint((Color){ r, g, b, a }, (Color){ tr, tg, tb, ta });
    return &__rlb_color;
}

Color* rlb_ColorBrightness(unsigned char r, unsigned char g, unsigned char b, unsigned char a, float factor) {
    __rlb_color = ColorBrightness((Color){ r, g, b, a }, factor);
    return &__rlb_color;
}

Color* rlb_ColorContrast(unsigned char r, unsigned char g, unsigned char b, unsigned char a, float contrast) {
    __rlb_color = ColorContrast((Color){ r, g, b, a }, contrast);
    return &__rlb_color;
}

Color* rlb_ColorAlpha(unsigned char r, unsigned char g, unsigned char b, unsigned char a, float alpha) {
    __rlb_color = ColorAlpha((Color){ r, g, b, a }, alpha);
    return &__rlb_color;
}

Color* rlb_ColorAlphaBlend(unsigned char dr, unsigned char dg, unsigned char db, unsigned char da,
                           unsigned char sr, unsigned char sg, unsigned char sb, unsigned char sa,
                           unsigned char tr, unsigned char tg, unsigned char tb, unsigned char ta) {
    __rlb_color = ColorAlphaBlend((Color){ dr, dg, db, da },
                                   (Color){ sr, sg, sb, sa },
                                   (Color){ tr, tg, tb, ta });
    return &__rlb_color;
}

Color* rlb_ColorLerp(unsigned char r1, unsigned char g1, unsigned char b1, unsigned char a1,
                     unsigned char r2, unsigned char g2, unsigned char b2, unsigned char a2, float factor) {
    __rlb_color = ColorLerp((Color){ r1, g1, b1, a1 }, (Color){ r2, g2, b2, a2 }, factor);
    return &__rlb_color;
}

Color* rlb_GetColor(unsigned int hexValue) {
    __rlb_color = GetColor(hexValue);
    return &__rlb_color;
}

Color* rlb_Fade(unsigned char r, unsigned char g, unsigned char b, unsigned char a, float alpha) {
    __rlb_color = Fade((Color){ r, g, b, a }, alpha);
    return &__rlb_color;
}

// ===== Font/Text Functions =====

Font* rlb_GetFontDefault(void) {
    __rlb_font = GetFontDefault();
    return &__rlb_font;
}

Font* rlb_LoadFont(const char* fileName) {
    __rlb_font = LoadFont(fileName);
    return &__rlb_font;
}

void rlb_DrawTextEx(int baseSize, int glyphCount, int glyphPadding,
                    unsigned int texId, int texWidth, int texHeight, int texMipmaps, int texFmt,
                    int recs, int glyphs,
                    const char* text, float posX, float posY, float fontSize, float spacing,
                    unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Font font;
    font.baseSize = baseSize;
    font.glyphCount = glyphCount;
    font.glyphPadding = glyphPadding;
    font.texture.id = texId;
    font.texture.width = texWidth;
    font.texture.height = texHeight;
    font.texture.mipmaps = texMipmaps;
    font.texture.format = texFmt;
    font.recs = (Rectangle*)(intptr_t)recs;
    font.glyphs = (GlyphInfo*)(intptr_t)glyphs;
    DrawTextEx(font, text, (Vector2){ posX, posY }, fontSize, spacing, (Color){ r, g, b, a });
}

void rlb_DrawTextPro(int baseSize, int glyphCount, int glyphPadding,
                     unsigned int texId, int texWidth, int texHeight, int texMipmaps, int texFmt,
                     int recs, int glyphs,
                     const char* text, float posX, float posY,
                     float originX, float originY, float rotation, float fontSize, float spacing,
                     unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Font font;
    font.baseSize = baseSize;
    font.glyphCount = glyphCount;
    font.glyphPadding = glyphPadding;
    font.texture.id = texId;
    font.texture.width = texWidth;
    font.texture.height = texHeight;
    font.texture.mipmaps = texMipmaps;
    font.texture.format = texFmt;
    font.recs = (Rectangle*)(intptr_t)recs;
    font.glyphs = (GlyphInfo*)(intptr_t)glyphs;
    DrawTextPro(font, text, (Vector2){ posX, posY }, (Vector2){ originX, originY },
                rotation, fontSize, spacing, (Color){ r, g, b, a });
}

Vector2* rlb_MeasureTextEx(int baseSize, int glyphCount, int glyphPadding,
                            unsigned int texId, int texWidth, int texHeight, int texMipmaps, int texFmt,
                            int recs, int glyphs,
                            const char* text, float fontSize, float spacing) {
    Font font;
    font.baseSize = baseSize;
    font.glyphCount = glyphCount;
    font.glyphPadding = glyphPadding;
    font.texture.id = texId;
    font.texture.width = texWidth;
    font.texture.height = texHeight;
    font.texture.mipmaps = texMipmaps;
    font.texture.format = texFmt;
    font.recs = (Rectangle*)(intptr_t)recs;
    font.glyphs = (GlyphInfo*)(intptr_t)glyphs;
    __rlb_v2 = MeasureTextEx(font, text, fontSize, spacing);
    return &__rlb_v2;
}

// ===== 3D Functions =====

// --- Line3D ---
void rlb_DrawLine3D(float startX, float startY, float startZ,
                    float endX, float endY, float endZ,
                    unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawLine3D((Vector3){ startX, startY, startZ }, (Vector3){ endX, endY, endZ }, (Color){ r, g, b, a });
}

void rlb_DrawPoint3D(float posX, float posY, float posZ,
                     unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawPoint3D((Vector3){ posX, posY, posZ }, (Color){ r, g, b, a });
}

void rlb_DrawCircle3D(float cx, float cy, float cz, float radius,
                      float rotAxisX, float rotAxisY, float rotAxisZ, float rotAngle,
                      unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCircle3D((Vector3){ cx, cy, cz }, radius,
                 (Vector3){ rotAxisX, rotAxisY, rotAxisZ }, rotAngle, (Color){ r, g, b, a });
}

void rlb_DrawTriangle3D(float v1x, float v1y, float v1z,
                        float v2x, float v2y, float v2z,
                        float v3x, float v3y, float v3z,
                        unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawTriangle3D((Vector3){ v1x, v1y, v1z }, (Vector3){ v2x, v2y, v2z },
                   (Vector3){ v3x, v3y, v3z }, (Color){ r, g, b, a });
}

// --- Cube ---
void rlb_DrawCube(float posX, float posY, float posZ, float width, float height, float length,
                  unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCube((Vector3){ posX, posY, posZ }, width, height, length, (Color){ r, g, b, a });
}

void rlb_DrawCubeV(float posX, float posY, float posZ, float sizeX, float sizeY, float sizeZ,
                   unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCubeV((Vector3){ posX, posY, posZ }, (Vector3){ sizeX, sizeY, sizeZ }, (Color){ r, g, b, a });
}

void rlb_DrawCubeWires(float posX, float posY, float posZ, float width, float height, float length,
                       unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCubeWires((Vector3){ posX, posY, posZ }, width, height, length, (Color){ r, g, b, a });
}

void rlb_DrawCubeWiresV(float posX, float posY, float posZ, float sizeX, float sizeY, float sizeZ,
                        unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCubeWiresV((Vector3){ posX, posY, posZ }, (Vector3){ sizeX, sizeY, sizeZ }, (Color){ r, g, b, a });
}

// --- Sphere ---
void rlb_DrawSphere(float cx, float cy, float cz, float radius,
                    unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawSphere((Vector3){ cx, cy, cz }, radius, (Color){ r, g, b, a });
}

void rlb_DrawSphereEx(float cx, float cy, float cz, float radius, int rings, int slices,
                      unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawSphereEx((Vector3){ cx, cy, cz }, radius, rings, slices, (Color){ r, g, b, a });
}

void rlb_DrawSphereWires(float cx, float cy, float cz, float radius, int rings, int slices,
                         unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawSphereWires((Vector3){ cx, cy, cz }, radius, rings, slices, (Color){ r, g, b, a });
}

// --- Cylinder ---
void rlb_DrawCylinder(float posX, float posY, float posZ, float radiusTop, float radiusBottom,
                      float height, int slices,
                      unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCylinder((Vector3){ posX, posY, posZ }, radiusTop, radiusBottom, height, slices, (Color){ r, g, b, a });
}

void rlb_DrawCylinderEx(float startX, float startY, float startZ,
                        float endX, float endY, float endZ,
                        float startRadius, float endRadius, int sides,
                        unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCylinderEx((Vector3){ startX, startY, startZ }, (Vector3){ endX, endY, endZ },
                   startRadius, endRadius, sides, (Color){ r, g, b, a });
}

void rlb_DrawCylinderWires(float posX, float posY, float posZ, float radiusTop, float radiusBottom,
                           float height, int slices,
                           unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCylinderWires((Vector3){ posX, posY, posZ }, radiusTop, radiusBottom, height, slices, (Color){ r, g, b, a });
}

void rlb_DrawCylinderWiresEx(float startX, float startY, float startZ,
                             float endX, float endY, float endZ,
                             float startRadius, float endRadius, int sides,
                             unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCylinderWiresEx((Vector3){ startX, startY, startZ }, (Vector3){ endX, endY, endZ },
                        startRadius, endRadius, sides, (Color){ r, g, b, a });
}

// --- Capsule ---
void rlb_DrawCapsule(float startX, float startY, float startZ,
                     float endX, float endY, float endZ,
                     float radius, int slices, int rings,
                     unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCapsule((Vector3){ startX, startY, startZ }, (Vector3){ endX, endY, endZ },
                radius, slices, rings, (Color){ r, g, b, a });
}

void rlb_DrawCapsuleWires(float startX, float startY, float startZ,
                          float endX, float endY, float endZ,
                          float radius, int slices, int rings,
                          unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCapsuleWires((Vector3){ startX, startY, startZ }, (Vector3){ endX, endY, endZ },
                     radius, slices, rings, (Color){ r, g, b, a });
}

// --- Plane ---
void rlb_DrawPlane(float cx, float cy, float cz, float sizeX, float sizeZ,
                   unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawPlane((Vector3){ cx, cy, cz }, (Vector2){ sizeX, sizeZ }, (Color){ r, g, b, a });
}

// --- Ray ---
void rlb_DrawRay(float posX, float posY, float posZ, float dirX, float dirY, float dirZ,
                 unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRay((Ray){ { posX, posY, posZ }, { dirX, dirY, dirZ } }, (Color){ r, g, b, a });
}

// --- Model drawing ---
void rlb_DrawModel(int meshCount, int materialCount, int meshesPtr, int materialsPtr,
                   int meshMaterialPtr,
                   float posX, float posY, float posZ, float scale,
                   unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Model model = { 0 };
    model.meshCount = meshCount;
    model.materialCount = materialCount;
    model.meshes = (Mesh*)(intptr_t)meshesPtr;
    model.materials = (Material*)(intptr_t)materialsPtr;
    model.meshMaterial = (int*)(intptr_t)meshMaterialPtr;
    DrawModel(model, (Vector3){ posX, posY, posZ }, scale, (Color){ r, g, b, a });
}

void rlb_DrawModelEx(int meshCount, int materialCount, int meshesPtr, int materialsPtr,
                     int meshMaterialPtr,
                     float posX, float posY, float posZ,
                     float rotAxisX, float rotAxisY, float rotAxisZ, float rotAngle,
                     float scaleX, float scaleY, float scaleZ,
                     unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Model model = { 0 };
    model.meshCount = meshCount;
    model.materialCount = materialCount;
    model.meshes = (Mesh*)(intptr_t)meshesPtr;
    model.materials = (Material*)(intptr_t)materialsPtr;
    model.meshMaterial = (int*)(intptr_t)meshMaterialPtr;
    DrawModelEx(model, (Vector3){ posX, posY, posZ },
                (Vector3){ rotAxisX, rotAxisY, rotAxisZ }, rotAngle,
                (Vector3){ scaleX, scaleY, scaleZ }, (Color){ r, g, b, a });
}

// --- BoundingBox drawing ---
void rlb_DrawBoundingBox(float minX, float minY, float minZ,
                         float maxX, float maxY, float maxZ,
                         unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawBoundingBox((BoundingBox){ { minX, minY, minZ }, { maxX, maxY, maxZ } }, (Color){ r, g, b, a });
}

// --- Billboard ---
void rlb_DrawBillboard(float camPosX, float camPosY, float camPosZ,
                       float camTargetX, float camTargetY, float camTargetZ,
                       float camUpX, float camUpY, float camUpZ,
                       float camFovy, int camProjection,
                       unsigned int texId, int texWidth, int texHeight, int texMipmaps, int texFmt,
                       float posX, float posY, float posZ, float scale,
                       unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    Camera cam = { { camPosX, camPosY, camPosZ }, { camTargetX, camTargetY, camTargetZ },
                   { camUpX, camUpY, camUpZ }, camFovy, camProjection };
    Texture2D tex = { texId, texWidth, texHeight, texMipmaps, texFmt };
    DrawBillboard(cam, tex, (Vector3){ posX, posY, posZ }, scale, (Color){ r, g, b, a });
}

// --- Collision Detection 3D ---
int rlb_CheckCollisionSpheres(float c1x, float c1y, float c1z, float r1,
                               float c2x, float c2y, float c2z, float r2) {
    return CheckCollisionSpheres((Vector3){ c1x, c1y, c1z }, r1,
                                  (Vector3){ c2x, c2y, c2z }, r2);
}

int rlb_CheckCollisionBoxes(float min1x, float min1y, float min1z,
                             float max1x, float max1y, float max1z,
                             float min2x, float min2y, float min2z,
                             float max2x, float max2y, float max2z) {
    return CheckCollisionBoxes((BoundingBox){ { min1x, min1y, min1z }, { max1x, max1y, max1z } },
                                (BoundingBox){ { min2x, min2y, min2z }, { max2x, max2y, max2z } });
}

int rlb_CheckCollisionBoxSphere(float minX, float minY, float minZ,
                                 float maxX, float maxY, float maxZ,
                                 float cx, float cy, float cz, float radius) {
    return CheckCollisionBoxSphere((BoundingBox){ { minX, minY, minZ }, { maxX, maxY, maxZ } },
                                    (Vector3){ cx, cy, cz }, radius);
}

RayCollision* rlb_GetRayCollisionSphere(float posX, float posY, float posZ,
                                         float dirX, float dirY, float dirZ,
                                         float cx, float cy, float cz, float radius) {
    __rlb_raycol = GetRayCollisionSphere((Ray){ { posX, posY, posZ }, { dirX, dirY, dirZ } },
                                          (Vector3){ cx, cy, cz }, radius);
    return &__rlb_raycol;
}

RayCollision* rlb_GetRayCollisionBox(float posX, float posY, float posZ,
                                      float dirX, float dirY, float dirZ,
                                      float minX, float minY, float minZ,
                                      float maxX, float maxY, float maxZ) {
    __rlb_raycol = GetRayCollisionBox((Ray){ { posX, posY, posZ }, { dirX, dirY, dirZ } },
                                       (BoundingBox){ { minX, minY, minZ }, { maxX, maxY, maxZ } });
    return &__rlb_raycol;
}

RayCollision* rlb_GetRayCollisionTriangle(float posX, float posY, float posZ,
                                           float dirX, float dirY, float dirZ,
                                           float p1x, float p1y, float p1z,
                                           float p2x, float p2y, float p2z,
                                           float p3x, float p3y, float p3z) {
    __rlb_raycol = GetRayCollisionTriangle((Ray){ { posX, posY, posZ }, { dirX, dirY, dirZ } },
                                            (Vector3){ p1x, p1y, p1z },
                                            (Vector3){ p2x, p2y, p2z },
                                            (Vector3){ p3x, p3y, p3z });
    return &__rlb_raycol;
}

RayCollision* rlb_GetRayCollisionQuad(float posX, float posY, float posZ,
                                       float dirX, float dirY, float dirZ,
                                       float p1x, float p1y, float p1z,
                                       float p2x, float p2y, float p2z,
                                       float p3x, float p3y, float p3z,
                                       float p4x, float p4y, float p4z) {
    __rlb_raycol = GetRayCollisionQuad((Ray){ { posX, posY, posZ }, { dirX, dirY, dirZ } },
                                        (Vector3){ p1x, p1y, p1z },
                                        (Vector3){ p2x, p2y, p2z },
                                        (Vector3){ p3x, p3y, p3z },
                                        (Vector3){ p4x, p4y, p4z });
    return &__rlb_raycol;
}

// ===== Audio Functions =====

Wave* rlb_LoadWave(const char* fileName) {
    __rlb_wave = LoadWave(fileName);
    return &__rlb_wave;
}

Sound* rlb_LoadSound(const char* fileName) {
    __rlb_sound = LoadSound(fileName);
    return &__rlb_sound;
}

Sound* rlb_LoadSoundFromWave(unsigned int frameCount, unsigned int sampleRate,
                              unsigned int sampleSize, unsigned int channels, int dataPtr) {
    Wave w = { frameCount, sampleRate, sampleSize, channels, (void*)(intptr_t)dataPtr };
    __rlb_sound = LoadSoundFromWave(w);
    return &__rlb_sound;
}

Music* rlb_LoadMusicStream(const char* fileName) {
    __rlb_music = LoadMusicStream(fileName);
    return &__rlb_music;
}

// ===== Direct-FFI style wrappers for functions that take structs by value =====
// These MUST go through the bridge because Bun FFI decomposing structs
// into individual scalar args breaks the ARM64 calling convention.

void rlb_DrawPixel(int x, int y, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawPixel(x, y, (Color){ r, g, b, a });
}

void rlb_DrawLine(int x1, int y1, int x2, int y2, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawLine(x1, y1, x2, y2, (Color){ r, g, b, a });
}

void rlb_DrawCircle(int cx, int cy, float radius, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCircle(cx, cy, radius, (Color){ r, g, b, a });
}

void rlb_DrawCircleLines(int cx, int cy, float radius, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawCircleLines(cx, cy, radius, (Color){ r, g, b, a });
}

void rlb_DrawEllipse(int cx, int cy, float rh, float rv, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawEllipse(cx, cy, rh, rv, (Color){ r, g, b, a });
}

void rlb_DrawEllipseLines(int cx, int cy, float rh, float rv, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawEllipseLines(cx, cy, rh, rv, (Color){ r, g, b, a });
}

void rlb_DrawRectangle(int x, int y, int w, int h, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectangle(x, y, w, h, (Color){ r, g, b, a });
}

void rlb_DrawRectangleLines(int x, int y, int w, int h, unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawRectangleLines(x, y, w, h, (Color){ r, g, b, a });
}

void rlb_DrawRectangleGradientV(int x, int y, int w, int h,
    unsigned char tr, unsigned char tg, unsigned char tb, unsigned char ta,
    unsigned char br, unsigned char bg, unsigned char bb, unsigned char ba) {
    DrawRectangleGradientV(x, y, w, h, (Color){ tr, tg, tb, ta }, (Color){ br, bg, bb, ba });
}

void rlb_DrawRectangleGradientH(int x, int y, int w, int h,
    unsigned char lr, unsigned char lg, unsigned char lb, unsigned char la,
    unsigned char rr, unsigned char rg, unsigned char rb, unsigned char ra) {
    DrawRectangleGradientH(x, y, w, h, (Color){ lr, lg, lb, la }, (Color){ rr, rg, rb, ra });
}

void rlb_DrawText(const char* text, int x, int y, int fontSize,
                  unsigned char r, unsigned char g, unsigned char b, unsigned char a) {
    DrawText(text, x, y, fontSize, (Color){ r, g, b, a });
}
