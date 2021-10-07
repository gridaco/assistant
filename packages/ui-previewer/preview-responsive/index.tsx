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

export function ResponsivePreview(props: ResponsivePreviewProps) {
  // TEMPORARILY USAGE
  const design = useSingleSelection();
  return (
    <>
      <PlainIframe
        width={design?.node["width"] ?? 0}
        height={design?.node["height"] ?? 0}
        sandbox="allow-same-origin"
        srcDoc={props.data}
      />
    </>
  );
}

const PlainIframe = styled.iframe`
  background: none;
  outline: none;
  border: none;
`;
