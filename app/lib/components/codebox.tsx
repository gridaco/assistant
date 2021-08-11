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
import { css } from "@emotion/react";

export type SourceInput = string | { raw: string };

interface Props {
  language: "dart" | "jsx" | string;
  code: SourceInput;
  app?: any;
  codeActions?: Array<JSX.Element>;
}

export default function CodeBox(props: Props) {
  const [isLaunchingConsole, setIsLaunchingConsole] = useState<boolean>(false);

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

  const onCopyClicked = (e) => {
    copy(raw);
    PluginSdk.notifyCopied();

    // ANALYTICS
    analytics.event_click_copy_code();
  };

  const onQuickLookClicked = (e) => {
    const setLoadingState = (loading: boolean) => {
      setIsLaunchingConsole(loading);
    };

    setLoadingState(true);
    quickLook("quicklook", props.app)
      .then((r) => {
        setLoadingState(false);
        PluginSdk.notify("quick look ready !");
      })
      .catch((e) => {
        console.error(e);
        setLoadingState(false);
        PluginSdk.notify("compile failed. view console for details.", 2);
      });

    // ANALYTICS
    analytics.event_click_quicklook();
  };

  return (
    <>
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

      <CodeFooterCtaWrapper>
        {/* copy feature should be inside the code viewer box with copy icon button.*/}
        {/* <CopyCodeButton onClick={onCopyClicked}>copy code</CopyCodeButton> */}
        {props.app && (
          <QuickLookButton
            disabled={isLaunchingConsole}
            onClick={onQuickLookClicked}
          >
            {isLaunchingConsole ? "launching.." : "quick look"}
          </QuickLookButton>
        )}

        {/* TODO: Fix it */}
        <RegisterBtn onClick={onQuickLookClicked}>{"register"}</RegisterBtn>
      </CodeFooterCtaWrapper>
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

const CopyCodeButton = styled.button`
  width: calc(50% - 5px);
  /* for unused .MuiButton-root margin: 0  */
  margin-right: 5px !important;
  font-weight: bold;
`;

const StyledButton = css`
  width: calc(50% - 5px);
  /* for unused .MuiButton-root margin: 0  */
  /* margin-left: 5px !important; */
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  border: 1px solid #151617;
  box-sizing: border-box;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const QuickLookButton = styled.button`
  ${StyledButton}
  background-color: #151617 !important;
  color: #fff !important;
`;

const RegisterBtn = styled.button`
  ${StyledButton}
  color: #151617 !important;
  background-color: #fff !important;
`;

const CodeFooterCtaWrapper = styled.div`
  margin: 0 -8px;
  padding: 10px 10px 0 10px;

  button {
    margin-right: 8px;

    &:last-child() {
      margin-right: 0;
    }
  }
`;

const CodeWrapper = styled.code`
  width: max-content;
  height: auto;
`;

const CodeInnerWrapper = styled.pre`
  margin: 0 -8px;
  padding: 8px;
  overflow: scroll;
  width: 100%;
  height: 408px;
`;
