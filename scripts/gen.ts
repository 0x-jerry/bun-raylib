// scripts/gen.ts
// Generates the raylib bindings from raylib/include/raylib.h:
//   src/types.ts   — struct interfaces, enums, color constants
//   src/layouts.ts — struct/args layout tables (offsets/sizes, C-ABI verified)
//   src/ffi.ts     — dlopen declarations (direct lib + bridge)
//   src/raylib.ts  — high-level API wrappers
//   src/bridge.c   — C bridge: struct-by-value wrappers + static layout asserts
//
// Usage: bun run scripts/gen.ts   (then: bun run scripts/build-bridge.ts)

import { $ } from "bun";
import { basename, dirname, join } from "node:path";

const ROOT = dirname(import.meta.dirname);
const HEADER = join(ROOT, "raylib", "include", "raylib.h");
const OUT = (f: string) => join(ROOT, "src", f);

// ============================================================================
// 1. Header parsing
// ============================================================================

interface Field { type: string; name: string }
interface StructInfo { name: string; fields: Field[] }
interface EnumInfo { name: string; members: { name: string; value: number }[] }
interface FnInfo { name: string; ret: string; params: Field[]; raw: string; varargs?: boolean }
interface ColorInfo { name: string; r: number; g: number; b: number; a: number }

interface ParsedHeader {
  structs: StructInfo[];
  enums: EnumInfo[];
  aliases: Map<string, string>;
  callbacks: Set<string>;
  colors: ColorInfo[];
  functions: FnInfo[];
}

const C_KEYWORDS = new Set([
  "auto","break","case","char","const","continue","default","do","double","else","enum","extern",
  "float","for","goto","if","inline","int","long","register","restrict","return","short","signed",
  "sizeof","static","struct","switch","typedef","union","unsigned","void","volatile","while",
]);

function parseHeader(src: string): ParsedHeader {
  // Strip block comments, then line comments (raylib.h has no '//' inside strings).
  src = src.replace(/\/\*[\s\S]*?\*\//g, "");
  src = src
    .split("\n")
    .map((l) => {
      const i = l.indexOf("//");
      return i >= 0 ? l.slice(0, i) : l;
    })
    .join("\n");

  const structs: StructInfo[] = [];
  const enums: EnumInfo[] = [];
  const aliases = new Map<string, string>();
  const callbacks = new Set<string>();
  const colors: ColorInfo[] = [];
  const functions: FnInfo[] = [];

  // --- typedef struct X { ... } X; ---
  const structRe = /typedef\s+struct\s+(\w+)\s*\{([\s\S]*?)\}\s*\1\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = structRe.exec(src)) !== null) {
    const name = m[1]!;
    const fields: Field[] = [];
    for (const stmt of m[2]!.split(";")) {
      const s = stmt.trim();
      if (!s) continue;
      fields.push(...parseFields(s, name));
    }
    structs.push({ name, fields });
  }

  // --- typedef enum { ... } Name; ---
  const enumRe = /typedef\s+enum\s*\{([\s\S]*?)\}\s*(\w+)\s*;/g;
  while ((m = enumRe.exec(src)) !== null) {
    const name = m[2]!;
    const members: EnumInfo["members"] = [];
    let prev = -1;
    for (const line of m[1]!.split("\n")) {
      const t = line.trim().replace(/,$/, "");
      if (!t) continue;
      const em = /^(\w+)\s*(?:=\s*([^,\s]+))?$/.exec(t);
      if (!em) throw new Error(`Unparseable enum member in ${name}: "${t}"`);
      let value: number;
      if (em[2] === undefined) value = prev + 1;
      else if (/^0x/i.test(em[2])) value = parseInt(em[2], 16);
      else value = parseInt(em[2], 10);
      if (Number.isNaN(value)) throw new Error(`Bad enum value in ${name}.${em[1]}: ${em[2]}`);
      members.push({ name: em[1]!, value });
      prev = value;
    }
    enums.push({ name, members });
  }

  // --- callback typedefs: typedef void (*Name)(...); ---
  const cbRe = /typedef\s+[^(]*\(\s*\*\s*(\w+)\s*\)\([^)]*\)\s*;/g;
  while ((m = cbRe.exec(src)) !== null) callbacks.add(m[1]!);

  // --- simple typedefs: typedef T Alias; (also opaque `typedef struct X X;`) ---
  const typRe = /typedef\s+([^;]+);/g;
  while ((m = typRe.exec(src)) !== null) {
    const body = m[1]!.trim();
    // skip struct/enum/callback definitions (handled above)
    if (/[{}()]/.test(body)) continue;
    const f = parseField(body, "typedef");
    if (!f) continue;
    if (structs.some((s) => s.name === f.name) || enums.some((e) => e.name === f.name)) continue;
    aliases.set(f.name, f.type);
  }

  // --- color defines: #define NAME CLITERAL(Color){ r, g, b, a } ---
  const colRe = /#define\s+(\w+)\s+CLITERAL\(Color\)\{\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\}/g;
  while ((m = colRe.exec(src)) !== null) {
    colors.push({ name: m[1]!, r: +m[2]!, g: +m[3]!, b: +m[4]!, a: +m[5]! });
  }

  // --- RLAPI functions (single-line per raylib.h convention) ---
  const fnRe = /^\s*RLAPI\s+(.+?);\s*$/gm;
  while ((m = fnRe.exec(src)) !== null) {
    const body = m[1]!;
    const open = body.indexOf("(");
    if (open < 0) throw new Error(`No param list in: ${body}`);
    const left = body.slice(0, open).trim();
    // name is the trailing identifier; any "*" before it belongs to the return type
    const nm = /([A-Za-z_]\w*)$/.exec(left);
    if (!nm) throw new Error(`No function name in: ${body}`);
    const name = nm[1]!;
    const ret = left.slice(0, nm.index).trimEnd() || "void";
    let params: Field[] = [];
    const inner = body.slice(open + 1, body.lastIndexOf(")")).trim();
    if (inner.includes("...")) {
      // varargs cannot be bound via FFI; record and skip in main()
      functions.push({ name, ret, params: [], raw: body, varargs: true });
      continue;
    }
    if (inner && inner !== "void") {
      for (const p of splitTopLevel(inner)) {
        const parsed = parseField(p, name);
        if (parsed) params.push(parsed);
      }
    }
    functions.push({ name, ret, params, raw: body });
  }

  return { structs, enums, aliases, callbacks, colors, functions };
}

