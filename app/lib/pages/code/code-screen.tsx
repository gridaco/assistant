import React, { useEffect, useState } from "react";
import CodeBox, { SourceInput } from "../../components/codebox";
import { Preview } from "../../components/preview";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "../../constants/ek.constant";
import { repo_assets } from "@design-sdk/core";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import {
  FrameworkOption,
  all_preset_options_map__prod,
} from "./framework-option";
import styled from "@emotion/styled";
import { make_empty_selection_state_text_content } from "./constants";
import { format } from "./formatter";
import copy from "copy-to-clipboard";
import { PluginSdk } from "@plugin-sdk/app";
import { CodeScreenFooter } from "./code-screen-footer";
import { CodeOptionsControl } from "./code-options-control";
import { fromApp, CodeGenRequest } from "./__plugin/events";
import { useSingleSelection } from "../../utils/plugin-hooks";

type DesigntoCodeUserOptions = FrameworkOption;
interface ICodeScreen {}

export function CodeScreen(props: ICodeScreen) {
  const [app, setApp] = useState<string>();
  const [useroption, setUseroption] = React.useState<DesigntoCodeUserOptions>(
    all_preset_options_map__prod.flutter_default
  );
  const [source, setSource] = useState<SourceInput>();
  const selection = useSingleSelection();

  /** register event listener for events from code thread. */
  useEffect(() => {
    window.addEventListener("message", onMessage);
    return function cleaup() {
      window.removeEventListener("message", onMessage);
    };
  }, [useroption.language]);

  /** post to code thread about target framework change */
  useEffect(() => {
    // 1. clear previous result.
    setSource(undefined);
    // 2. request new code gen.
    fromApp({
      type: "code-gen-request",
      option: useroption,
    });
  }, [useroption.framework, selection]);

  const _make_placeholder = () => {
    return make_empty_selection_state_text_content("empty");
  };

  const _make_source = (): SourceInput => {
    if (typeof source == "string") {
      if (source && source.length > 0) {
        return source;
      }
    } else {
      if (source && source.raw.length > 0) {
        return source;
      }
    }
    return _make_placeholder();
  };

  const handleSourceInput = ({
    app,
    code,
  }: {
    app: string;
    code: SourceInput;
  }) => {
    format(app, useroption.language, (s) => {
      setApp(s);
    });

    // for SourceInput, we need type checking
    if (typeof code == "string") {
      // source input as string
      format(code, useroption.language, (s) => {
        setSource(s);
      });
    } else {
      // source input as { raw: string }
      format(code.raw, useroption.language, (s) => {
        setSource({
          raw: s,
        });
      });
    }
  };

  const onMessage = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg) {
      switch (msg.type) {
        case EK_GENERATED_CODE_PLAIN:
          handleSourceInput({
            app: msg.data.app,
            code: msg.data.code,
          });
          // analytics
          analytics.event_selection_to_code({
            framework: useroption.framework,
          });

          break;
        case EK_IMAGE_ASSET_REPOSITORY_MAP:
          const imageRepo =
            msg.data as repo_assets.TransportableImageRepository;
          repo_assets.ImageHostingRepository.setRepository(imageRepo);
          break;
      }
    } else {
      // ignore
    }
  };

  const onCopyClicked = (e) => {
    const _code: SourceInput = _make_source();
    const raw = typeof _code == "string" ? _code : _code.raw;
    copy(raw);
    PluginSdk.notifyCopied();

    // ANALYTICS
    analytics.event_click_copy_code();
  };

  const onOptionChange = (op: DesigntoCodeUserOptions) => {
    setUseroption(op);
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
      <CodeWrapper>
        <CodeOptionsControl
          // key={JSON.stringify(useroption)} // FIXME: do not uncomment me
          // initialPreset="react_default" // FIXME: do not uncomment me
          onUseroptionChange={onOptionChange}
        />
        <CodeBox
          language={_src_view_language(useroption.framework)}
          app={app}
          code={_make_source()}
        />
      </CodeWrapper>

      <CodeScreenFooter app={app} />
    </div>
  );
}

/**
 * get language by framework (default) (for code display) (non critical)
 *
 * -- used by code view (for styling only - used by highlight js)
 */
const _src_view_language = (framework: string): string => {
  switch (framework) {
    case "flutter":
      return "dart";
    case "react":
      return "jsx";
    default:
      throw `default language for code display on framework "${framework}" is not supported`;
  }
};

const CopyCodeButton = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  margin-top: 24px;
  margin-right: 20px;
  cursor: pointer;
`;

const CodeWrapper = styled.div`
  /* 374 is preview and navigation height*/
  height: calc(100vh - 374px);
  background: rgb(42, 39, 52);
  margin: 0 -8px;
  overflow-y: scroll;
`;
