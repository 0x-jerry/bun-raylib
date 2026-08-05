// Runtime helpers for generated struct packing/unpacking.
// Layouts are produced by scripts/gen.ts and live in src/layouts.ts.
import { ptr } from "bun:ffi";
import type { Pointer } from "bun:ffi";

export { ptr } from "bun:ffi";

export type FieldType =
  | "f32" | "f64" | "i32" | "u32" | "i16" | "u16" | "i8" | "u8"
  | "bool" | "i64" | "u64" | "ptr"
  | "struct" | "structArr" | "charArr" | "floatArr" | "intArr";

export interface StructLayout {
  name: string;
  size: number;
  align: number;
  fields: FieldLayout[];
}

export interface FieldLayout {
  name: string;
  type: FieldType;
  offset: number;
  size: number;
  /** Element count for array kinds (charArr/structArr/floatArr/intArr). */
  count?: number;
  /** Nested layout for struct/structArr fields. */
  struct?: StructLayout;
}

/** NUL-terminated copy of a string, kept alive by the caller for the duration of the FFI call. */
export function cstr(text: string): Uint8Array {
  const bytes = new TextEncoder().encode(text);
  const buf = new Uint8Array(bytes.length + 1);
  buf.set(bytes);
  return buf;
}

/** Write `obj` into `view` at absolute offset `base` following `layout`. */
export function packInto(view: DataView, obj: any, layout: StructLayout, base: number): void {
  for (const f of layout.fields) {
    const off = base + f.offset;
    const v = obj?.[f.name];
    switch (f.type) {
      case "f32": view.setFloat32(off, v, true); break;
      case "f64": view.setFloat64(off, v, true); break;
      case "i32": view.setInt32(off, v, true); break;
      case "u32": view.setUint32(off, v, true); break;
      case "i16": view.setInt16(off, v, true); break;
      case "u16": view.setUint16(off, v, true); break;
      case "i8": view.setInt8(off, v); break;
      case "u8": view.setUint8(off, v); break;
      case "bool": view.setUint8(off, v ? 1 : 0); break;
      case "i64": view.setBigInt64(off, BigInt(v ?? 0), true); break;
      case "u64":
      case "ptr": view.setBigUint64(off, BigInt(v ?? 0), true); break;
      case "charArr": {
        const s = v == null ? "" : String(v);
        for (let i = 0; i < f.size; i++) view.setUint8(off + i, i < s.length ? s.charCodeAt(i) : 0);
        break;
      }
      case "struct": packInto(view, v ?? {}, f.struct!, off); break;
      case "structArr": {
        const items = v ?? [];
        const l = f.struct!;
        const n = Math.min(f.count ?? items.length, items.length);
        for (let i = 0; i < n; i++) packInto(view, items[i], l, off + i * l.size);
        break;
      }
      case "floatArr": {
        const items = v ?? [];
        const n = Math.min(f.count ?? items.length, items.length);
        for (let i = 0; i < n; i++) view.setFloat32(off + i * 4, items[i], true);
        break;
      }
      case "intArr": {
        const items = v ?? [];
        const n = Math.min(f.count ?? items.length, items.length);
        for (let i = 0; i < n; i++) view.setInt32(off + i * 4, items[i], true);
        break;
      }
    }
  }
}

/** Allocate a packed copy of `obj` per `layout`. */
export function pack(obj: any, layout: StructLayout): Uint8Array {
  const buf = new Uint8Array(layout.size);
  packInto(new DataView(buf.buffer), obj, layout, 0);
  return buf;
}

/** Read a struct out of `buf` per `layout`. */
export function unpack(buf: Uint8Array | ArrayBuffer, layout: StructLayout): any {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  return unpackField(view, layout, 0);
}

function unpackField(view: DataView, layout: StructLayout, base: number): any {
  const out: any = {};
  for (const f of layout.fields) {
    const off = base + f.offset;
    switch (f.type) {
      case "f32": out[f.name] = view.getFloat32(off, true); break;
      case "f64": out[f.name] = view.getFloat64(off, true); break;
      case "i32": out[f.name] = view.getInt32(off, true); break;
      case "u32": out[f.name] = view.getUint32(off, true); break;
      case "i16": out[f.name] = view.getInt16(off, true); break;
      case "u16": out[f.name] = view.getUint16(off, true); break;
      case "i8": out[f.name] = view.getInt8(off); break;
      case "u8": out[f.name] = view.getUint8(off); break;
      case "bool": out[f.name] = view.getUint8(off) !== 0; break;
      case "i64": out[f.name] = Number(view.getBigInt64(off, true)); break;
      case "u64":
      case "ptr": out[f.name] = Number(view.getBigUint64(off, true)); break;
      case "charArr": {
        let s = "";
        for (let i = 0; i < f.size; i++) {
          const c = view.getUint8(off + i);
          if (c === 0) break;
          s += String.fromCharCode(c);
        }
        out[f.name] = s;
        break;
      }
      case "struct": out[f.name] = unpackField(view, f.struct!, off); break;
      case "structArr": {
        const arr: any[] = [];
        const l = f.struct!;
        for (let i = 0; i < (f.count ?? 0); i++) arr.push(unpackField(view, l, off + i * l.size));
        out[f.name] = arr;
        break;
      }
      case "floatArr": {
        const arr: number[] = [];
        for (let i = 0; i < (f.count ?? 0); i++) arr.push(view.getFloat32(off + i * 4, true));
        out[f.name] = arr;
        break;
      }
      case "intArr": {
        const arr: number[] = [];
        for (let i = 0; i < (f.count ?? 0); i++) arr.push(view.getInt32(off + i * 4, true));
        out[f.name] = arr;
        break;
      }
    }
  }
  return out;
}

/** Accept a raw pointer number or any buffer; returns a raw pointer. */
export function toPtr(v: any): Pointer {
  if (typeof v === "number") return v as Pointer;
  if (v instanceof ArrayBuffer) return ptr(v);
  if (ArrayBuffer.isView(v)) return ptr(v as Uint8Array);
  throw new TypeError("expected a pointer number or a buffer, got " + typeof v);
}

/** Accept a raw pointer or a JS array / typed array of scalar elements. */
export function toPtrArray(v: any, elem: "float" | "int" | "uchar"): Pointer {
  if (typeof v === "number") return v as Pointer;
  if (ArrayBuffer.isView(v)) return ptr(v as Uint8Array);
  if (Array.isArray(v)) {
    const arr = elem === "float" ? new Float32Array(v) : elem === "int" ? new Int32Array(v) : new Uint8Array(v);
    return ptr(arr);
  }
  throw new TypeError("expected a pointer number or an array, got " + typeof v);
}

/** Accept a raw pointer or an array of structs; packs the array and returns its pointer. */
export function structArrayPtr(v: any, layout: StructLayout): Pointer {
  if (typeof v === "number") return v as Pointer;
  if (v == null) return 0 as Pointer;
  const n = v.length;
  const buf = new Uint8Array(n * layout.size);
  const view = new DataView(buf.buffer);
  for (let i = 0; i < n; i++) packInto(view, v[i], layout, i * layout.size);
  return ptr(buf);
}
