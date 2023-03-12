import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { ScalingContentProps } from "@code-editor/vanilla-preview";
import { StaticPreview, StaticPreviewProps } from "../preview-static-snapshot";
import { PreviewEmpty } from "../components";
import { useScrollTriggeredAnimation } from "app/lib/components/motions";
import { useSetRecoilState } from "recoil";
import { hide_navigation } from "app/lib/main/global-state-atoms";
import { InteractiveCanvas } from "../components/interactive-canvas";
import { VanillaESBuildAppRunner } from "../components/esbuild-result-preview";

const esbuild_base_html_code = `<div id="root"></div>`;

interface PreviewProps {
  auto?: boolean;
  empty?: JSX.Element;
  name?: string;
  /**
   * the background color
   * @default "transparent"
   */
  background?: React.CSSProperties["background"];
  /**
   * when used as a child of a resizable component.
   * if not, set default height in preview 200px
   */
  isAutoSizable?: boolean;
  // TODO: remove
  height?: number;
}

type EsBuildContentIframeProps = Omit<ScalingContentProps, "type"> & {
  type: "esbuild";
};

type Subscenario =
  | StaticPreviewProps
  | ScalingContentProps
  | EsBuildContentIframeProps;

type Props = PreviewProps & Subscenario;

export function Preview(props: Props) {
  const previewRefWrap = useRef<HTMLDivElement>();

  // region navigation animation global state handling by preview's scolling.
  const set_hide_navigation_state = useSetRecoilState(hide_navigation);
  const hide = useScrollTriggeredAnimation(previewRefWrap);

  useEffect(() => {
    set_hide_navigation_state(hide);
  }, [hide]);
  // endregion

  const initialPreviewHeight = 200;
  const previewWrapPadding = 0;

  return (
    <PreviewWrap
      id="preview-wrap"
      ref={previewRefWrap}
      padding={previewWrapPadding}
      isAutoSizable={props.isAutoSizable}
      initialPreviewHeight={initialPreviewHeight}
      background={props.background ?? "transparent"}
      // bgColor={handle_wrap_bg_color(props.type, !(!!props.data || props.auto))}
    >
      <>
        {props.auto || props.data ? (
          <Content {...props} />
        ) : (
          <> {props.empty || <PreviewEmpty />}</>
        )}
      </>
    </PreviewWrap>
  );
}

function Content(props: Props) {
  const _DEFAULT_SHADOW = "0px 4px 64px rgba(160, 160, 160, 0.18)";
  const _DEFAULT_BORDER_RADIUS = 4;

  switch (props.type) {
    case "scaling": {
      return (
        // TODO: replace InteractiveCanvas from module designto-code/@editor-packages
        <InteractiveCanvas defaultSize={props.origin_size}>
          <iframe
            srcDoc={props.data}
            width={"100%"}
            height={"100%"}
            allow="camera"
            style={{
              borderRadius: _DEFAULT_BORDER_RADIUS,
              boxShadow: _DEFAULT_SHADOW,
              outline: "none",
              overflow: "hidden",
              border: "none",
            }}
          />
        </InteractiveCanvas>
      );
    }
    case "esbuild": {
      return (
        <InteractiveCanvas defaultSize={props.origin_size}>
          <VanillaESBuildAppRunner
            doc={{
              html: esbuild_base_html_code,
              javascript: props.data,
            }}
            style={{
              borderRadius: _DEFAULT_BORDER_RADIUS,
              boxShadow: _DEFAULT_SHADOW,
              outline: "none",
              overflow: "hidden",
              border: "none",
            }}
          />
        </InteractiveCanvas>
      );
    }
    case "static": {
      return (
        <StaticContainer heightscale={1}>
          <StaticPreview {...props} />
        </StaticContainer>
      );
    }
  }
}

const PreviewWrap = styled.div<{
  padding: number;
  initialPreviewHeight: number;
  isAutoSizable: boolean;
  background: React.CSSProperties["background"];
}>`
  padding: ${(props) => `${props.padding}px`};
  height: ${(props) =>
    props.isAutoSizable
      ? `calc(100% - ${props.padding * 2}px)`
      : `calc(${props.initialPreviewHeight}px - ${props.padding * 2}px)`};

  background: ${(props) => props.background};
  overflow-y: auto;
  overflow-x: hidden;
`;

const StaticContainer = styled.div<{ heightscale: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex: 0 1 0;
  min-height: 100%;
`;
