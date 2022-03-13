import React, { useMemo, useEffect, useState } from "react";
import { Preview, utils } from "@ui/previewer";
import { repo_assets } from "@design-sdk/core";
import { useSingleSelection } from "plugin-app";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "@core/constant";
import { vanilla_presets } from "@app/design-to-code/framework-option";
import { fromApp } from "@app/design-to-code/__plugin/events";

const vanilla_config = vanilla_presets.vanilla_default;

export function PreviewScreen() {
  const selection = useSingleSelection();

  const [source, setSource] = useState<string>();

  const handle_vanilla_preview_source = (
    v: string,
    r?: repo_assets.TransportableImageRepository
  ) => {
    setSource(utils.inject_assets_source_to_vanilla(v, r));
  };

  const handleSourceInput = ({ src }: { src: string }) => {
    handle_vanilla_preview_source(src);
  };

  const onMessage = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg) {
      switch (msg.type) {
        case EK_GENERATED_CODE_PLAIN:
          handleSourceInput({
            src: msg.data.vanilla_preview_source,
          });

          break;
        case EK_IMAGE_ASSET_REPOSITORY_MAP:
          const imageRepo =
            msg.data as repo_assets.TransportableImageRepository;
          repo_assets.ImageHostingRepository.setRepository(imageRepo);
          handle_vanilla_preview_source(source, imageRepo);
          break;
      }
    } else {
      // ignore
    }
  };

  /** post to code thread about target framework change */
  useEffect(() => {
    fromApp({
      type: "code-gen-request",
      option: vanilla_config,
      config: {
        do_generate_vanilla_preview_source: true,
      },
    });
  }, [selection?.id]);

  /** register event listener for events from code thread. */
  useEffect(
    () => {
      window.addEventListener("message", onMessage);
      return () => {
        window.removeEventListener("message", onMessage);
      };
    },
    // having dependencies becuase event listener must be registered when there is no saved cache when using cached mode.
    [selection?.id]
  );

  return (
    <Preview
      key={source}
      // auto
      type="responsive"
      data={source}
      id={selection?.id}
      origin_size={{
        width: selection?.node?.width,
        height: selection?.node?.height,
      }}
      isAutoSizable={true}
      height={300} //FIXME:
    />
  );
}
