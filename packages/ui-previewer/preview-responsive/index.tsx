import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useSingleSelection } from "plugin-app";

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

const margin = 12;

export function ResponsivePreview({
  props,
  parentWidth,
}: {
  props: ResponsivePreviewProps;
  parentWidth: number;
}) {
  // TODO: remove me - temporal use
  const design = useSingleSelection();
  const [scalefactor, setscalefactor] = useState(0);
  useEffect(() => {
    if (design) {
      const _s = (parentWidth - margin * 2) / design.node["width"];
      const framescale = _s; // Math.min(_s, 1); (disabled. - will be removed @softmarshamllow)
      setscalefactor(framescale);
    }
  }, [design]);

  return (
    <>
      <PlainIframe
        id="preview-iframe"
        width={design?.node["width"] ?? 0}
        height={design?.node["height"] ?? 0}
        sandbox="allow-same-origin"
        margin={margin}
        srcDoc={props.data}
        scale={scalefactor}
      />
    </>
  );
}

const PlainIframe = styled.iframe<{ scale: number; margin: number }>`
  background: white;
  box-shadow: 0px 4px 64px rgba(160, 160, 160, 0.18);
  outline: none;
  overflow: hidden;
  margin: ${(props) => props.margin}px;
  border: none;
  transform: ${(props) => `scale(${props.scale})`};
  transform-origin: 0 0;
`;
