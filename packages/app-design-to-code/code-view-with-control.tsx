import React, { useEffect, useState } from "react";
import { CodeBox, SourceInput } from "@ui/codebox";
import { CodeOptionsControl } from "./code-options-control";
import styled from "@emotion/styled";
import { format } from "./formatter";
import { all_preset_options_map__prod } from "./framework-option";
import { fromApp, CodeGenRequest } from "./__plugin/events";
import { DesigntoCodeUserOptions } from "./user-options";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "@core/constant/ek.constant";
import { repo_assets } from "@design-sdk/core";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";

export function CodeViewWithControl({
  targetid,
  editor = "monaco",
  onUserOptionsChange,
  disabled,
  onGeneration,
  customMessages,
}: {
  targetid: string;
  editor?: "monaco" | "prism";
  onUserOptionsChange?: (options: DesigntoCodeUserOptions) => void;
  onGeneration?: (app: string, src: string) => void;
  customMessages?: string[];
  disabled?: true;
}) {
  const [app, setApp] = useState<string>();
  const [source, setSource] = useState<SourceInput>();
  const [useroption, setUseroption] = React.useState<DesigntoCodeUserOptions>(
    all_preset_options_map__prod.flutter_default
  );

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
  }, [useroption.framework, targetid]);

  // tell parent about user option initial change
  useEffect(() => {
    onUserOptionsChange?.(useroption);
  }, [useroption.framework, useroption.language]);

  const onOptionChange = (op: DesigntoCodeUserOptions) => {
    setUseroption(op);
  };

  const __onGeneration__cb = (app, src) => {
    const _source = typeof src == "string" ? source : src?.raw;
    onGeneration?.(app, _source);
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
      __onGeneration__cb(s, source);
    });

    // for SourceInput, we need type checking
    const _code = typeof code == "string" ? code : code.raw;
    format(_code, useroption.language, (s) => {
      setSource(s);
      __onGeneration__cb(app, s);
    });
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
          const imageRepo = msg.data as repo_assets.TransportableImageRepository;
          repo_assets.ImageHostingRepository.setRepository(imageRepo);
          break;
      }
    } else {
      // ignore
    }
  };

  return (
    <CodeWrapper>
      <CodeOptionsControl
        // key={JSON.stringify(useroption)} // FIXME: do not uncomment me
        // initialPreset="react_default" // FIXME: do not uncomment me
        onUseroptionChange={onOptionChange}
        customFields={customMessages?.map((d) => {
          return { name: d };
        })}
      />
      <CodeBox
        disabled={disabled}
        editor={editor}
        language={_src_view_language(useroption.framework)}
        code={source}
      />
    </CodeWrapper>
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

const _VSCODE_DARK_BG = "#1e1e1e";

const CodeWrapper = styled.div`
  /* 366px is preview(200) + navigation(52+40) + footer btn wrapper(74) height*/
  height: calc(100vh - 366px);
  background: ${_VSCODE_DARK_BG};
  overflow-y: hidden;
`;