/** Split on commas at depth 0 (no nested parens in raylib params except skipped callbacks). */
function splitTopLevel(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

/** Parse a C declarator list: "float m0, m4, m8, m12;" -> 4 fields. */
function parseFields(stmt: string, context: string): Field[] {
  const parts = splitTopLevel(stmt);
  const out: Field[] = [];
  let commonType: string | null = null;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!.trim();
    if (i === 0) {
      const parsed = parseField(part, context);
      if (!parsed) continue;
      commonType = parsed.type;
      out.push(parsed);
    } else {
      const arr = /^([A-Za-z_]\w*)\s*(\[\d+\])?\s*$/.exec(part);
      if (!arr) throw new Error(`Unparseable declarator in ${context}: "${part}"`);
      out.push({ type: commonType!, name: arr[1]! + (arr[2] ?? "") });
    }
  }
  return out;
}

/** Parse "type name;" / "type name[N];" / "const char *name". Returns null if no name.
 *  The name is the trailing identifier (+ optional [N]); any "*" before it belongs to the type. */
function parseField(stmt: string, context: string): Field | null {
  const s = stmt.trim();
  if (!s) return null;
  const nm = /([A-Za-z_]\w*)(\[\d+\])?$/.exec(s);
  if (!nm) return null;
  const name = nm[1]!;
  // keep the array suffix with the TYPE ("float params[4]" -> type "float[4]", name "params")
  const type = (s.slice(0, nm.index).trimEnd() + (nm[2] ?? "")).trim();
  if (!type) return null;
  return { type, name };
}

// ============================================================================
// 2. Type classification
// ============================================================================

interface ScalarInfo {
  size: number; align: number; ctype: string; ffi: string; ts: "number" | "boolean";
}

// `long` is 8 bytes on macOS/Linux 64-bit, 4 on win32 (mingw).
const LONG_SIZE = process.platform === "win32" ? 4 : 8;

const SCALARS: Record<string, ScalarInfo> = {
  bool: { size: 1, align: 1, ctype: "bool", ffi: "bool", ts: "boolean" },
  char: { size: 1, align: 1, ctype: "char", ffi: "i8", ts: "number" },
  "signed char": { size: 1, align: 1, ctype: "signed char", ffi: "i8", ts: "number" },
  "unsigned char": { size: 1, align: 1, ctype: "unsigned char", ffi: "u8", ts: "number" },
  short: { size: 2, align: 2, ctype: "short", ffi: "i16", ts: "number" },
  "unsigned short": { size: 2, align: 2, ctype: "unsigned short", ffi: "u16", ts: "number" },
  int: { size: 4, align: 4, ctype: "int", ffi: "i32", ts: "number" },
  "unsigned int": { size: 4, align: 4, ctype: "unsigned int", ffi: "u32", ts: "number" },
  float: { size: 4, align: 4, ctype: "float", ffi: "f32", ts: "number" },
  long: { size: LONG_SIZE, align: LONG_SIZE, ctype: "long", ffi: LONG_SIZE === 8 ? "i64" : "i32", ts: "number" },
  "unsigned long": { size: LONG_SIZE, align: LONG_SIZE, ctype: "unsigned long", ffi: LONG_SIZE === 8 ? "u64" : "u32", ts: "number" },
  "long long": { size: 8, align: 8, ctype: "long long", ffi: "i64", ts: "number" },
  "unsigned long long": { size: 8, align: 8, ctype: "unsigned long long", ffi: "u64", ts: "number" },
  double: { size: 8, align: 8, ctype: "double", ffi: "f64", ts: "number" },
  size_t: { size: 8, align: 8, ctype: "size_t", ffi: "u64", ts: "number" },
};

type Kind =
  | { kind: "scalar"; info: ScalarInfo; fieldType: string }
  | { kind: "ptr"; base: string; fieldType: "ptr" }
  | { kind: "cstring"; fieldType: "ptr" }
  | { kind: "struct"; name: string; fieldType: "struct" }
  | { kind: "charArr"; n: number; fieldType: "charArr" }
  | { kind: "floatArr"; n: number; fieldType: "floatArr" }
  | { kind: "intArr"; n: number; elemC: "int" | "unsigned char"; fieldType: "intArr" }
  | { kind: "structArr"; name: string; n: number; fieldType: "structArr" }
  | { kind: "void" };

