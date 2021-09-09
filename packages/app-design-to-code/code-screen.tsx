import React, { useEffect, useState } from "react";
import { Preview } from "@ui/previewer";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { DesigntoCodeUserOptions } from "./user-options";
import styled from "@emotion/styled";
// import { make_empty_selection_state_text_content } from "./constants";

import copy from "copy-to-clipboard";
import { PluginSdk } from "@plugin-sdk/app";
import { CodeScreenFooter } from "./footer-action/code-screen-footer";

import { useSingleSelection } from "plugin-app";
import { CodeViewWithControl } from "./code-view-with-control";

export function CodeScreen() {
  const selection = useSingleSelection();

  const [source, setSource] = useState<string>();
  const [app, setApp] = useState<string>();
  const [useroption, setUseroption] = useState<DesigntoCodeUserOptions>();
  // const _make_placeholder = () => {
  //   return make_empty_selection_state_text_content("empty");
  // };

  // const _make_source = (): SourceInput => {
  //   if (typeof source == "string") {
  //     if (source && source.length > 0) {
  //       return source;
  //     }
  //   } else {
  //     if (source && source.raw.length > 0) {
  //       return source;
  //     }
  //   }
  //   return _make_placeholder();
  // };

  const onCopyClicked = (e) => {
    // const _code: SourceInput = _make_source();
    // const raw = typeof _code == "string" ? _code : _code.raw;
    copy(source);
    PluginSdk.notifyCopied();

    // ANALYTICS
    analytics.event_click_copy_code();
  };

  return (
    <div>
      <Preview auto />

      {/* FIXME: add onCopyClicked to code-box */}
      <CopyCodeButton onClick={onCopyClicked}>
        <svg
          width="19"
          height="22"
          viewBox="0 0 19 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 0H0V16H2V2H14V0ZM19 4H4V22H19V4ZM17 20H6V6H17V20Z"
            fill="white"
          />
        </svg>
      </CopyCodeButton>
      <CodeViewWithControl
        targetid={selection?.id}
        onGeneration={(app, src) => {
          setApp(app);
          setSource(src);
        }}
        onUserOptionsChange={setUseroption}
      />
      <CodeScreenFooter
        key={useroption?.framework}
        framework={useroption?.framework}
        app={app}
        scene={selection?.node as any}
      />
    </div>
  );
}

const CopyCodeButton = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  margin-top: 24px;
  margin-right: 20px;
  cursor: pointer;
`;
