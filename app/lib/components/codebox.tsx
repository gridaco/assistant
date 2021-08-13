import * as React from "react";
import {
  default as PrismHighlight,
  defaultProps,
  Language,
  Prism,
} from "prism-react-renderer";
import copy from "copy-to-clipboard";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";

// import Prism from "prism-react-renderer/prism";
import { quickLook } from "../quicklook";
import { PluginSdk } from "../utils/plugin-provider/plugin-app-sdk";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@material-ui/core";
import { BlackButton, ButtonStyle, WhtieButton } from "./style/global-style";

export type SourceInput = string | { raw: string };

interface Props {
  language: "dart" | "jsx" | string;
  code: SourceInput;
  app?: any;
  codeActions?: Array<JSX.Element>;
}

export default function CodeBox(props: Props) {
  const raw = typeof props.code == "string" ? props.code : props.code.raw;

  useEffect(() => {
    if (props.language == "dart") {
      // region custom dart support
      // https://github.com/FormidableLabs/prism-react-renderer/issues/22#issuecomment-553042928
      const dartLang = require("refractor/lang/dart");
      dartLang(Prism);
      // endregion
    }
  }, []);

  return (
    <>
      {/* <CopyCodeButton /> */}
      <CodeWrapper>
        {props.codeActions &&
          props.codeActions.map((e) => {
            return e;
          })}

        {typeof raw == "string" ? (
          <PrismCodehighlight code={raw} language={props.language} />
        ) : (
          <>Invalid code was givven. cannot display result (this is a bug)</>
        )}
      </CodeWrapper>

      {/* FIXME: Need to move that wrapper to parent position  */}
    </>
  );
}

function PrismCodehighlight(props: { code: string; language: any | Language }) {
  return (
    <PrismHighlight
      {...defaultProps}
      Prism={Prism}
      code={props.code}
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
  height: 408px;
  margin: 0 -8px;
  padding: 8px;
  /* overflow: scroll; */
`;
