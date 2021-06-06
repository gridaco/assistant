import * as flutter from "@bridged.xyz/flutter-builder";
import React, { useEffect, useState } from "react";
import { format } from "../../utils/dart-format";
import CodeBox from "../../components/codebox";
import { Preview } from "../../components/preview";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "../../constants/ek.constant";
import { repo_assets } from "@design-sdk/core";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";

/**
 * default message
 * @todo - detect the platform and customize the message.
 */
const DEFAULT_EMPTY_CODE_SNIPPET = `//
//
//
// there is no selected design.
// select your screen or component on figma
//
//
//`;

interface State {
  app: string;
  code: string;
  widget: flutter.Widget;
}

interface CodeScreenProps {}

export function CodeScreen(props: CodeScreenProps) {
  const [source, setSource] = useState<string>(DEFAULT_EMPTY_CODE_SNIPPET);
  const [widget, setWidget] = useState<flutter.Widget>();
  const [app, setApp] = useState<string>();

  const onMessage = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg) {
      switch (msg.type) {
        case EK_GENERATED_CODE_PLAIN:
          const app = format(msg.data.app);
          const code = format(msg.data.code);
          const widget = msg.data.widget;
          setSource(code);
          setWidget(widget);
          setApp(app);
          analytics.event_selection_to_code({
            framework: "flutter",
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
        language="dart"
        app={app}
        code={source}
        widget={widget}
      ></CodeBox>
    </div>
  );
}
