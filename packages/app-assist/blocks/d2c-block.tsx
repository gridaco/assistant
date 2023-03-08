import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { CodeBox, SourceInput } from "@ui/codebox";
import { PreferFramework } from "@app/preferences";
import {
  getDefaultPresetNameByFramework,
  getPresetByName,
} from "@app/design-to-code/framework-option";
import { Framework } from "@grida/builder-platform-types";
import { DesigntoCodeUserOptions } from "@app/design-to-code/user-options";
import { _src_view_language } from "@app/design-to-code/utils";
import { fromApp } from "@app/design-to-code/__plugin/events";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "@core/constant";

export function DesignToCodeBlock({ node }: { node: string }) {
  const [source, setSource] = useState<SourceInput>();

  const framework_preference = useMemo(() => new PreferFramework(), []);
  const initialPresetName = getDefaultPresetNameByFramework(
    framework_preference.get({
      fallback: Framework.react,
    })
  );
  const initialPreset = getPresetByName(initialPresetName);

  const [useroption, setUseroption] =
    useState<DesigntoCodeUserOptions>(initialPreset);

  /** post to code thread about target framework change */
  useEffect(() => {
    // 2. request new code gen.
    fromApp({
      type: "code-gen-request",
      option: useroption,
      config: {
        do_generate_vanilla_preview_source: true,
      },
    });
  }, [useroption.framework, node]);

  /** register event listener for events from code thread. */
  useEffect(
    () => {
      window.addEventListener("message", onMessage);
      return () => {
        window.removeEventListener("message", onMessage);
      };
    },
    // having dependencies becuase event listener must be registered when there is no saved cache when using cached mode.
    [useroption.framework, useroption.language, node]
  );

  const handleSourceInput = ({
    name,
    app,
    code,
    vanilla_preview_source,
  }: {
    name: string;
    app: string;
    code: SourceInput;
    vanilla_preview_source?: string;
  }) => {
    setSource(code);
  };

  const onMessage = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg) {
      switch (msg.type) {
        case EK_GENERATED_CODE_PLAIN:
          handleSourceInput({
            name: msg.data.name,
            app: msg.data.app,
            code: msg.data.code,
            vanilla_preview_source: msg.data.vanilla_preview_source,
          });

          break;
      }
    } else {
      // ignore
    }
  };

  return (
    <>
      <CodeBox
        disabled
        editor={"prism"}
        language={_src_view_language(useroption.framework)}
        code={source}
      />
    </>
  );
}
