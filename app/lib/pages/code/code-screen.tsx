import React, { useEffect, useState } from "react";
import CodeBox, { SourceInput } from "../../components/codebox";
import { Preview } from "../../components/preview";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
  EK_SET_APP_MODE,
} from "../../constants/ek.constant";
import { repo_assets } from "@design-sdk/core";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import {
  Framework,
  FrameworkOption,
  Language,
  all_preset_options_map__prod,
} from "./framework-option";
import { CodeScreenControl } from "./code-screen-control";
import { WorkScreen } from "../../states/app-state";
import { Button } from "@material-ui/core";
import styled from "@emotion/styled";

type Formatter = (source: string) => string;

type DesigntoCodeUserOptions = FrameworkOption;
import { format as dart_format } from "../../utils/dart-format";
import { make_empty_selection_state_text_content } from "./constants";
import { ButtonStyle } from "../../components/style/global-style";

const formatter_by_lang = (lang: Language): Formatter => {
  switch (lang) {
    case Language.dart:
      return dart_format;
    case Language.jsx:
    case Language.tsx:
      return (s) => s;
  }
};

export function CodeScreen() {
  const [app, setApp] = useState<string>();
  const [useroption, setUseroption] = React.useState<DesigntoCodeUserOptions>(
    all_preset_options_map__prod.flutter_default
  );

  const [source, setSource] = useState<SourceInput>();

  const _make_placeholder = () => {
    return make_empty_selection_state_text_content({
      platform: "figma",
      lang: useroption.language,
    });
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

  const formatter = formatter_by_lang(useroption.language);
  const onMessage = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg) {
      switch (msg.type) {
        case EK_GENERATED_CODE_PLAIN:
          const app = formatter(msg.data.app);
          console.log(`$c ${app}`, "color: red");
          const code = formatter(msg.data.code);
          setSource(code);
          setApp(app);
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

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return function cleaup() {
      window.removeEventListener("message", onMessage);
    };
  }, [useroption.language]);

  // post to code thread about target framework change
  useEffect(() => {
    /**
     * region DIRTY CODE FIXME: !!!
     */
    // region get workscreen name (FOR PREV VER)
    let _frameworknameforeventtransport: WorkScreen;
    switch (useroption.framework) {
      case Framework.flutter:
        _frameworknameforeventtransport = WorkScreen.code_flutter;
        break;
      case Framework.react:
        _frameworknameforeventtransport = WorkScreen.code_react;
        break;
    }

    // endregion get workscreen name
    parent.postMessage(
      {
        pluginMessage: {
          type: EK_SET_APP_MODE,
          // TODO: provide other options INCLUDING framework info, currently we only provide framework info for last version compatibility.
          data: _frameworknameforeventtransport,
        },
      },
      "*"
    );
    /**
     * endregion DIRTY CODE FIXME: !!!
     */
  }, [useroption.framework]);

  const onOptionChange = (op: DesigntoCodeUserOptions) => {
    setUseroption(op);
  };
  return (
    <div>
      <Preview auto />

      <CopyCodeButton>
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
      <CodeScreenControl
        // key={JSON.stringify(useroption)} // FIXME: do not uncomment me
        // initialPreset="react_default" // FIXME: do not uncomment me
        onUseroptionChange={onOptionChange}
      />
      <CodeBox
        language={_src_view_language(useroption.framework)}
        app={app}
        code={_make_source()}
      />
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