/** Full classification of a C type string (const stripped, pointer/array aware). */
function classifyType(t: string, ctx: { aliases: Map<string, string>; structNames: Set<string> }): Kind {
  let s = t.trim();
  const isConst = /^const\s+/.test(s);
  s = s.replace(/^const\s+/, "").trim();

  // array: "float[4]", "char[32]", "Matrix[2]", "float [4]"
  const arr = /^(.+?)\s*\[\s*(\d+)\s*\]$/.exec(s);
  if (arr) {
    const base = arr[1]!.trim();
    const n = parseInt(arr[2]!, 10);
    if (base === "char") return { kind: "charArr", n, fieldType: "charArr" };
    if (base === "float") return { kind: "floatArr", n, fieldType: "floatArr" };
    if (base === "int") return { kind: "intArr", n, elemC: "int", fieldType: "intArr" };
    if (base === "unsigned char") return { kind: "intArr", n, elemC: "unsigned char", fieldType: "intArr" };
    const r = resolveAlias(base, ctx);
    if (ctx.structNames.has(r)) return { kind: "structArr", name: r, n, fieldType: "structArr" };
    throw new Error(`Unhandled array type: "${t}"`);
  }

  // pointer (incl. double pointer)
  if (s.endsWith("*")) {
    const stars = s.match(/\*+\s*$/)![0].length;
    const base = s.replace(/\*+\s*$/, "").trim();
    if (stars >= 2) return { kind: "ptr", base: s, fieldType: "ptr" }; // T** — raw pointer
    if (base === "char") return { kind: "cstring", fieldType: "ptr" };
    if (base === "void" || base === "") return { kind: "ptr", base, fieldType: "ptr" };
    const r = resolveAlias(base, ctx);
    if (ctx.structNames.has(r)) return { kind: "ptr", base: r, fieldType: "ptr" };
    return { kind: "ptr", base, fieldType: "ptr" };
  }

  if (s === "void") return { kind: "void" };

  const sc = SCALARS[s];
  if (sc) return { kind: "scalar", info: sc, fieldType: scalarFieldType(s) };

  if (isPtrAlias(s, ctx)) return { kind: "ptr", base: s, fieldType: "ptr" };

  const r = resolveAlias(s, ctx);
  if (ctx.structNames.has(r)) return { kind: "struct", name: r, fieldType: "struct" };

  throw new Error(`Unhandled type: "${t}"`);
}

function scalarFieldType(c: string): string {
  switch (c) {
    case "bool": return "bool";
    case "char":
    case "signed char": return "i8";
    case "unsigned char": return "u8";
    case "short": return "i16";
    case "unsigned short": return "u16";
    case "int": return "i32";
    case "unsigned int": return "u32";
    case "long": return LONG_SIZE === 8 ? "i64" : "i32";
    case "unsigned long": return LONG_SIZE === 8 ? "u64" : "u32";
    case "long long": return "i64";
    case "unsigned long long": return "u64";
    case "float": return "f32";
    case "double": return "f64";
    case "size_t": return "u64";
    default: throw new Error(`Unknown scalar ${c}`);
  }
}

function resolveAlias(name: string, ctx: { aliases: Map<string, string> }): string {
  let cur = name;
  const seen = new Set<string>();
  while (ctx.aliases.has(cur) && !seen.has(cur)) {
    seen.add(cur);
    const t = ctx.aliases.get(cur)!;
    // pointer aliases (e.g. `typedef Transform *ModelAnimPose`) resolve as-is
    if (t.includes("*")) return cur;
    cur = t.trim();
  }
  return cur;
}

/** True if `name` is (or aliases to) a pointer type, e.g. ModelAnimPose -> Transform*. */
function isPtrAlias(name: string, ctx: { aliases: Map<string, string> }): boolean {
  let cur = name;
  const seen = new Set<string>();
  while (ctx.aliases.has(cur) && !seen.has(cur)) {
    seen.add(cur);
    const t = ctx.aliases.get(cur)!;
    if (t.includes("*")) return true;
    cur = t.trim();
  }
  return false;
}

// ============================================================================
// 3. Layout engine (natural C alignment, verified by static asserts in bridge.c)
// ============================================================================

interface FieldLayoutInfo {
  name: string;
  type: string; // FieldType token
  offset: number;
  size: number;
  count?: number;
  structName?: string;
}

interface StructLayoutInfo {
  name: string;
  size: number;
  align: number;
  fields: FieldLayoutInfo[];
}

function alignUp(v: number, a: number): number {
  return Math.ceil(v / a) * a;
}

