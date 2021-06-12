import React from "react";
import { CodeScreen } from "./code-screen";
import { DEFAULT_EMPTY_CODE_SNIPPET } from "./constants";
import { format } from "../../utils/dart-format";

export function FlutterCodeScreen() {
  return (
    <CodeScreen
      placeholderSource={DEFAULT_EMPTY_CODE_SNIPPET}
      framework="flutter"
      formatter={format}
    />
  );
}
