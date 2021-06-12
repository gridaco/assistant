import React from "react";
import { CodeScreen } from "./code-screen";
import { DEFAULT_EMPTY_CODE_SNIPPET } from "./constants";

export function ReactCodeScreen() {
  return (
    <CodeScreen
      placeholderSource={DEFAULT_EMPTY_CODE_SNIPPET}
      framework="react"
      formatter={(s) => s}
    />
  );
}