function computeLayout(
  name: string,
  fields: Field[],
  ctx: { structs: Map<string, StructInfo>; aliases: Map<string, string>; structNames: Set<string> },
  memo: Map<string, StructLayoutInfo>,
  stack: Set<string> = new Set(),
): StructLayoutInfo {
  const cached = memo.get(name);
  if (cached) return cached;
  if (stack.has(name)) throw new Error(`Struct cycle detected: ${name}`);
  stack.add(name);

  let offset = 0;
  let maxAlign = 1;
  const out: FieldLayoutInfo[] = [];

  for (const f of fields) {
    const k = classifyType(f.type, ctx);
    let size = 0;
    let align = 1;
    let fieldType: string = "ptr";
    let count: number | undefined;
    let structName: string | undefined;
    switch (k.kind) {
      case "scalar":
        size = k.info.size;
        align = k.info.align;
        fieldType = k.fieldType;
        break;
      case "ptr":
      case "cstring":
        size = 8;
        align = 8;
        break;
      case "charArr":
        fieldType = "charArr";
        size = k.n;
        align = 1;
        count = k.n;
        break;
      case "floatArr":
        fieldType = "floatArr";
        size = k.n * 4;
        align = 4;
        count = k.n;
        break;
      case "intArr":
        fieldType = "intArr";
        size = k.n * (k.elemC === "unsigned char" ? 1 : 4);
        align = k.elemC === "unsigned char" ? 1 : 4;
        count = k.n;
        break;
      case "structArr": {
        fieldType = "structArr";
        const l = computeLayout(k.name, ctx.structs.get(k.name)!.fields, ctx, memo, stack);
        size = l.size * k.n;
        align = l.align;
        count = k.n;
        structName = k.name;
        break;
      }
      case "struct": {
        fieldType = "struct";
        const l = computeLayout(k.name, ctx.structs.get(k.name)!.fields, ctx, memo, stack);
        size = l.size;
        align = l.align;
        structName = k.name;
        break;
      }
      case "void":
        throw new Error(`void field in ${name}`);
    }
    offset = alignUp(offset, align);
    out.push({ name: f.name.replace(/\[\d+\]$/, ""), type: fieldType, offset, size, count, structName });
    offset += size;
    maxAlign = Math.max(maxAlign, align);
  }

  stack.delete(name);
  const layout: StructLayoutInfo = { name, size: alignUp(offset, maxAlign), align: maxAlign, fields: out };
  memo.set(name, layout);
  return layout;
}

// ============================================================================
// 4. Function classification
// ============================================================================

type ParamKindInfo =
  | { kind: "scalar"; ts: "number" | "boolean"; ctype: string }
  | { kind: "bool"; ts: "boolean" }
  | { kind: "cstring"; ts: "string" }
  | { kind: "ptr"; ts: "number" }                    // raw pointer (out params etc.)
  | { kind: "bufferPtr"; ts: string; elem?: "float" | "int" | "uchar" } // void*/const scalar*
  | { kind: "structPtr"; structName: string }        // T* — in-place mutation
  | { kind: "constStructPtr"; structName: string }   // const T* — input array
  | { kind: "struct"; structName: string };          // T — by value

interface ClassifiedFn {
  fn: FnInfo;
  bridge: boolean; // needs C bridge (struct by value in/out)
  skip: boolean;
  skipReason?: string;
  retKind: "void" | "scalar" | "cstring" | "ptr" | "struct";
  retStructName?: string;
  retScalar?: ScalarInfo;
  params: { field: Field; kind: ParamKindInfo }[];
}

function classifyParam(field: Field, ctx: { aliases: Map<string, string>; structNames: Set<string> }): ParamKindInfo {
  const t = field.type.trim();
  const isConst = /^const\s+/.test(t);
  const s = t.replace(/^const\s+/, "").trim();

  if (t.includes("...")) throw new Error("varargs must be filtered before classifyParam");
  if (s === "void") throw new Error("void param must be filtered before classifyParam");

  // pointers
  if (s.endsWith("*")) {
    const stars = s.match(/\*+\s*$/)![0].length;
    const base = s.replace(/\*+\s*$/, "").trim();
    if (stars >= 2) return { kind: "ptr", ts: "number" }; // T** — raw pointer
    if (base === "char") return { kind: "cstring", ts: "string" };
    if (base === "void") return { kind: "bufferPtr", ts: "number | ArrayBufferView" };
    const r = resolveAlias(base, ctx);
    if (ctx.structNames.has(r)) {
      if (isConst) return { kind: "constStructPtr", structName: r };
      return { kind: "structPtr", structName: r };
    }
    if (base === "float" && isConst) return { kind: "bufferPtr", ts: "number | Float32Array | number[]", elem: "float" };
    if (base === "int" && isConst) return { kind: "bufferPtr", ts: "number | Int32Array | number[]", elem: "int" };
    if (base === "unsigned char" && isConst) return { kind: "bufferPtr", ts: "number | Uint8Array | number[]", elem: "uchar" };
    return { kind: "ptr", ts: "number" };
  }

  const sc = SCALARS[s];
  if (sc) {
    if (s === "bool") return { kind: "bool", ts: "boolean" };
    return { kind: "scalar", ts: "number", ctype: sc.ctype };
  }

  const r = resolveAlias(s, ctx);
  if (ctx.structNames.has(r)) return { kind: "struct", structName: r };

  throw new Error(`Unhandled param type: ${field.type}`);
}

function classifyReturn(ret: string, ctx: { aliases: Map<string, string>; structNames: Set<string> }) {
  const t = ret.trim();
  if (t === "void") return { retKind: "void" as const };
  const t2 = t.replace(/^const\s+/, "").trim();
  if (t2.endsWith("*")) {
    const base = t2.replace(/\*+\s*$/, "").trim();
    if (base === "char") return { retKind: "cstring" as const };
    return { retKind: "ptr" as const };
  }
  const sc = SCALARS[t2];
  if (sc) return { retKind: "scalar" as const, retScalar: sc };
  const r = resolveAlias(t2, ctx);
  if (ctx.structNames.has(r)) return { retKind: "struct" as const, retStructName: r };
  throw new Error(`Unhandled return type: ${ret}`);
}

