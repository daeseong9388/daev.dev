import fs from "node:fs/promises";
import path from "node:path";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import rehypeImages from "./index.js";

describe("rehypeImages", () => {
  it("should copy images and update paths", async () => {
    const html = '<img src="test.jpg">';

    // 테스트용 임시 디렉토리 설정
    const sourceDir = path.join(__dirname, "test-source");
    const targetDir = path.join(__dirname, "test-target");

    // 테스트 이미지 생성
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.writeFile(path.join(sourceDir, "test.jpg"), "fake image");

    const result = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeImages, {
        sourceDir,
        targetDir,
        publicPath: "/images",
      })
      .use(rehypeStringify)
      .process(html);

    expect(String(result)).toBe('<img src="/images/test.jpg">');

    // 이미지가 복사되었는지 확인
    const copied = await fs.readFile(path.join(targetDir, "test.jpg"), "utf8");
    expect(copied).toBe("fake image");

    // 청소
    await fs.rm(sourceDir, { recursive: true });
    await fs.rm(targetDir, { recursive: true });
  });
});
