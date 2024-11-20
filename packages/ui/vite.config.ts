import { copyFile } from "node:fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import packageJson from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

// exports 필드에서 entry points와 type paths 추출
const extractPaths = () => {
  const entries: Record<string, string> = {};

  Object.entries(packageJson.exports).forEach(([key]) => {
    // style.css는 제외
    if (key === "./style.css") return;

    // "." -> "index"
    // "./components" -> "components/index"
    const normalizedKey =
      key === "." ? "index" : `${key.replace("./", "")}/index`;

    entries[normalizedKey] =
      normalizedKey === "index"
        ? resolve(__dirname, "src/index.ts")
        : resolve(__dirname, "src", normalizedKey + ".ts");
  });

  return entries;
};

const entries = extractPaths();

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    vanillaExtractPlugin({
      identifiers: "debug",
    }),
    dts({
      include: ["src"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/**/*.stories.css.ts",
        "src/**/*.test.tsx",
      ],
      afterBuild: async (emittedFiles) => {
        const dtsFiles = Array.from(emittedFiles.keys()).filter(
          (file) => file.endsWith(".d.ts") && !file.endsWith(".d.ts.map"),
        );

        try {
          await Promise.all(
            dtsFiles.map(async (dtsPath) => {
              const mtsPath = dtsPath.replace(".d.ts", ".d.mts");
              await copyFile(dtsPath, mtsPath);
            }),
          );
          console.log("All type definition files copied successfully!");
        } catch (error) {
          console.error("Error copying type definition files:", error);
        }
      },
    }),
  ],
  build: {
    sourcemap: false,
    lib: {
      entry: entries,
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const extension = format === "es" ? "mjs" : "js";
        return `${entryName}.${extension}`;
      },
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        preserveModules: false,
        exports: "named",
      },
    },
  },
});