// ============================================================================
// 5. Emitters
// ============================================================================

function tsFieldType(k: Kind): string {
  switch (k.kind) {
    case "scalar": return k.info.ts;
    case "ptr":
    case "cstring": return "number";
    case "struct": return k.name;
    case "charArr": return "string";
    case "floatArr":
    case "intArr": return "number[]";
    case "structArr": return k.name + "[]";
    case "void": return "void";
  }
}

function emitTypes(h: ParsedHeader, ctx: { structNames: Set<string>; aliases: Map<string, string> }) {
  const out: string[] = [];
  out.push("// GENERATED by scripts/gen.ts — do not edit");
  out.push("");
  for (const s of h.structs) {
    out.push(`export interface ${s.name} {`);
    for (const f of s.fields) {
      const k = classifyType(f.type, ctx);
      const name = f.name.replace(/\[\d+\]$/, "");
      out.push(`  ${name}: ${tsFieldType(k)};`);
    }
    out.push("}");
    out.push("");
  }
  for (const e of h.enums) {
    out.push(`export enum ${e.name} {`);
    for (const mem of e.members) out.push(`  ${mem.name} = ${mem.value},`);
    out.push("}");
    out.push("");
  }
  if (h.colors.length) {
    for (const c of h.colors) {
      out.push(`export const ${c.name}: Color = { r: ${c.r}, g: ${c.g}, b: ${c.b}, a: ${c.a} };`);
    }
    out.push("");
  }
  // Factory helper (shares the Color type name; legal in TS).
  out.push("export function Color(r: number, g: number, b: number, a: number): Color {");
  out.push("  return { r, g, b, a };");
  out.push("}");
  out.push("");
  return out.join("\n");
}

function emitLayouts(h: ParsedHeader, argsLayouts: Map<string, StructLayoutInfo>) {
  const out: string[] = [];
  out.push("// GENERATED by scripts/gen.ts — do not edit");
  out.push('import type { StructLayout } from "./pack";');
  out.push("");

  const structNames = new Set(h.structs.map((s) => s.name));
  const ctx = { structs: new Map(h.structs.map((s) => [s.name, s])), aliases: h.aliases, structNames };
  const memo = new Map<string, StructLayoutInfo>();
  // topological order: dependencies first
  const order: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (n: string) => {
    if (visited.has(n)) return;
    if (visiting.has(n)) return;
    visiting.add(n);
    for (const f of ctx.structs.get(n)!.fields) {
      const k = classifyType(f.type, ctx);
      if ((k.kind === "struct" || k.kind === "structArr") && k.name !== n) visit(k.name);
    }
    visiting.delete(n);
    visited.add(n);
    order.push(n);
  };
  for (const s of h.structs) visit(s.name);
  for (const n of order) computeLayout(n, ctx.structs.get(n)!.fields, ctx, memo);

  out.push("export const Layouts: Record<string, StructLayout> = {");
  for (const n of order) {
    const l = memo.get(n)!;
    out.push(`  ${n}: ${layoutLiteral(l, memo, ctx)},`);
  }
  out.push("};");
  out.push("");

  out.push("export const ArgsLayouts: Record<string, StructLayout> = {");
  for (const [name, l] of argsLayouts) {
    out.push(`  ${name}: ${layoutLiteral(l, memo, ctx)},`);
  }
  out.push("};");
  out.push("");
  return out.join("\n");
}

function layoutLiteral(l: StructLayoutInfo, memo: Map<string, StructLayoutInfo>, ctx: any): string {
  const fields = l.fields
    .map((f) => {
      const extra: string[] = [];
      if (f.count !== undefined) extra.push(`count: ${f.count}`);
      if (f.structName) extra.push(`struct: ${layoutLiteral(memo.get(f.structName)!, memo, ctx)}`);
      const extraStr = extra.length ? ", " + extra.join(", ") : "";
      return `{ name: ${JSON.stringify(f.name)}, type: "${f.type}", offset: ${f.offset}, size: ${f.size}${extraStr} }`;
    })
    .join(", ");
  return `{ name: ${JSON.stringify(l.name)}, size: ${l.size}, align: ${l.align}, fields: [${fields}] }`;
}

// --- FFI ---

function emitFfi(
  direct: ClassifiedFn[],
  bridge: ClassifiedFn[],
  skipped: { fn: FnInfo; reason: string }[],
) {
  const out: string[] = [];
  out.push("// GENERATED by scripts/gen.ts — do not edit");
  out.push('import { dlopen, FFIType, suffix } from "bun:ffi";');
  out.push("");
  out.push("const LIB_PATH = import.meta.dirname + `/../raylib/lib/libraylib.${suffix}`;");
  out.push("const BRIDGE_PATH = import.meta.dirname + `/../raylib/lib/bridge.${suffix}`;");
  out.push("");

  // direct lib declarations
  out.push("export const lib = dlopen(LIB_PATH, {");
  for (const cf of direct) {
    const args = cf.params.map((p) => ffiArgType(p.kind)).join(", ");
    const ret = ffiReturnType(cf);
    out.push(`  ${cf.fn.name}: { args: [${args}], returns: FFIType.${ret} },`);
  }
  out.push("});");
  out.push("");

  // bridge declarations
  out.push("export const bridge = dlopen(BRIDGE_PATH, {");
  for (const cf of bridge) {
    const args: string[] = [];
    if (cf.params.length) args.push("FFIType.ptr");
    if (cf.retKind === "struct") args.push("FFIType.ptr");
    const ret = cf.retKind === "struct" ? "void" : ffiReturnType(cf);
    out.push(`  rlb_${cf.fn.name}: { args: [${args.join(", ")}], returns: FFIType.${ret} },`);
  }
  out.push("});");
  out.push("");
  out.push("export const L = lib.symbols;");
  out.push("export const B = bridge.symbols;");
  out.push("");

  if (skipped.length) {
    out.push(`// Skipped (not bindable via FFI): ${skipped.map((s) => s.fn.name).join(", ")}`);
    out.push("");
  }
  return out.join("\n");
}

