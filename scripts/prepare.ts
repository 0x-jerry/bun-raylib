import { $ } from "bun";

const REPO = "raysan5/raylib";
const RELEASES_API = `https://api.github.com/repos/${REPO}/releases/latest`;

function getPlatformKey(): string {
  const platform = process.platform;
  const arch = process.arch;

  switch (platform) {
    case "darwin":
      return "macos";
    case "linux":
      return `linux_${arch === "arm64" ? "arm64" : arch === "ia32" ? "i386" : "amd64"}`;
    case "win32": {
      const winArch = process.env.PROCESSOR_ARCHITECTURE ?? arch;
      if (winArch === "ARM64") {
        const msvc = process.env.GENERATOR ?? "msvc16";
        return `winarm64_${msvc}`;
      }
      const is64 = winArch === "AMD64" || winArch === "x64";
      const bits = is64 ? "win64" : "win32";
      const toolchain = "mingw-w64";
      return `${bits}_${toolchain}`;
    }
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

const PLATFORM_KEY = getPlatformKey();

console.log(`Platform: ${process.platform} ${process.arch} -> key: ${PLATFORM_KEY}`);

const releaseResp = await fetch(RELEASES_API);
if (!releaseResp.ok) {
  throw new Error(`Failed to fetch release: ${releaseResp.status}`);
}

const release: any = await releaseResp.json();
const tagName: string = release.tag_name;
const version = tagName.startsWith("v") ? tagName.slice(1) : tagName;

console.log(`Latest release: ${tagName}`);

const asset = release.assets.find((a: any) => a.name.includes(PLATFORM_KEY));

if (!asset) {
  console.error("Available assets:");
  release.assets.forEach((a: any) => console.error(`  - ${a.name}`));
  throw new Error(`No asset found for platform key: ${PLATFORM_KEY}`);
}

const assetExt = asset.name.endsWith(".tar.gz") ? ".tar.gz" : ".zip";

const raylibDir = import.meta.dirname + "/../raylib";

const shouldDownload = !(await Bun.file(raylibDir).exists());

if (!shouldDownload) {
  console.log("raylib already exists, skipping download.");
  process.exit(0);
}

const tmpDir = import.meta.dirname + "/../raylib_tmp";
const tmpFile = `${tmpDir}/raylib${assetExt}`;

await $`rm -rf ${tmpDir} ${raylibDir}`;
await $`mkdir -p ${tmpDir} ${raylibDir}`;

console.log(`Downloading ${asset.name}...`);
const assetResp = await fetch(asset.browser_download_url);
if (!assetResp.ok) {
  throw new Error(`Failed to download asset: ${assetResp.status}`);
}

await Bun.write(tmpFile, assetResp);

console.log("Extracting...");

if (assetExt === ".tar.gz") {
  await $`tar xzf ${tmpFile} -C ${tmpDir}`;
} else {
  await $`unzip -o ${tmpFile} -d ${tmpDir}`;
}

const extractedName = asset.name.replace(/\.(tar\.gz|zip)$/, "");
await $`mv ${tmpDir}/${extractedName}/* ${raylibDir}/`;
await $`rm -rf ${tmpDir}`;

console.log("Done.");
