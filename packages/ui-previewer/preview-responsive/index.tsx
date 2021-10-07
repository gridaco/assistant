import styled from "@emotion/styled";
import { useSingleSelection } from "plugin-app";
import React, { useEffect, useState } from "react";

export interface ResponsivePreviewProps {
  type: "responsive";
  /**
   * the vanilla html code or remote embeddable web url;
   */
  data?: string;
  /**
   * show responsive view of.
   */
  of?: string;
}

export function ResponsivePreview({
  props,
  parentWidth,
}: {
  props: ResponsivePreviewProps;
  parentWidth: number;
}) {
  // TEMPORARILY USAGE
  const design = useSingleSelection();

  const childWidth =
    document.getElementById("preview-iframe")?.offsetWidth ?? 0;

  // console.log("%c ---", "color:red");
  // console.log("parent", parentWidth);
  // console.log("child", childWidth);

  const iframeScale =
    Math.round(((parentWidth - 24) / childWidth) * 1000) / 1000 ?? 1;
  console.log(`iframeScale`, iframeScale);
  return (
    <>
      <PlainIframe
        id="preview-iframe"
        width={design?.node["width"] ?? 0}
        height={design?.node["height"] ?? 0}
        sandbox="allow-same-origin"
        srcDoc={props.data}
        scale={iframeScale}
      />
    </>
  );
}

const PlainIframe = styled.iframe<{ scale: number }>`
  background: none;
  outline: none;
  border: none;
  transform: ${(props) => `scale(${props.scale})`};
  transform-origin: 0 0;
`;
