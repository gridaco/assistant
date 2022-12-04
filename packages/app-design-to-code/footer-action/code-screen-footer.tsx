import React, { useState } from "react";
import styled from "@emotion/styled";
import { WhiteTextButtonStyle } from "@ui/core/button-style";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { PluginSdk } from "@plugin-sdk/app";
import { preview } from "@app/scene-view";
// import { Legacy__NextUploadButton } from "./legacy-next-upload-button";
import type { ReflectSceneNode } from "@design-sdk/figma-node";
import { Framework } from "@grida/builder-platform-types";
import { OpenInEditorButton } from "app/lib/components";
import { BlueButtonStyle } from "@ui/core/button-style";
interface ICodeScreenFooter {
  framework: Framework;
  app?: any;
  scene?: ReflectSceneNode;
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

  /** currently we only support uploading & preview for flutter */
  const _can_open_in_editor = props.framework && !!props.app;
  const _can_show_preview = props.framework == Framework.flutter && !!props.app;

  return (
    <CodeFooterCtaWrapper>
      {
        <InnerWrapper>
          <OpenInEditorButton
            button={<OpenButton>Open</OpenButton>}
            disabled={!_can_open_in_editor}
            {...props}
          />
          {/* <Legacy__NextUploadButton disabled={!_can_enable_next} {...props} /> */}
          {_can_show_preview && (
            <PreviewButton
              disabled={isLaunchingConsole}
              onClick={onQuickLookClicked}
            >
              {isLaunchingConsole ? "launching.." : "preview"}
            </PreviewButton>
          )}
        </InnerWrapper>
      }
    </CodeFooterCtaWrapper>
  );
}

const CodeFooterCtaWrapper = styled.footer`
  width: 100%;
  padding: 12px 0;
  display: flex;
  /* vscode dark theme */
  background: #1e1e1e;
  display: flex;

  button {
    &:first-child {
      margin-right: 8px;
    }
  }
`;

const InnerWrapper = styled.div`
  width: 100%;
  margin: 0 16px;
`;
const PreviewButton = styled.button`
  ${WhiteTextButtonStyle}
  /* temp before add button component */
  width: 36%;
`;

const OpenButton = styled.button`
  ${BlueButtonStyle}
  min-width: 60%;
`;
