// src/index.ts
import fs from "node:fs/promises";
import path from "node:path";
import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface Options {
  sourceDir: string; // 원본 이미지 위치
  targetDir: string; // public 디렉토리
  publicPath: string; // 웹 접근 경로
}

async function copyImage(source: string, target: string) {
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
    return true;
  } catch (error) {
    console.error(`Failed to copy image from ${source} to ${target}:`, error);
    return false;
  }
}

const rehypeImages: Plugin<[Options], Root> = (options: Options) => {
  return async (tree) => {
    const promises: Promise<void>[] = [];

    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img" && node.properties?.src) {
        const imageSrc = node.properties.src as string;

        if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
          return;
        }

        const sourcePath = path.join(options.sourceDir, imageSrc);
        const targetPath = path.join(options.targetDir, imageSrc);

        promises.push(
          copyImage(sourcePath, targetPath).then((success) => {
            if (success) {
              // 웹 경로로 변환
              node.properties!.src = path.posix.join(
                options.publicPath,
                imageSrc,
              );
            }
          }),
        );
      }
    });

    await Promise.all(promises);
  };
};

export default rehypeImages;
