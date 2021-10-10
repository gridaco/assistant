import React, { useEffect, useRef, useState } from "react";
import { Preview } from "@ui/previewer";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";
import { DesigntoCodeUserOptions } from "./user-options";
import styled from "@emotion/styled";
// import { make_empty_selection_state_text_content } from "./constants";

import copy from "copy-to-clipboard";
import { PluginSdk } from "@plugin-sdk/app";
import { CodeScreenFooter } from "./footer-action/code-screen-footer";

import { useSingleSelection } from "plugin-app";
import { CodeViewWithControl } from "./code-view-with-control";
import { finalize_temporary_assets_with_prefixed_static_string_keys__dangerously } from "@code-features/assets";
import { repo_assets } from "@design-sdk/core";
import { k } from "@web-builder/core";
import {
  ImageRepository,
  ImageHostingRepository,
} from "@design-sdk/core/assets-repository";
import { Resizable } from "re-resizable";
import { useScrollTriggeredAnimation } from "app/lib/components/motions";
import { useSetRecoilState } from "recoil";
import { hide_navigation } from "app/lib/main/global-state-atoms";

const resizeBarBase = 5;
const resizeBarVerPadding = 5;
const resizeBarSize = 5 + resizeBarVerPadding * 2;
const default_responsive_preview_height_for_code_screen = 300;

export function CodeScreen() {
  const selection = useSingleSelection();

  const [
    vanilla_preview_source,
    set_vanilla_preview_source,
  ] = useState<string>();
  const [source, setSource] = useState<string>();
  const [app, setApp] = useState<string>();
  const [useroption, setUseroption] = useState<DesigntoCodeUserOptions>();

  const onCopyClicked = (e) => {
    copy(source);
    PluginSdk.notifyCopied();

    // ANALYTICS
    analytics.event_click_copy_code();
  };

  const handle_vanilla_preview_source = (
    v: string,
    r?: repo_assets.TransportableImageRepository
  ) => {
    set_vanilla_preview_source(inject_assets_source_to_vanilla(v, r));
  };

  const code_scrolling_area_ref = useRef<HTMLDivElement>(null);
  const set_hide_navigation_state = useSetRecoilState(hide_navigation);
  const hide = useScrollTriggeredAnimation(code_scrolling_area_ref);
  useEffect(() => {
    set_hide_navigation_state(hide);
  }, [hide]);

  const [previewHeight, setPreviewHeight] = useState<number>(
    default_responsive_preview_height_for_code_screen
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flexGrow: 1,
      }}
    >
      <div>
        <Resizable
          defaultSize={{
            width: "100%",
            height: `${default_responsive_preview_height_for_code_screen}px`,
          }}
          handleStyles={{
            bottom: {
              height: `${resizeBarSize}px`,
              bottom: `${Math.floor(-resizeBarSize / 2)}px`,
              zIndex: 1,
            },
          }}
          onResize={(e, d, el) => {
            setPreviewHeight(el.offsetHeight);
          }}
          handleComponent={{ bottom: ResizeWrap() }}
          enable={{
            top: false,
            right: false,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          minHeight="30px"
          // calc not supported.
          maxHeight="75vh"
        >
          <Preview
            key={vanilla_preview_source}
            // auto
            type="responsive"
            data={vanilla_preview_source}
            id={selection?.id}
            origin_size={{
              width: selection?.node?.width,
              height: selection?.node?.height,
            }}
            isAutoSizable={true}
            height={previewHeight} //FIXME:
          />
        </Resizable>
      </div>
      <div
        ref={code_scrolling_area_ref}
        id="code-area"
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "auto",
          backgroundColor: "#1e1e1e",
        }}
      >
        <CopyCodeButton onClick={onCopyClicked}>
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
        <CodeViewWithControl
          key={selection?.id}
          targetid={selection?.id}
          onGeneration={(app, src, vanilla_preview_source) => {
            setApp(app);
            setSource(src);
            handle_vanilla_preview_source(vanilla_preview_source);
          }}
          onAssetsLoad={(r) => {
            handle_vanilla_preview_source(vanilla_preview_source, r);
          }}
          onUserOptionsChange={setUseroption}
        />
      </div>
      <div>
        <CodeScreenFooter
          key={useroption?.framework}
          framework={useroption?.framework}
          app={app}
          scene={selection?.node as any}
        />
      </div>
    </div>
  );
}

function inject_assets_source_to_vanilla(
  rawsrc: string,
  repo?: repo_assets.TransportableImageRepository
) {
  repo = repo || ImageHostingRepository.imageRepostory;
  if (!rawsrc || !repo) {
    return rawsrc;
  }

  const images = repo.images;
  const default_asset_replacement_prefix = "grida://assets-reservation/images/";
  const data_to_blob = (d) => {
    const b = new Blob([d], { type: "image/png" });
    return URL.createObjectURL(b);
  };

  const map = Object.fromEntries(
    images.map((i) => [i.key, data_to_blob(i.data)]) ?? []
  );

  const _final = finalize_temporary_assets_with_prefixed_static_string_keys__dangerously(
    rawsrc,
    default_asset_replacement_prefix,
    map,
    {
      fallback: k.image_smallest_fallback_source_base_64,
    }
  );
  return _final;
}

const ResizeWrap = (props?: any) => (
  <ResizableHandleBar>{props}</ResizableHandleBar>
);

const CopyCodeButton = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  margin-top: 24px;
  margin-right: 20px;
  cursor: pointer;
  z-index: 99999;
`;

const ResizableHandleBar = styled.div`
  width: 100%;
  z-index: 9999;
  height: ${resizeBarBase}px;
  padding: ${resizeBarVerPadding}px 0;

  &:hover,
  &:active {
    padding: 0;
    margin-top: ${resizeBarVerPadding}px;
    height: ${resizeBarBase}px;
    background-color: #2663ff;
  }
`;
