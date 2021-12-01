import { format as dart_format } from "@core/code-formatter/dart-format";
import { Language } from "./framework-option";
import { format as remote_format } from "@base-sdk/functions-code-format";

type SyncFormatter = (source: string) => string;
type AsyncFormatter = (source: string) => Promise<string>;
export type SimpleFormatter = SyncFormatter | AsyncFormatter;
export type SmartFormatter = {
  sync: SyncFormatter;
  async: AsyncFormatter;
};
export type Formatter = SimpleFormatter | SmartFormatter;
export type FormatterType = "simple" | "smart";

export function _formatter_type(formatter: Formatter): FormatterType {
  if (typeof formatter === "function") {
    return "simple";
  } else if (typeof formatter === "object") {
    return "smart";
  } else {
    throw `unsopported formatter type "${typeof formatter}"`;
  }
}

const _noop_formatter = (s) => s;
export const formatter_by_lang = (lang: Language): Formatter => {
  switch (lang) {
    case Language.dart:
      return dart_format;
    case Language.jsx:
      return {
        sync: _noop_formatter,
        async: (s) =>
          remote_format({
            code: s,
            lang: "js",
          }),
      };
    case Language.tsx:
      return {
        sync: _noop_formatter,
        async: (s) =>
          remote_format({
            code: s,
            lang: "ts",
          }),
      };
    case Language.html:
      return {
        sync: _noop_formatter,
        async: (s) =>
          remote_format({
            code: s,
            lang: "html",
          }),
      };
    default: {
      return _noop_formatter;
    }
  }
};

export function format(
  code: string,
  lang: Language,
  onFormat: (code: string) => void,
  options?: {
    disable_remote_format?: boolean;
  }
) {
  const can_remote_format = !options?.disable_remote_format;
  // prevalidation
  if (typeof code != "string") {
    onFormat(code); // return as marked as format.
    return;
  }

  const formatter = formatter_by_lang(lang);
  switch (_formatter_type(formatter)) {
    case "simple":
      const _formatter = formatter as SimpleFormatter;
      const formatting = _formatter(code);
      if (formatting instanceof Promise) {
        onFormat(code); // fast response
        if (can_remote_format) {
          formatting.then(onFormat);
        }
      } else {
        onFormat(formatting);
      }
      break;
    case "smart":
      const fastresult = (formatter as SmartFormatter).sync(code);
      // fastresult
      onFormat(fastresult);

      if (can_remote_format) {
        (formatter as SmartFormatter).async(code).then(onFormat);
      }
      break;
  }
}
