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
import styled from "@emotion/styled";
import Dialog from "@material-ui/core/Dialog";
import { UploadSteps } from "@ui/flow-steps";
import { BlackButtonStyle } from "@ui/core/button-style";
import { FullscreenAppbarActionButton } from "./components";
import { FullsreenAppbar } from "./components/fullscreen-appbar";
const vanilla_config = vanilla_presets.vanilla_default;

function usePreview() {
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

  return {
    source,
    width: selection?.node?.width,
    height: selection?.node?.height,
    id: selection?.id,
  };
}

export function PreviewScreen() {
  const { source, id, width, height } = usePreview();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (source) {
      setIsFullscreen(true);
    }
  }, [source]);

  const preview = (
    <Preview
      key={source}
      // auto
      type="responsive"
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
                  <FullscreenAppbarActionButton
                    onClick={() => {
                      // TODO:
                    }}
                  >
                    Open in browser
                  </FullscreenAppbarActionButton>
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

function OpenInBrowserSteps() {
  return (
    <UploadSteps
      onComplete={{
        title: "Your page is ready",
        description: "Note: anyone with the link can access the page.",
        actions: (
          <FooterActionsWrapper>
            <OpenButton>Open</OpenButton>
            <CopyLinkButton>Copy link</CopyLinkButton>
          </FooterActionsWrapper>
        ),
      }}
    />
  );
}

const FooterActionsWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 16px;
  bottom: 16px;
  right: 0;
  left: 0;
`;

const OpenButton = styled.button`
  ${BlackButtonStyle}
  width: 100%;
`;

const CopyLinkButton = styled.button`
  cursor: pointer;
  outline: none;
  border: none;
  background: none;
  color: rgb(193, 193, 193);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: center;
`;
