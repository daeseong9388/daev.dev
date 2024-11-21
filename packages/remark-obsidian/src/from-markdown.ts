import type { Node, PhrasingContent } from "mdast";
import type { CompileContext, Token } from "mdast-util-from-markdown";

interface WikiLinkNode extends Omit<PhrasingContent, "type"> {
  type: "wikiLink";
  value: string;
  data: {
    alias: string | null;
    hName: "a";
    hProperties: {
      href: string;
    };
    hChildren: Array<{
      type: "text";
      value: string;
    }>;
  };
}

interface EmbedLinkNode extends Omit<PhrasingContent, "type"> {
  type: "embedLink";
  value: string;
  data: {
    alias: string | null;
    hName: "img";
    hProperties: {
      src: string;
      alt: string;
    };
  };
}

/**
 * 1. `Nodes = Root | RootContent` 타입은 마크다운 AST에서 사용할 수 있는 모든 노드 타입을 의미합니다
 * 2. `RootContentMap`을 확장함으로써 우리의 커스텀 노드(`WikiLinkNode`, `EmbedLinkNode`)가 `RootContent`의 일부가 되고
 * 3. 결과적으로 `Nodes` 타입에도 포함되어 `enter` 메서드에서 사용할 수 있게 된 것입니다
 */

declare module "mdast" {
  interface RootContentMap {
    wikiLink: WikiLinkNode;
    embedLink: EmbedLinkNode;
  }
}

type LinkNode = WikiLinkNode | EmbedLinkNode;

interface FromMarkdownOptions {
  linkTextTransform?: (text: string) => string;
  displayTextTransform?: (text: string) => string;
  imagePathTransform?: (path: string) => string;
}

function fromMarkdown(opts: FromMarkdownOptions = {}) {
  const linkTextTransform = opts.linkTextTransform || ((text) => text);
  const displayTextTransform = opts.displayTextTransform || ((text) => text);
  const imagePathTransform = opts.imagePathTransform || ((path) => path);

  let node: LinkNode;

  function top(stack: Array<Node>): LinkNode {
    return stack[stack.length - 1] as LinkNode;
  }

  function enterWikiLink(this: CompileContext, token: Token) {
    node = {
      type: "wikiLink",
      value: "",
      data: {
        alias: null,
        hName: "a",
        hProperties: {
          href: "",
        },
        hChildren: [
          {
            type: "text",
            value: "",
          },
        ],
      },
    };
    this.enter(node, token);
  }

  function exitWikiLinkTarget(this: CompileContext, token: Token) {
    const target = this.sliceSerialize(token);
    const current = top(this.stack) as WikiLinkNode;
    current.value = linkTextTransform(target);
    current.data.hProperties.href = current.value;
  }

  function exitWikiLinkAlias(this: CompileContext, token: Token) {
    const alias = this.sliceSerialize(token);
    const current = top(this.stack) as WikiLinkNode;
    current.data.alias = displayTextTransform(alias);
  }

  function exitWikiLink(this: CompileContext, token: Token) {
    const current = top(this.stack) as WikiLinkNode;
    if (!current?.data?.hChildren?.[0]) return;
    current.data.hChildren[0].value = current.data.alias || current.value;
    this.exit(token);
  }

  function enterEmbedLink(this: CompileContext, token: Token) {
    node = {
      type: "embedLink",
      value: "",
      data: {
        alias: null,
        hName: "img",
        hProperties: {
          src: "",
          alt: "",
        },
      },
    };
    this.enter(node, token);
  }

  function exitEmbedLinkTarget(this: CompileContext, token: Token) {
    const target = this.sliceSerialize(token);
    const current = top(this.stack) as EmbedLinkNode;
    current.value = imagePathTransform(target);
    current.data.hProperties.src = current.value;
    current.data.hProperties.alt = current.value;
  }

  function exitEmbedLinkAlias(this: CompileContext, token: Token) {
    const alias = this.sliceSerialize(token);
    const current = top(this.stack) as EmbedLinkNode;
    current.data.alias = displayTextTransform(alias);
    current.data.hProperties.alt = current.data.alias;
  }

  function exitEmbedLink(this: CompileContext, token: Token) {
    this.exit(token);
  }

  return {
    enter: {
      wikiLink: enterWikiLink,
      embedLink: enterEmbedLink,
    },
    exit: {
      wikiLinkTarget: exitWikiLinkTarget,
      wikiLinkAlias: exitWikiLinkAlias,
      wikiLink: exitWikiLink,
      embedLinkTarget: exitEmbedLinkTarget,
      embedLinkAlias: exitEmbedLinkAlias,
      embedLink: exitEmbedLink,
    },
  };
}

export { fromMarkdown, type FromMarkdownOptions };
