import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // amazon-ivs-player のビルド済みワーカー資産(サードパーティ、lint対象外)
    "public/ivs-player/**",
    // npm postinstall用のプレーンNode CJSスクリプト
    "scripts/copy-ivs-assets.js",
  ]),
]);

export default eslintConfig;