function ffiArgType(kind: ParamKindInfo): string {
  switch (kind.kind) {
    case "scalar": return `FFIType.${SCALARS[kind.ctype]!.ffi}`;
    case "bool": return "FFIType.bool";
    case "cstring": return "FFIType.cstring";
    case "ptr":
    case "bufferPtr":
    case "structPtr":
    case "constStructPtr":
      return "FFIType.ptr";
    case "struct": return "FFIType.ptr"; // packed args struct — only used for bridge, but keep direct safe
  }
}

function ffiReturnType(cf: ClassifiedFn): string {
  switch (cf.retKind) {
    case "void": return "void";
    case "scalar": return cf.retScalar!.ffi;
    case "cstring": return "cstring";
    case "ptr": return "ptr";
    case "struct": return "void"; // out-param
  }
}

// --- bridge.c ---

function emitBridge(bridge: ClassifiedFn[], h: ParsedHeader, argsLayouts: Map<string, StructLayoutInfo>) {
  const out: string[] = [];
  out.push("// GENERATED by scripts/gen.ts — do not edit");
  out.push('#include "raylib.h"');
  out.push("#include <stddef.h> // offsetof");
  out.push("");
  out.push("// Struct-by-value wrappers. Every struct travels as raw memory (pointer);");
  out.push("// TS packs args per the same layout tables and verifies via static asserts below.");
  out.push("");

  const structNames = new Set(h.structs.map((s) => s.name));
  const ctx = { structs: new Map(h.structs.map((s) => [s.name, s])), aliases: h.aliases, structNames };

  for (const cf of bridge) {
    if (!cf.params.length) {
      // struct return only (e.g. rlb_GetMousePosition(Vector2 *out))
      const outType = cf.retStructName!;
      out.push(`void rlb_${cf.fn.name}(${outType} *out) {`);
      out.push(`    *out = ${cf.fn.name}();`);
      out.push("}");
      out.push("");
      continue;
    }
    // args struct
    out.push(`typedef struct {`);
    for (const p of cf.params) {
      const ctype = cParamType(p);
      out.push(`    ${ctype} ${sanitizeName(p.field.name)};`);
    }
    out.push(`} rlb_${cf.fn.name}_args;`);
    out.push("");

    const callParams = cf.params.map((p) => `a->${sanitizeName(p.field.name)}`).join(", ");
    if (cf.retKind === "struct") {
      out.push(`void rlb_${cf.fn.name}(const rlb_${cf.fn.name}_args *a, ${cf.retStructName} *out) {`);
      out.push(`    *out = ${cf.fn.name}(${callParams});`);
    } else {
      const retC = cf.retKind === "void" ? "void" : cf.retKind === "cstring" ? "const char *" : cf.retKind === "ptr" ? "void *" : cf.retScalar!.ctype;
      out.push(`${retC} rlb_${cf.fn.name}(const rlb_${cf.fn.name}_args *a) {`);
      out.push(`    return ${cf.fn.name}(${callParams});`);
    }
    out.push("}");
    out.push("");
  }

  // static layout verification
  out.push("// ===== Layout verification (offsets computed by scripts/gen.ts vs the C compiler) =====");
  out.push("");

  const memo = new Map<string, StructLayoutInfo>();
  for (const s of h.structs) computeLayout(s.name, s.fields, ctx, memo);
  for (const s of h.structs) {
    const l = memo.get(s.name)!;
    out.push(`_Static_assert(sizeof(${s.name}) == ${l.size}, \"size_${s.name}\");`);
    for (const f of l.fields) {
      out.push(`_Static_assert(offsetof(${s.name}, ${f.name}) == ${f.offset}, \"off_${s.name}_${f.name}\");`);
    }
  }
  out.push("");
  for (const [name, l] of argsLayouts) {
    out.push(`_Static_assert(sizeof(rlb_${name}_args) == ${l.size}, \"argsize_${name}\");`);
    for (const f of l.fields) {
      out.push(`_Static_assert(offsetof(rlb_${name}_args, ${sanitizeName(f.name)}) == ${f.offset}, \"argoff_${name}_${f.name}\");`);
    }
  }
  out.push("");

  return out.join("\n");
}

function sanitizeName(n: string): string {
  const base = n.replace(/\[\d+\]$/, "");
  return C_KEYWORDS.has(base) ? `p_${base}` : base;
}

