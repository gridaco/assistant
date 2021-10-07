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

  const [scalefactor, setscalefactor] = useState(0);
  useEffect(() => {
    if (design) {
      const iframeScale = (parentWidth - 24) / design.node["width"];

      setscalefactor(iframeScale);
    }
  }, [design]);
  return (
    <>
      <PlainIframe
        id="preview-iframe"
        min-width={design?.node["width"] ?? 0}
        height={design?.node["height"] ?? 0}
        sandbox="allow-same-origin"
        srcDoc={props.data}
        scale={scalefactor}
      />
    </>
  );
}

const PlainIframe = styled.iframe<{ scale: number }>`
  background: none;
  outline: none;
  border: none;
  transform: ${(props) => `scale(${props.scale})`};
  /* transform-origin: 0 0; */
`;
