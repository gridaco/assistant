import React, { useState } from "react";
import styled from "@emotion/styled";
import { BlackButton, WhtieButton } from "../../components/style/global-style";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { PluginSdk } from "@plugin-sdk/app";
import { quickLook } from "../../quicklook";

interface ICodeScreenFooter {
  app?: any;
}

export function CodeScreenFooter(props: ICodeScreenFooter) {
  const [isLaunchingConsole, setIsLaunchingConsole] = useState<boolean>(false);

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
      <NextStepButton
        disabled={!props.app}
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
  /* 16 is body's padding */
  width: calc(100% - 16px);
  padding: 12px 16px;
  display: flex;
  background: #fff;
  position: absolute;
  left: 0;
  bottom: 0;

  button {
    &:first-child {
      margin-right: 8px;
    }
  }
`;

const NextStepButton = styled.button`
  ${BlackButton}
  /* 2/3 size. 12 is wrapper padding  */
  width: calc(66.666% - 12px);

  &:hover {
    color: #fff;
    background: #17181a;
  }
  &:disabled {
    color: #bbbbbb;
    background: #949494;
  }
`;

const PreviewButton = styled.button`
  ${WhtieButton}
  /* 1/3 size. 12 is wrapper padding */
  width: calc(33.333% - 12px);
`;
