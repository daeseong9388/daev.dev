import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import remarkObsidian from "./index.js";

describe("remark-obsidian", () => {
  const process = async (markdown: string) => {
    const result = await unified()
      .use(remarkParse)
      .use(remarkObsidian)
      .use(remarkHtml)
      .process(markdown);

    return String(result).trim(); // trim() 추가
  };

  describe("Wiki Links", () => {
    it("should transform basic wiki links", async () => {
      const input = "[[page]]";
      const output = await process(input);
      expect(output).toBe('<p><a href="page">page</a></p>');
    });

    it("should transform wiki links with aliases", async () => {
      const input = "[[page|Custom Name]]";
      const output = await process(input);
      expect(output).toBe('<p><a href="page">Custom Name</a></p>');
    });

    it("should handle multiple wiki links in one line", async () => {
      const input = "[[page1]] and [[page2|Name2]]";
      const output = await process(input);
      expect(output).toBe(
        '<p><a href="page1">page1</a> and <a href="page2">Name2</a></p>',
      );
    });
  });

  describe("Embed Links", () => {
    it("should transform basic embed links", async () => {
      const input = "![[image.png]]";
      const output = await process(input);
      expect(output).toBe('<p><img src="image.png" alt="image.png"></p>');
    });

    it("should transform embed links with alt text", async () => {
      const input = "![[photo.jpg|My Photo]]";
      const output = await process(input);
      expect(output).toBe('<p><img src="photo.jpg" alt="My Photo"></p>');
    });

    it("should handle multiple embed links in one line", async () => {
      const input = "![[img1.png]] and ![[img2.jpg|Photo 2]]";
      const output = await process(input);
      expect(output).toBe(
        '<p><img src="img1.png" alt="img1.png"> and <img src="img2.jpg" alt="Photo 2"></p>',
      );
    });
  });

  describe("Mixed Content", () => {
    it("should handle mixed wiki and embed links", async () => {
      const input = "Check [[page]] and ![[image.png]] here";
      const output = await process(input);
      expect(output).toBe(
        '<p>Check <a href="page">page</a> and <img src="image.png" alt="image.png"> here</p>',
      );
    });

    it("should handle links with surrounding text", async () => {
      const input = "Text before [[page|Name]] and ![[img.png|Alt]] text after";
      const output = await process(input);
      expect(output).toBe(
        '<p>Text before <a href="page">Name</a> and <img src="img.png" alt="Alt"> text after</p>',
      );
    });
  });

  describe("Options", () => {
    it("should apply transform functions", async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkObsidian, {
          linkTextTransform: (text) => text.toUpperCase(),
          displayTextTransform: (text) => text.toLowerCase(),
          imagePathTransform: (path) => `/images/${path}`,
        })
        .use(remarkHtml);

      const input = "[[page|Name]] and ![[img.png|Alt]]";
      const output = await processor.process(input);

      expect(String(output).trim()).toBe(
        '<p><a href="PAGE">name</a> and <img src="/images/img.png" alt="alt"></p>',
      );
    });
  });
});
