import fs from "node:fs/promises";
import path from "node:path";
import { Element, Root } from "hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";

interface Options {
  sourceDir: string; // 옵시디언 이미지가 있는 디렉토리
  targetDir: string; // 웹 앱의 public 디렉토리
  publicPath: string; // 웹에서 접근할 경로 (예: /images)
}

async function copyImage(source: string, target: string) {
  try {
    // 타겟 디렉토리 생성
    await fs.mkdir(path.dirname(target), { recursive: true });
    // 이미지 복사
    await fs.copyFile(source, target);
    return true;
  } catch (error) {
    console.error("Failed to copy image:", error);
    return false;
  }
}

const rehypeImages: Plugin<[Options], Root> = (options: Options) => {
  return async (tree, file: VFile) => {
    const promises: Promise<void>[] = [];

    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img" && typeof node.properties?.src === "string") {
        const sourcePath = path.join(options.sourceDir, node.properties.src);
        const targetPath = path.join(options.targetDir, node.properties.src);

        promises.push(
          copyImage(sourcePath, targetPath).then((success) => {
            if (success) {
              // 복사 성공시 src 경로를 publicPath 기준으로 변경
              node.properties!.src = path.join(
                options.publicPath,
                node.properties!.src as string,
              );
            }
          }),
        );
      }
    });

    // 모든 이미지 복사 작업 완료 대기
    await Promise.all(promises);
  };
};

export default rehypeImages;
