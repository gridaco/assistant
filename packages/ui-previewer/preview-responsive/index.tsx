import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  id: string;

  /**
   * the origin size of the design
   */
  origin_size: {
    width: number;
    height: number;
  };
}

const margin = 12;

export function ResponsivePreview({
  previewInfo,
  parent,
}: {
  previewInfo: ResponsivePreviewProps;
  parent: { width: number; height: number };
}) {
  const [scalefactor, setscalefactor] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(undefined);

  // dangerously remove scrolling for inner ifram html
  // ask: @softmarshmallow
  useLayoutEffect(() => {
    if (iframeRef.current) {
      __dangerously_disable_scroll_in_html_body(iframeRef.current);
    }
  }, [iframeRef, previewInfo.data]);

  useEffect(() => {
    if (previewInfo && parent.width) {
      const _s = (parent.width - margin * 2) / previewInfo.origin_size.width;
      const framescale = Math.min(_s, 1);
      setscalefactor(framescale);
    }
  }, [parent.width, previewInfo?.id]);

  return (
    <>
      <PlainIframe
        id="preview-iframe"
        ref={iframeRef}
        width={previewInfo?.origin_size?.width ?? 0}
        height={previewInfo?.origin_size?.height ?? 0}
        sandbox="allow-same-origin"
        margin={margin}
        srcDoc={previewInfo.data}
        scale={scalefactor}
      />
    </>
  );
}

/**
 * this is a explicit temporary solution to disable iframe content to be scrolling. we aleardy disable scrolling a root element inside the body, but when the element is big and the scale factor is not persice enough, the scrollbar will be shown.
 * @ask: @softmarshmallow
 * @param iframe
 */
function __dangerously_disable_scroll_in_html_body(iframe: HTMLIFrameElement) {
  try {
    iframe.contentDocument.getElementsByTagName("body")[0].style.overflow =
      "hidden";
  } catch (_) {
    if (process.env.NODE_ENV === "development") {
      console.error("__dangerously_disable_scroll_in_html_body", _);
    }
  }
}

const PlainIframe = styled.iframe<{ scale: number; margin: number }>`
  background: white;
  box-shadow: 0px 4px 64px rgba(160, 160, 160, 0.18);
  outline: none;
  overflow: hidden;
  border-radius: 4px;
  margin: ${(props) => props.margin}px;
  border: none;
  transform: ${(props) => `scale(${props.scale})`};
  transform-origin: 0 0;
`;
