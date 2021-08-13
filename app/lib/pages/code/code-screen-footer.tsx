import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@material-ui/core";
import { BlackButton, WhtieButton } from "../../components/style/global-style";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { PluginSdk } from "../../utils/plugin-provider/plugin-app-sdk";
import { quickLook } from "../../quicklook";

interface ICodeScreenFooter {
  app?: any;
  handleIsUploading: () => void;
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

      <NextStepButton onClick={props.handleIsUploading}>next</NextStepButton>
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

const CodeFooterCtaWrapper = styled.div`
  /* margin: 0 -8px; */
  padding: 10px 10px 0 10px;
  display: flex;
  background: #fff;

  button {
    margin-right: 8px;

    &:last-child() {
      margin-right: 0;
    }
  }
`;

const NextStepButton = styled(Button)`
  ${BlackButton}
  width: 66.666666%;

  // for reset material-ui button style
  &:hover {
    color: #fff;
    background: #17181a;
  }
`;

const PreviewButton = styled(Button)`
  ${WhtieButton}
  width: 33.333333%;
`;
