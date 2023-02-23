import React from "react";
import styled from "@emotion/styled";
import { MonacoEditor, PrismView } from "./editors";

export type SourceInput = string | { raw: string };

export function CodeBox({
  language,
  editor = "prism",
  readonly = true,
  code,
  codeActions,
  disabled,
  onChange,
}: {
  language: "dart" | "jsx" | "tsx" | "ts" | "js" | string;
  editor?: "monaco" | "prism";
  /**
   * true by default
   */
  readonly?: boolean;
  code: SourceInput;
  codeActions?: Array<JSX.Element>;
  disabled?: true;
} & {
  onChange?: (code: string) => void;
}) {
  const raw = (code && (typeof code == "string" ? code : code.raw)) || "";

  const Editor =
    editor == "monaco" ? (
      <MonacoEditor
        key={language}
        src={raw}
        language={language}
        onChange={onChange}
      />
    ) : (
      <PrismView src={raw} language={language} />
    );

  return (
    <>
      {/* <CopyCodeButton /> */}
      <CodeWrapper disabled={disabled}>
        {codeActions &&
          codeActions.map((e) => {
            return e;
          })}
        {/* when empty input, don't raise error */}
        {raw || typeof raw == "string" ? (
          Editor
        ) : (
          <>Invalid code was givven. cannot display result (this is a bug)</>
        )}
      </CodeWrapper>

      {/* FIXME: Need to move that wrapper to parent position  */}
    </>
  );
}

const CodeWrapper = styled.code<{ disabled?: boolean }>`
  // TEMPORARILY STYLE
  pre {
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  }
  width: max-content;
`;
