import type { Effects, State } from "micromark-util-types";
import { describe, expect, it, vi } from "vitest";
import { createTokenizer } from "./syntax.js";

describe("markdown tokenizer", () => {
  interface TestContext {
    effects: Effects;
    ok: State;
    nok: State;
  }

  function createTest(input: string, options = {}): TestContext {
    const effects: Effects = {
      enter: vi.fn(),
      exit: vi.fn(),
      consume: vi.fn(),
    };

    const ok: State = vi.fn(() => ok) as State;
    const nok: State = vi.fn(() => nok) as State;

    // type에 따라 시작 문자 결정
    const startChar = options?.type === "embed" ? 33 : 91; // ! or [
    let state = createTokenizer(options).text[startChar].tokenize(
      effects,
      ok,
      nok,
    );

    for (const char of input) {
      state = state(char.charCodeAt(0));
    }
    state(null);

    return { effects, ok, nok };
  }

  describe("basic wiki link", () => {
    it("should parse [[page]]", () => {
      const { effects, ok, nok } = createTest("[[page]]");

      expect(effects.enter).toHaveBeenCalledWith("wikiLink");
      expect(effects.enter).toHaveBeenCalledWith("wikiLinkTarget");
      expect(ok).toHaveBeenCalled();
      expect(nok).not.toHaveBeenCalled();
    });
  });

  describe("wiki link with alias", () => {
    it("should parse [[page|alias]]", () => {
      const { effects, ok, nok } = createTest("[[page|alias]]");

      expect(effects.enter).toHaveBeenCalledWith("wikiLinkAlias");
      expect(ok).toHaveBeenCalled();
      expect(nok).not.toHaveBeenCalled();
    });
  });

  describe("invalid wiki links", () => {
    const invalidCases = [
      ["empty link", "[[]]"],
      ["single bracket", "[page]"],
      ["unclosed link", "[[page"],
      ["link with newline", "[[page\ntext]]"],
      ["empty alias", "[[page|]]"],
    ] as const;

    it.each(invalidCases)("should reject %s: %s", (_, input) => {
      const { nok } = createTest(input);
      expect(nok).toHaveBeenCalled();
    });
  });

  describe("custom alias divider", () => {
    it("should use custom divider", () => {
      const { effects, ok } = createTest("[[page:alias]]", {
        aliasDivider: ":",
      });

      expect(effects.enter).toHaveBeenCalledWith("wikiLinkAlias");
      expect(ok).toHaveBeenCalled();
    });
  });

  describe("embed link", () => {
    describe("basic embed", () => {
      it("should parse ![[page]]", () => {
        const { effects, ok, nok } = createTest("![[page]]", { type: "embed" });

        expect(effects.enter).toHaveBeenCalledWith("embedLink");
        expect(effects.enter).toHaveBeenCalledWith("embedLinkTarget");
        expect(ok).toHaveBeenCalled();
        expect(nok).not.toHaveBeenCalled();
      });
    });

    describe("embed with alias", () => {
      it("should parse ![[page|alias]]", () => {
        const { effects, ok, nok } = createTest("![[page|alias]]", {
          type: "embed",
        });

        expect(effects.enter).toHaveBeenCalledWith("embedLinkAlias");
        expect(ok).toHaveBeenCalled();
        expect(nok).not.toHaveBeenCalled();
      });
    });

    describe("invalid embed links", () => {
      const invalidCases = [
        ["empty embed", "![[]]"],
        ["missing !", "[[page]]"],
        ["unclosed embed", "![[page"],
        ["embed with newline", "![[page\ntext]]"],
        ["empty alias", "![[page|]]"],
      ] as const;

      it.each(invalidCases)("should reject %s: %s", (_, input) => {
        const { nok } = createTest(input, { type: "embed" });
        expect(nok).toHaveBeenCalled();
      });
    });

    describe("custom alias divider in embed", () => {
      it("should use custom divider", () => {
        const { effects, ok } = createTest("![[page:alias]]", {
          type: "embed",
          aliasDivider: ":",
        });

        expect(effects.enter).toHaveBeenCalledWith("embedLinkAlias");
        expect(ok).toHaveBeenCalled();
      });
    });
  });
});
