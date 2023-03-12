import React, { useEffect, useRef, useState, useMemo } from "react";
import { CodeBox, SourceInput } from "@ui/codebox";
import { CodeOptionsControl } from "./code-options-control";
import styled from "@emotion/styled";
import { format } from "./formatter";
import {
  getDefaultPresetNameByFramework,
  getPresetByName,
} from "./framework-option";
import { fromApp, CodeGenRequest } from "./__plugin/events";
import { DesigntoCodeUserOptions } from "./user-options";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "@core/constant";
import * as repo_assets from "@design-sdk/asset-repository";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { CodeSessionCacheStorage } from "./code-session-cache-storage";
import { PreferFramework } from "@app/preferences";
import { Framework } from "@grida/builder-platform-types";

export function CodeViewWithControl({
  targetid,
  editor = "monaco",
  onUserOptionsChange,
  onCodeChange,
  disabled,
  onGeneration,
  onAssetsLoad,
  customMessages,
  automaticRemoteFormatting = false,
  cachedOnly = false,
}: {
  targetid: string;
  editor?: "monaco" | "prism";
  onCodeChange?: (code: string) => void;
  onUserOptionsChange?: (options: DesigntoCodeUserOptions) => void;
  onGeneration?: (d: {
    name: string;
    app: string;
    src: string;
    vanilla_preview_source?: string;
  }) => void;
  onAssetsLoad?: (r: repo_assets.TransportableImageRepository) => void;
  customMessages?: string[];
  automaticRemoteFormatting?: boolean;
  disabled?: true;
  cachedOnly?: boolean;
}) {
  const [source, setSource] = useState<SourceInput>();

  const framework_preference = useMemo(() => new PreferFramework(), []);
  const initialPresetName = getDefaultPresetNameByFramework(
    framework_preference.get() ?? Framework.react
  );
  const initialPreset = getPresetByName(initialPresetName);

  const [useroption, setUseroption] =
    useState<DesigntoCodeUserOptions>(initialPreset);

  const cacheStore = useMemo(
    () => new CodeSessionCacheStorage(targetid, useroption),
    [targetid, useroption]
  );

  /** post to code thread about target framework change */
  useEffect(() => {
    // 1. clear previous result & preload the cache.
    const _cache = cacheStore.getCache();
    setSource(_cache ?? undefined); // for fpc
    if (!cachedOnly || !_cache) {
      // 2. request new code gen.
      fromApp({
        type: "code-gen-request",
        option: useroption,
        config: {
          do_generate_vanilla_preview_source: true,
        },
      });
    }
  }, [useroption.framework, targetid]);

  /** register event listener for events from code thread. */
  useEffect(
    () => {
      if (cachedOnly && cacheStore.getCache()) {
        // if use cache & cache is present, do not register callback.
        return;
      }
      window.addEventListener("message", onMessage);
      return () => {
        window.removeEventListener("message", onMessage);
      };
    },
    // having dependencies becuase event listener must be registered when there is no saved cache when using cached mode.
    [useroption.framework, useroption.language, targetid]
  );

  // tell parent about user option initial change
  useEffect(() => {
    onUserOptionsChange?.(useroption);
  }, [useroption.framework, useroption.language]);

  const onOptionChange = (op: DesigntoCodeUserOptions) => {
    framework_preference.set(op.framework); // save updated.
    setUseroption(op);
  };

  const __onGeneration__cb = (name, app, src, vanilla_preview_source) => {
    cacheStore.setCache(src);
    const _source = typeof src == "string" ? src : src?.raw;
    onGeneration?.({ name, app, src: _source, vanilla_preview_source });
  };

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
    format(
      app,
      useroption.language,
      (s) => {
        __onGeneration__cb(name, s, source, vanilla_preview_source);
      },
      {
        disable_remote_format: !automaticRemoteFormatting,
      }
    );

    // for SourceInput, we need type checking
    const _code = typeof code == "string" ? code : code.raw;
    format(
      _code,
      useroption.language,
      (s) => {
        setSource(s);
        __onGeneration__cb(name, app, s, vanilla_preview_source);
      },
      {
        disable_remote_format: !automaticRemoteFormatting,
      }
    );
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
          // analytics
          analytics.event_selection_to_code({
            //@ts-ignore
            framework: useroption.framework,
          });

          break;
        case EK_IMAGE_ASSET_REPOSITORY_MAP:
          const imageRepo =
            msg.data as repo_assets.TransportableImageRepository;
          repo_assets.ImageHostingRepository.setRepository(imageRepo);
          onAssetsLoad?.(imageRepo);
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
        initialPreset={initialPresetName}
        fallbackPreset="flutter_default"
        onUseroptionChange={onOptionChange}
        customFields={customMessages?.map((d) => {
          return { name: d };
        })}
      />
      <CodeBox
        disabled={disabled}
        editor={editor}
        onChange={onCodeChange}
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
    case "vanilla":
      return "html";
    default:
      throw `default language for code display on framework "${framework}" is not supported`;
  }
};

const CodeWrapper = styled.div`
  /* vscode dark bg color */
`;