function cParamType(p: { field: Field; kind: ParamKindInfo }): string {
  const f = p.field;
  switch (p.kind.kind) {
    case "scalar": return p.kind.ctype;
    case "bool": return "bool";
    case "cstring": return f.type.trim().startsWith("const") ? "const char *" : "char *";
    case "ptr": return f.type.trim().replace(/\s+$/, "");
    case "bufferPtr": return f.type.trim();
    case "structPtr": return `${p.kind.structName} *`;
    case "constStructPtr": return `const ${p.kind.structName} *`;
    case "struct": return p.kind.structName;
  }
}

// --- raylib.ts wrappers ---

function emitRaylib(direct: ClassifiedFn[], bridge: ClassifiedFn[], structNames: string[]) {
  const out: string[] = [];
  out.push("// GENERATED by scripts/gen.ts — do not edit");
  out.push('import { pack, unpack, cstr, ptr, toPtr, toPtrArray, structArrayPtr } from "./pack";');
  out.push('import { L, B } from "./ffi";');
  out.push('import { Layouts, ArgsLayouts } from "./layouts";');
  out.push(`import type { ${structNames.join(", ")} } from "./types";`);
  out.push("");

  for (const cf of direct) out.push(...wrapDirect(cf));
  for (const cf of bridge) out.push(...wrapBridge(cf));

  return out.join("\n");
}

function tsParamType(p: { field: Field; kind: ParamKindInfo }): string {
  switch (p.kind.kind) {
    case "scalar": return "number";
    case "bool": return "boolean";
    case "cstring": return "string";
    case "ptr": return "number";
    case "bufferPtr": return p.kind.ts;
    case "structPtr": return p.kind.structName;
    case "constStructPtr": return `${p.kind.structName}[] | number`;
    case "struct": return p.kind.structName;
  }
}

function tsRetType(cf: ClassifiedFn): string {
  switch (cf.retKind) {
    case "void": return "void";
    case "scalar": return cf.retScalar!.ts;
    case "cstring": return "string";
    case "ptr": return "number";
    case "struct": return cf.retStructName!;
  }
}

function wrapDirect(cf: ClassifiedFn): string[] {
  const out: string[] = [];
  const sig = `export function ${cf.fn.name}(${cf.params.map((p) => `${p.field.name}: ${tsParamType(p)}`).join(", ")}): ${tsRetType(cf)} {`;
  out.push(sig);

  const pre: string[] = [];
  const callArgs: string[] = [];
  let structIdx = 0;
  let strIdx = 0;
  for (const p of cf.params) {
    const n = p.field.name;
    switch (p.kind.kind) {
      case "scalar":
      case "bool":
        callArgs.push(n);
        break;
      case "cstring": {
        const v = `_s${strIdx++}`;
        pre.push(`const ${v} = cstr(${n});`);
        callArgs.push(`ptr(${v})`);
        break;
      }
      case "ptr":
        callArgs.push(`toPtr(${n})`);
        break;
      case "bufferPtr": {
        const v = p.kind.elem ? `toPtrArray(${n}, "${p.kind.elem}")` : `toPtr(${n})`;
        callArgs.push(v);
        break;
      }
      case "structPtr": {
        const v = `_b${structIdx++}`;
        pre.push(`const ${v} = pack(${n}, Layouts.${p.kind.structName}!);`);
        callArgs.push(v);
        break;
      }
      case "constStructPtr": {
        const v = `_a${structIdx++}`;
        pre.push(`const ${v} = structArrayPtr(${n}, Layouts.${p.kind.structName}!);`);
        callArgs.push(v);
        break;
      }
      case "struct":
        throw new Error("direct function cannot have struct-by-value param");
    }
  }
  for (const line of pre) out.push(`  ${line}`);
  const ret = cf.retKind;
  if (ret === "void") {
    out.push(`  L.${cf.fn.name}(${callArgs.join(", ")});`);
  } else if (ret === "cstring") {
    out.push(`  return L.${cf.fn.name}(${callArgs.join(", ")}) as unknown as string;`);
  } else if (ret === "ptr") {
    out.push(`  return L.${cf.fn.name}(${callArgs.join(", ")}) ?? 0;`);
  } else if (cf.retScalar!.ffi === "i64" || cf.retScalar!.ffi === "u64") {
    out.push(`  return Number(L.${cf.fn.name}(${callArgs.join(", ")}));`);
  } else {
    out.push(`  return L.${cf.fn.name}(${callArgs.join(", ")});`);
  }
  // write back in-place struct params
  let idx = 0;
  for (const p of cf.params) {
    if (p.kind.kind === "structPtr") {
      out.push(`  Object.assign(${p.field.name}, unpack(_b${idx++}, Layouts.${p.kind.structName}!));`);
    }
  }
  out.push("}");
  out.push("");
  return out;
}

