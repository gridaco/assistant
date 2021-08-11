import React, { useEffect, useState } from "react";
import CodeBox from "../../components/codebox";
import { Preview } from "../../components/preview";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "../../constants/ek.constant";
import { repo_assets } from "@design-sdk/core";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
// TODO: fix type struct
import { IField } from "@code-ui/docstring/dist/lib/field/type";
import { LanguageType } from "@code-ui/docstring/dist/lib/type";
import { CodeLikeView } from "@code-ui/docstring";

type FrameworkType = "flutter" | "react";
interface CodeScreenProps {
  placeholderSource: string;
  framework?: FrameworkType;
  formatter: (source: string) => string;
}

export function CodeScreen(props: CodeScreenProps) {
  const [source, setSource] = useState<string>(props.placeholderSource);
  const [app, setApp] = useState<string>();
  const [framework, setFramework] = React.useState<FrameworkType>("react");

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
            framework: framework,
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

  // TODO: remove it
  const platform_field: IField = {
    tag: "@",
    name: "platform",
    template: `{{ tag }}{{ name }} {{ options.value }} `,
    options: [
      {
        name: "Flutter",
        value: "platform.flutter",
        description: "flutter",
      },
    ],
  };
  return (
    <div>
      <Preview auto />
      <CodeLikeView
        lang={getLangType(framework)}
        style={"monokai"}
        padding={"10px"}
        controls={[platform_field]}
        expandableConfig={{
          lines: 2,
          expandable: true,
          hidable: true,
        }}
        onChange={() => {}}
      />
      <CodeBox
        language={_language(framework)}
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

function getLangType(framework: FrameworkType): LanguageType {
  switch (framework) {
    case "react":
      return "js";
    case "flutter":
      return "dart";
    default:
      return "js";
  }
}
