import React, { useEffect, useState } from "react";
import { Preview, utils } from "@ui/previewer";
import * as repo_assets from "@design-sdk/asset-repository";
import { useSingleSelection } from "plugin-app";
import {
  EK_GENERATED_CODE_PLAIN,
  EK_IMAGE_ASSET_REPOSITORY_MAP,
} from "@core/constant";
import { vanilla_presets } from "@app/design-to-code/framework-option";
import { fromApp } from "@app/design-to-code/__plugin/events";
import Dialog from "@material-ui/core/Dialog";
import { FullscreenAppbarActionButton } from "./components";
import { FullsreenAppbar } from "./components/fullscreen-appbar";
import { OpenInEditorButton } from "app/lib/components";
import { publishFigmaFrameAsPage } from "./components/publish";
import { ActionAfterFilekeySetButton } from "app/lib/components/action-after-filekey-set-button";
import { PluginSdk } from "@plugin-sdk/app";

const vanilla_config = vanilla_presets.vanilla_default;

function usePreview() {
  const selection = useSingleSelection();
  const [source, setSource] = useState<string>(); // preview source
  const [raw, setRaw] = useState<string>(); // source without asset replacement

  const handle_vanilla_preview_source = (
    v: string,
    r?: repo_assets.TransportableImageRepository
  ) => {
    setSource(utils.inject_assets_source_to_vanilla(v, r));
  };

  const handleSourceInput = ({ src }: { src: string }) => {
    handle_vanilla_preview_source(src);
    setRaw(src);
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

  return {
    source,
    raw,
    width: selection?.node?.width,
    height: selection?.node?.height,
    id: selection?.id,
    isRoot: selection?.node && selection.node.parent.origin === "PAGE",
    type: selection?.node?.type,
  };
}

export function PreviewScreen() {
  const { raw, source, id, width, height, isRoot, type } = usePreview();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const _is_publishable_frame = isRoot && type === "FRAME";

  useEffect(() => {
    if (source) {
      setIsFullscreen(true);
    }
  }, [source]);

  const preview = (
    <Preview
      key={source}
      // auto
      type="scaling"
      data={source}
      id={id}
      origin_size={{
        width: width,
        height: height,
      }}
      isAutoSizable={true}
      height={300} //FIXME:
    />
  );

  return (
    <>
      {isFullscreen ? (
        <Dialog open={source !== undefined} fullScreen>
          <div>
            <FullsreenAppbar
              onBack={() => {
                setIsFullscreen(false);
              }}
              actions={
                <>
                  <OpenInEditorButton
                    scene={{ id }}
                    button={
                      <FullscreenAppbarActionButton>
                        Open in Grida
                      </FullscreenAppbarActionButton>
                    }
                  />
                  <OpenInBrowserButton
                    disabled={!_is_publishable_frame}
                    scene={{
                      raw: raw,
                      id: id,
                    }}
                  />
                </>
              }
            />
            {preview}
          </div>
        </Dialog>
      ) : (
        <>{preview}</>
      )}
    </>
  );
}

/**
 * Open in editor button to open the selection on the grida web editor : currently https://code.grida.co/files/:filekey/:id
 */
export function OpenInBrowserButton(props: {
  disabled?: boolean;
  scene: { id: string; raw: string };
  framework?: string;
  app?: any;
}) {
  const onNext = (filekey: string) => {
    PluginSdk.notify("📦 Bundling..", 4);
    publishFigmaFrameAsPage({
      filekey,
      scene: props.scene,
    })
      .then((r) => {
        open(r.page_url);
        PluginSdk.notify("🦈 Page published", 3);
      })
      .catch((e) => {
        PluginSdk.notify("⛔️ Payload too large", 3);
      })
      .finally(() => {});
  };

  return (
    <>
      <ActionAfterFilekeySetButton
        {...props}
        onNext={onNext}
        button={
          <FullscreenAppbarActionButton
            title={
              props.disabled
                ? "only root frames can be published"
                : "publish this frame as a website"
            }
          >
            Publish
          </FullscreenAppbarActionButton>
        }
      />
    </>
  );
}
