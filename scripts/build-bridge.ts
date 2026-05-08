import { $ } from "bun";
import { suffix } from "bun:ffi";

const RAYLIB_DIR = import.meta.dirname + "/../raylib";

const platform = process.platform;
const libName = `bridge.${suffix}`;

const source = import.meta.dirname + "/../src/bridge.c";
const include = `${RAYLIB_DIR}/include`;
const lib = `${RAYLIB_DIR}/lib`;
const output = `${lib}/${libName}`;

const extraFlags = platform === "linux" ? ["-fPIC"] : [];

await $`cc -shared ${extraFlags} -o ${output} ${source} -I ${include} -L ${lib} -lraylib`;

console.log(`Built: ${output}`);
