const es_profile = {
  comment: "//",
  docstring: {
    start: "/**",
    mid: " *",
    end: " */",
  },
};

const comment_profile = {
  dart: {
    comment: "//",
    docstring: {
      start: "///",
      mid: "///",
      end: "///",
    },
  },
  es: es_profile,
  js: es_profile,
  jsx: es_profile,
  ts: es_profile,
  tsx: es_profile,
};

const _TEXT_LEADING_MARGIN = 1;

/** 
 * e.g.
 * 
 * ```
 //
 //
 //
 // there is no selected design.
 // select your screen or component on figma
 //
 //
 //
```
 * 
*/
export function make_empty_selection_state_text_content(
  p:
    | {
        platform: string;
        lang: "jsx" | "tsx" | "dart";
      }
    | "empty"
) {
  if (p == "empty") {
    return "";
  }
  const _margin =
    _TEXT_LEADING_MARGIN > 0 ? " ".repeat(_TEXT_LEADING_MARGIN) : "";
  const docstring_profile = comment_profile[p.lang].docstring;
  return `
${_margin}${docstring_profile.start}
${_margin}${docstring_profile.mid}
${_margin}${docstring_profile.mid} there is no selected design.
${_margin}${docstring_profile.mid} select your screen or component on ${p.platform}
${_margin}${docstring_profile.mid}
${_margin}${docstring_profile.end}`;
}
