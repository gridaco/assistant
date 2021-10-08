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

export function CodeScreen() {
  const selection = useSingleSelection();

  const [
    vanilla_preview_source,
    set_vanilla_preview_source,
  ] = useState<string>();
  const [source, setSource] = useState<string>();
  const [app, setApp] = useState<string>();
  const [useroption, setUseroption] = useState<DesigntoCodeUserOptions>();
  const previewRef = useRef(undefined);

  const onCopyClicked = (e) => {
    // const _code: SourceInput = _make_source();
    // const raw = typeof _code == "string" ? _code : _code.raw;
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

  return (
    <div>
      <Preview
        key={vanilla_preview_source}
        auto
        type="responsive"
        data={vanilla_preview_source}
        // resizeHeight={}
      />

      {/* FIXME: add onCopyClicked to code-box */}
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
          setSource(src ?? app); // TODO: react only provides app. this needs to be fixed on the codegen side.
          handle_vanilla_preview_source(vanilla_preview_source);
        }}
        onAssetsLoad={(r) => {
          handle_vanilla_preview_source(vanilla_preview_source, r);
        }}
        onUserOptionsChange={setUseroption}
      />
      <CodeScreenFooter
        key={useroption?.framework}
        framework={useroption?.framework}
        app={app}
        scene={selection?.node as any}
      />
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

const CopyCodeButton = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  right: 0;
  margin-top: 24px;
  margin-right: 20px;
  cursor: pointer;
`;
