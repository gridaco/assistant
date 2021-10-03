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
      <iframe sandbox="allow-same-origin" srcDoc={props.data} />
    </>
  );
}