function wrapBridge(cf: ClassifiedFn): string[] {
  const out: string[] = [];
  const sig = `export function ${cf.fn.name}(${cf.params.map((p) => `${p.field.name}: ${tsParamType(p)}`).join(", ")}): ${tsRetType(cf)} {`;
  out.push(sig);

  const pre: string[] = [];
  const argsObj: string[] = [];
  let strIdx = 0;
  let bufIdx = 0;

  for (const p of cf.params) {
    const n = p.field.name;
    switch (p.kind.kind) {
      case "scalar":
      case "bool":
        argsObj.push(`${n}: ${n}`);
        break;
      case "cstring": {
        const v = `_s${strIdx++}`;
        pre.push(`const ${v} = cstr(${n});`);
        argsObj.push(`${n}: ptr(${v})`);
        break;
      }
      case "ptr":
        argsObj.push(`${n}: toPtr(${n})`);
        break;
      case "bufferPtr": {
        const v = p.kind.elem ? `toPtrArray(${n}, "${p.kind.elem}")` : `toPtr(${n})`;
        argsObj.push(`${n}: ${v}`);
        break;
      }
      case "structPtr": {
        const v = `_b${bufIdx++}`;
        pre.push(`const ${v} = pack(${n}, Layouts.${p.kind.structName}!);`);
        argsObj.push(`${n}: ptr(${v})`);
        break;
      }
      case "constStructPtr": {
        const v = `_a${bufIdx++}`;
        pre.push(`const ${v} = structArrayPtr(${n}, Layouts.${p.kind.structName}!);`);
        argsObj.push(`${n}: ${v}`);
        break;
      }
      case "struct":
        argsObj.push(`${n}: ${n}`);
        break;
    }
  }

  for (const line of pre) out.push(`  ${line}`);

  const argsExpr = cf.params.length ? `pack({ ${argsObj.join(", ")} }, ArgsLayouts.${cf.fn.name}!)` : "undefined";
  const bridgeCall = `B.rlb_${cf.fn.name}(${cf.params.length ? argsExpr : ""}${cf.retKind === "struct" ? (cf.params.length ? ", " : "") + "_out" : ""})`;

  if (cf.retKind === "struct") {
    const layout = `Layouts.${cf.retStructName}!`;
    out.push(`  const _out = new Uint8Array(${layout}!.size);`);
    out.push(`  ${bridgeCall};`);
    out.push(`  return unpack(_out, ${layout});`);
  } else if (cf.retKind === "void") {
    out.push(`  ${bridgeCall};`);
  } else if (cf.retKind === "cstring") {
    out.push(`  return ${bridgeCall} as unknown as string;`);
  } else if (cf.retKind === "ptr") {
    out.push(`  return ${bridgeCall} ?? 0;`);
  } else if (cf.retScalar!.ffi === "i64" || cf.retScalar!.ffi === "u64") {
    out.push(`  return Number(${bridgeCall});`);
  } else {
    out.push(`  return ${bridgeCall};`);
  }

  // write back in-place struct params
  let idx = 0;
  for (const p of cf.params) {
    if (p.kind.kind === "structPtr") {
      out.push(`  Object.assign(${p.field.name}, unpack(_b${idx++}, Layouts.${p.kind.structName}!));`);
    }
  }
  out.push("}");
  out.push("");
  return out;
}

// ============================================================================
// 6. Main
// ============================================================================

async function main() {
  const src = await Bun.file(HEADER).text();
  const h = parseHeader(src);

  const structNames = new Set(h.structs.map((s) => s.name));
  const ctx = { structs: new Map(h.structs.map((s) => [s.name, s])), aliases: h.aliases, structNames };

  const direct: ClassifiedFn[] = [];
  const bridge: ClassifiedFn[] = [];
  const skipped: { fn: FnInfo; reason: string }[] = [];

  for (const fn of h.functions) {
    if (fn.varargs) {
      skipped.push({ fn, reason: "varargs" });
      continue;
    }
    if (fn.params.some((p) => p.type.includes("..."))) {
      skipped.push({ fn, reason: "varargs" });
      continue;
    }
    if (fn.params.some((p) => h.callbacks.has(p.type.trim()))) {
      skipped.push({ fn, reason: "callback param" });
      continue;
    }
    let classified: ClassifiedFn;
    try {
      const params = fn.params.map((field) => ({ field, kind: classifyParam(field, ctx) }));
      const ret = classifyReturn(fn.ret, ctx);
      classified = { fn, bridge: false, skip: false, params, ...ret };
    } catch (e) {
      skipped.push({ fn, reason: (e as Error).message });
      continue;
    }
    const hasStructByValue = classified.params.some((p) => p.kind.kind === "struct");
    classified.bridge = hasStructByValue || classified.retKind === "struct";
    (classified.bridge ? bridge : direct).push(classified);
  }

  // args layouts for bridge functions
  const argsLayouts = new Map<string, StructLayoutInfo>();
  const memo = new Map<string, StructLayoutInfo>();
  for (const cf of bridge) {
    if (!cf.params.length) continue;
    const layout = computeLayout(`rlb_${cf.fn.name}_args`, cf.params.map((p) => p.field), ctx, memo);
    argsLayouts.set(cf.fn.name, layout);
  }

  const files: [string, string][] = [
    [OUT("types.ts"), emitTypes(h, ctx)],
    [OUT("layouts.ts"), emitLayouts(h, argsLayouts)],
    [OUT("ffi.ts"), emitFfi(direct, bridge, skipped)],
    [OUT("bridge.c"), emitBridge(bridge, h, argsLayouts)],
    [OUT("raylib.ts"), emitRaylib(direct, bridge, h.structs.map((s) => s.name))],
  ];

  for (const [path, content] of files) {
    await Bun.write(path, content);
    console.log(`generated ${basename(path)} (${content.split("\n").length} lines)`);
  }

  console.log("");
  console.log(`functions: ${h.functions.length}  direct: ${direct.length}  bridge: ${bridge.length}  skipped: ${skipped.length}`);
  if (skipped.length) {
    console.log("skipped:");
    for (const s of skipped) console.log(`  - ${s.fn.name}: ${s.reason}`);
  }
}

await main();
