import React from "react";
import styled from "@emotion/styled";
import { UploadSteps } from "@ui/flow-steps";
import { BlackButtonStyle } from "@ui/core/button-style";
import { finalize_temporary_assets_with_prefixed_static_string_keys__dangerously } from "@code-features/assets";
import { ImageHostingRepository } from "@design-sdk/asset-repository";
import { publishPage } from "../api";

export async function publishFigmaFrameAsPage({
  filekey,
  scene,
}: {
  filekey: string;
  scene: {
    id: string;
    raw: string;
  };
}) {
  const images = ImageHostingRepository.imageRepostory.images;
  const assets = images.reduce((p, c, i) => {
    const key = c.key + ".png";
    return {
      ...p,
      [key]: new Blob([c.data], {
        type: "image/png",
      }),
    };
  }, {});

  const replacement_map = images.reduce((p, c, i) => {
    return {
      ...p,
      [c.key]: `./${c.key}.png`,
    };
  }, {});

  // final code formatting - do again even if it's already done.
  scene.raw =
    finalize_temporary_assets_with_prefixed_static_string_keys__dangerously(
      scene.raw,
      "grida://assets-reservation/images/",
      replacement_map,
      {
        fallback: "this image cannot be hosted",
      }
    );

  return publishPage({
    filekey: filekey,
    id: scene.id,
    document: scene.raw,
    assets: assets,
  });
}

/**
 * @deprecated not used
 * @returns
 */
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
