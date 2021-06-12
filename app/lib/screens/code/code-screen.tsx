import React, { useEffect, useState } from "react";
import CodeBox from "../../components/codebox";
import { Preview } from "../../components/preview";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "../../constants/ek.constant";
import { repo_assets } from "@design-sdk/core";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";

interface CodeScreenProps {
  placeholderSource: string;
  framework: "flutter" | "react";
  formatter: (source: string) => string;
}

export function CodeScreen(props: CodeScreenProps) {
  const [source, setSource] = useState<string>(props.placeholderSource);
  const [app, setApp] = useState<string>();

  const onMessage = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg) {
      switch (msg.type) {
        case EK_GENERATED_CODE_PLAIN:
          const app = props.formatter(msg.data.app);
          const code = props.formatter(msg.data.code);
          setSource(code);
          setApp(app);
          analytics.event_selection_to_code({
            framework: props.framework,
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
  }, []);

  return (
    <div>
      <Preview auto />
      <CodeBox
        language={_language(props.framework)}
        app={app}
        code={source}
      ></CodeBox>
    </div>
  );
}

/**
 * get language by framework (default) (for code display) (non critical)
 */
const _language = (framework: string): string => {
  switch (framework) {
    case "flutter":
      return "dart";
    case "react":
      return "jsx";
    default:
      throw `default language for code display on framework "${framework}" is not supported`;
  }
};
