import fs from "node:fs/promises";
import path from "node:path";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import rehypeImages from "./index.js";

describe("rehypeImages", () => {
  const sourceDir = path.join(__dirname, "test-source");
  const targetDir = path.join(__dirname, "test-target");

  // 테스트 전 설정
  beforeAll(async () => {
    await fs.mkdir(sourceDir, { recursive: true });
    // 테스트 이미지 생성
    await fs.writeFile(path.join(sourceDir, "test.jpg"), "fake image content");
    await fs.mkdir(path.join(sourceDir, "subfolder"), { recursive: true });
    await fs.writeFile(
      path.join(sourceDir, "subfolder/nested.png"),
      "nested image content",
    );
  });

  // 테스트 후 정리
  afterAll(async () => {
    await fs.rm(sourceDir, { recursive: true, force: true });
    await fs.rm(targetDir, { recursive: true, force: true });
  });

  it("should copy image and update src path", async () => {
    const html = '<img src="test.jpg">';

    const result = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeImages, {
        sourceDir,
        targetDir,
        publicPath: "/images",
      })
      .use(rehypeStringify)
      .process(html);

    // src 속성이 올바르게 변경되었는지 확인
    expect(String(result)).toBe('<img src="/images/test.jpg">');

    // 이미지가 실제로 복사되었는지 확인
    const copiedContent = await fs.readFile(
      path.join(targetDir, "test.jpg"),
      "utf-8",
    );
    expect(copiedContent).toBe("fake image content");
  });

  it("should handle nested folder structure", async () => {
    const html = '<img src="subfolder/nested.png">';

    const result = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeImages, {
        sourceDir,
        targetDir,
        publicPath: "/images",
      })
      .use(rehypeStringify)
      .process(html);

    expect(String(result)).toBe('<img src="/images/subfolder/nested.png">');

    const copiedContent = await fs.readFile(
      path.join(targetDir, "subfolder/nested.png"),
      "utf-8",
    );
    expect(copiedContent).toBe("nested image content");
  });

  it("should ignore external URLs", async () => {
    const html = '<img src="https://example.com/image.jpg">';

    const result = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeImages, {
        sourceDir,
        targetDir,
        publicPath: "/images",
      })
      .use(rehypeStringify)
      .process(html);

    expect(String(result)).toBe(html);
  });

  it("should handle multiple images in one HTML", async () => {
    const html = `
      <div>
        <img src="test.jpg">
        <img src="subfolder/nested.png">
        <img src="https://example.com/image.jpg">
      </div>
    `;

    const result = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeImages, {
        sourceDir,
        targetDir,
        publicPath: "/images",
      })
      .use(rehypeStringify)
      .process(html);

    const output = String(result);
    expect(output).toContain('<img src="/images/test.jpg">');
    expect(output).toContain('<img src="/images/subfolder/nested.png">');
    expect(output).toContain('<img src="https://example.com/image.jpg">');
  });

  it("should handle missing source files gracefully", async () => {
    const html = '<img src="missing.jpg">';

    const result = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeImages, {
        sourceDir,
        targetDir,
        publicPath: "/images",
      })
      .use(rehypeStringify)
      .process(html);

    // 파일이 없을 경우 원본 경로를 유지
    expect(String(result)).toBe(html);
  });
});
