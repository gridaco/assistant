import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@material-ui/core";
import { BlackButton, WhtieButton } from "../../components/style/global-style";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { PluginSdk } from "@plugin-sdk/app";
import { quickLook } from "../../quicklook";

interface ICodeScreenFooter {
  app?: any;
}

export function CodeScreenFooter(props: ICodeScreenFooter) {
  const [isLaunchingConsole, setIsLaunchingConsole] = useState<boolean>(false);

  const onLoading = () => {};

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
    <CodeFooterCtaWrapper>
      {/* copy feature should be inside the code viewer box with copy icon button.*/}
      {/* <CopyCodeButton onClick={onCopyClicked}>copy code</CopyCodeButton> */}

      <NextStepButton
        onClick={() => {
          // TODO: the button component should be passed from outer side.
        }}
      >
        Next
      </NextStepButton>
      {props.app && (
        <PreviewButton
          disabled={isLaunchingConsole}
          onClick={onQuickLookClicked}
        >
          {isLaunchingConsole ? "launching.." : "preview"}
        </PreviewButton>
      )}
    </CodeFooterCtaWrapper>
  );
}

const CodeFooterCtaWrapper = styled.footer`
  /* margin: 0 -8px; */
  padding: 12px 8px;
  display: flex;
  background: #fff;

  button {
    &:first-child {
      margin-right: 8px;
    }
  }
`;

const NextStepButton = styled.button`
  ${BlackButton}
  width: calc(66.666% - 12px);

  &:hover {
    color: #fff;
    background: #17181a;
  }
`;

const PreviewButton = styled.button`
  ${WhtieButton}
  width: calc(33.333% - 12px);
`;
