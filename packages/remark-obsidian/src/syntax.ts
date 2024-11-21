import type { Code, Effects, State } from "micromark-util-types";
import { codes } from "micromark-util-symbol";

/**
 effects.enter('wikiLink')        // <wikiLink>
 effects.enter('wikiLinkMarker')  //   <wikiLinkMarker>
 effects.consume(91)              //     [
 effects.consume(91)              //     [
 effects.exit('wikiLinkMarker')   //   </wikiLinkMarker>
 effects.enter('wikiLinkTarget')  //   <wikiLinkTarget>
 effects.consume(112)             //     p
 effects.consume(97)              //     a
 effects.consume(103)             //     g
 effects.consume(101)             //     e
 effects.exit('wikiLinkTarget')   //   </wikiLinkTarget>
 effects.exit('wikiLink')         // </wikiLink>
 토큰 트리는 나중에 HTML이나 다른 형식으로 변환될 때 사용됨
 */

// 마크다운 줄바꿈 체크 유틸리티 함수
function markdownLineEnding(code: Code): boolean {
  return (
    code === null || // EOF
    code === codes.lf || // \n
    code === codes.cr || // \r
    code < codes.horizontalTab // 특수 줄바꿈 코드들 (-2보다 작은)
  );
}

// 마크다운 공백 문자 체크 유틸리티 함수
function markdownLineEndingOrSpace(code: Code): boolean {
  return (
    code === codes.space || // 일반 공백
    markdownLineEnding(code) // 또는 줄바꿈
  );
}

interface TokenizerOptions {
  aliasDivider?: string;
  type?: "wiki" | "embed";
}

export function createTokenizer(options: TokenizerOptions = {}) {
  const aliasDivider = options.aliasDivider || "|";
  const type = options.type || "wiki";

  const tokenTypes = {
    link: type === "embed" ? "embedLink" : "wikiLink",
    marker: type === "embed" ? "embedLinkMarker" : "wikiLinkMarker",
    data: type === "embed" ? "embedLinkData" : "wikiLinkData",
    target: type === "embed" ? "embedLinkTarget" : "wikiLinkTarget",
    aliasMarker:
      type === "embed" ? "embedLinkAliasMarker" : "wikiLinkAliasMarker",
    alias: type === "embed" ? "embedLinkAlias" : "wikiLinkAlias",
  } as const;

  function tokenize(effects: Effects, ok: State, nok: State) {
    let hasData = false;
    let hasAlias = false;

    return type === "embed" ? startEmbed : start;

    function startEmbed(code: Code) {
      if (code !== codes.exclamationMark) return nok(code);
      effects.enter(tokenTypes.link); // embedLink
      effects.consume(code);
      return start;
    }

    function start(code: Code) {
      if (code !== codes.leftSquareBracket) return nok(code);
      // embed가 아닐 때는 여기서 link 토큰 시작
      if (type !== "embed") {
        effects.enter(tokenTypes.link); // wikiLink
      }
      effects.enter(tokenTypes.marker);
      effects.consume(code);
      return consumeStart;
    }

    function consumeStart(code: Code) {
      if (code !== codes.leftSquareBracket) return nok(code);
      effects.consume(code);
      effects.exit(tokenTypes.marker);
      effects.enter(tokenTypes.data);
      effects.enter(tokenTypes.target);
      return consumeTarget;
    }

    // ... (나머지 함수들도 tokenTypes 사용)
    function consumeTarget(code: Code) {
      if (markdownLineEnding(code)) {
        return nok(code);
      }

      if (code === aliasDivider.charCodeAt(0)) {
        if (!hasData) return nok(code);
        effects.exit(tokenTypes.target);
        effects.enter(tokenTypes.aliasMarker);
        effects.consume(code);
        effects.exit(tokenTypes.aliasMarker);
        effects.enter(tokenTypes.alias);
        return consumeAlias;
      }

      if (code === codes.rightSquareBracket) {
        if (!hasData) return nok(code);
        effects.exit(tokenTypes.target);
        effects.exit(tokenTypes.data);
        effects.enter(tokenTypes.marker);
        return consumeEnd(code);
      }

      if (!markdownLineEndingOrSpace(code)) {
        hasData = true;
      }
      effects.consume(code);
      return consumeTarget;
    }

    function consumeAlias(code: Code) {
      if (markdownLineEnding(code)) {
        return nok(code);
      }

      if (code === codes.rightSquareBracket) {
        if (!hasAlias) return nok(code);
        effects.exit(tokenTypes.alias);
        effects.exit(tokenTypes.data);
        effects.enter(tokenTypes.marker);
        return consumeEnd(code);
      }

      if (!markdownLineEndingOrSpace(code)) {
        hasAlias = true;
      }
      effects.consume(code);
      return consumeAlias;
    }

    function consumeEnd(code: Code) {
      if (code !== codes.rightSquareBracket) return nok(code);
      effects.consume(code);
      return consumeSecondBracket;
    }

    function consumeSecondBracket(code: Code) {
      if (code !== codes.rightSquareBracket) return nok(code);
      effects.consume(code);
      effects.exit(tokenTypes.marker);
      effects.exit(tokenTypes.link);
      return ok;
    }
  }

  return {
    text: {
      [type === "embed" ? codes.exclamationMark : codes.leftSquareBracket]: {
        tokenize,
      },
    },
  };
}

// TokenTypeMap 확장
declare module "micromark-util-types" {
  interface TokenTypeMap {
    // 위키링크 토큰
    wikiLink: "wikiLink";
    wikiLinkMarker: "wikiLinkMarker";
    wikiLinkData: "wikiLinkData";
    wikiLinkTarget: "wikiLinkTarget";
    wikiLinkAliasMarker: "wikiLinkAliasMarker";
    wikiLinkAlias: "wikiLinkAlias";
    // 임베드 토큰
    embedLink: "embedLink";
    embedLinkMarker: "embedLinkMarker";
    embedLinkData: "embedLinkData";
    embedLinkTarget: "embedLinkTarget";
    embedLinkAliasMarker: "embedLinkAliasMarker";
    embedLinkAlias: "embedLinkAlias";
  }
}

export const wikiLinkSyntax = createTokenizer({ type: "wiki" });
export const embedLinkSyntax = createTokenizer({ type: "embed" });
