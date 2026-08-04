// amazon-ivs-player のワーカー/wasmファイルは配信時に公開URLとして
// 読み込む必要があるため、npm install のたびに public/ivs-player へコピーする。
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(
  __dirname,
  "..",
  "node_modules",
  "amazon-ivs-player",
  "dist",
  "assets"
);
const DEST_DIR = path.join(__dirname, "..", "public", "ivs-player");

const FILES = [
  "amazon-ivs-wasmworker.min.js",
  "amazon-ivs-wasmworker.min.wasm",
  "amazon-ivs-worker.min.js",
];

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.warn(
      "[copy-ivs-assets] amazon-ivs-player が見つかりません。npm install が完了しているか確認してください。"
    );
    return;
  }

  fs.mkdirSync(DEST_DIR, { recursive: true });

  for (const file of FILES) {
    const src = path.join(SRC_DIR, file);
    const dest = path.join(DEST_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`[copy-ivs-assets] ${file} をコピーしました`);
    }
  }
}

main();
