/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "<TYPES>", // 타입 import를 최상단에
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)", // react 관련
    "^(next/(.*)$)|^(next$)", // next.js 관련
    "<THIRD_PARTY_MODULES>", // 외부 라이브러리
    "^@repo/(.*)$", // 모노레포 내부 패키지
    "^@/", // 프로젝트 내부 절대 경로
    "^~/", // 프로젝트 내부 절대 경로 (별칭)
    "^[../]", // 상대 경로 (부모 디렉토리)
    "^[./]", // 현재 디렉토리 상대 경로
    "", // 빈 줄로 구분
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.4.0",
  overrides: [
    {
      files: "*.json.hbs",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.js.hbs",
      options: {
        parser: "babel",
      },
    },
  ],
};

export default config;
