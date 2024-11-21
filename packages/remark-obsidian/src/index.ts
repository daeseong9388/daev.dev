import type { FromMarkdownOptions } from "./from-markdown.js";
import type { Extension as MdastExtension } from "mdast-util-from-markdown";
import type { Extension as MicromarkExtension } from "micromark-util-types";
import type { Plugin } from "unified";
import { fromMarkdown } from "./from-markdown.js";
import { embedLinkSyntax, wikiLinkSyntax } from "./syntax.js";

interface RemarkObsidianOptions extends FromMarkdownOptions {
  aliasDivider?: string;
}

// unified의 Data 타입 확장 수정
declare module "unified" {
  interface Data {
    micromarkExtensions?: MicromarkExtension[];
    fromMarkdownExtensions?: (MdastExtension | MdastExtension[])[];
  }
}

const remarkObsidian: Plugin<[RemarkObsidianOptions?]> = function (
  options: RemarkObsidianOptions = {},
) {
  const data = this.data();

  data.micromarkExtensions = data.micromarkExtensions || [];
  data.fromMarkdownExtensions = data.fromMarkdownExtensions || [];

  data.micromarkExtensions.push({
    text: {
      ...wikiLinkSyntax.text,
      ...embedLinkSyntax.text,
    },
  });

  data.fromMarkdownExtensions.push(fromMarkdown(options));
};

export default remarkObsidian;
