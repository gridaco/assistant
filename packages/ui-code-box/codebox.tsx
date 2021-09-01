import * as React from "react";
import {
  default as PrismHighlight,
  defaultProps,
  Language,
  Prism,
} from "prism-react-renderer";
// import Prism from "prism-react-renderer/prism";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { MonacoEditor } from "./monaco-editor";

export type SourceInput = string | { raw: string };

export function CodeBox({
  language,
  editor = "prism",
  readonly = true,
  code,
  codeActions,
}: {
  language: "dart" | "jsx" | string;
  editor?: "monaco" | "prism";
  /**
   * true by default
   */
  readonly?: boolean;
  code: SourceInput;
  codeActions?: Array<JSX.Element>;
}) {
  const raw = typeof code == "string" ? code : code.raw;

  useEffect(() => {
    if (language == "dart") {
      // region custom dart support
      // https://github.com/FormidableLabs/prism-react-renderer/issues/22#issuecomment-553042928
      const dartLang = require("refractor/lang/dart");
      dartLang(Prism);
      // endregion
    }
  }, []);

  const Editor =
    editor == "monaco" ? (
      <MonacoEditor src={raw} />
    ) : (
      <PrismCodehighlight src={raw} language={language} />
    );

  return (
    <>
      {/* <CopyCodeButton /> */}
      <CodeWrapper>
        {codeActions &&
          codeActions.map((e) => {
            return e;
          })}

        {typeof raw == "string" ? (
          Editor
        ) : (
          <>Invalid code was givven. cannot display result (this is a bug)</>
        )}
      </CodeWrapper>

      {/* FIXME: Need to move that wrapper to parent position  */}
    </>
  );
}

function PrismCodehighlight(props: { src: string; language: any | Language }) {
  return (
    <PrismHighlight
      {...defaultProps}
      Prism={Prism}
      code={props.src}
      language={props.language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <CodeInnerWrapper className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </CodeInnerWrapper>
      )}
    </PrismHighlight>
  );
}

const CodeWrapper = styled.code`
  width: max-content;
  height: auto;
`;

const CodeInnerWrapper = styled.pre`
  width: 100%;
  /* height: 408px; */
  margin: 0 8px;
  /* margin: 0 -8px; */
  padding: 8px;
  /* overflow: scroll; */
`;
