import React, { useState } from "react";
import styled from "@emotion/styled";
import { WhtieButton } from "../../../components/style/global-style";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { PluginSdk } from "@plugin-sdk/app";
import { preview } from "../../../scene-view";
import { NextUploadButton } from "./next-upload-button";

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
    preview("quicklook", props.app)
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
      {props.app && (
        <>
          {/* @ts-ignore TODO: */}
          <NextUploadButton {...props} />
          <PreviewButton
            disabled={isLaunchingConsole}
            onClick={onQuickLookClicked}
          >
            {isLaunchingConsole ? "launching.." : "preview"}
          </PreviewButton>
        </>
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
const PreviewButton = styled.button`
  ${WhtieButton}
  /* 1/3 size. 12 is wrapper padding */
  width: calc(33.333% - 12px);
`;