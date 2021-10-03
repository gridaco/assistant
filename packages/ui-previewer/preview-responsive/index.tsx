import styled from "@emotion/styled";
import React from "react";

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
  return (
    <>
      <PlainIframe
        width="100%"
        height="100%"
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
