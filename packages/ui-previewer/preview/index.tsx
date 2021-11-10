import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import VanillaPreview, {
  ResponsiveContentIframeProps,
} from "@code-editor/vanilla-preview";
import { StaticPreview, StaticPreviewProps } from "../preview-static";
import { handle_wrap_bg_color, PreviewEmpty } from "../components";
import { useScrollTriggeredAnimation } from "app/lib/components/motions";
import { useSetRecoilState } from "recoil";
import { hide_navigation } from "app/lib/main/global-state-atoms";

interface PreviewProps {
  auto?: boolean;
  empty?: JSX.Element;
  name?: string;
  /**
   * the background color
   * @deprecated not implemented
   */
  background?: string;
  type?: string;
  /**
   * when used as a child of a resizable component.
   * if not, set default height in preview 200px
   */
  isAutoSizable?: boolean;
  // TODO: remove
  height?: number;
}

type Subscenario = StaticPreviewProps | ResponsiveContentIframeProps;
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
      bgColor={handle_wrap_bg_color(props.type, !(!!props.data || props.auto))}
    >
      <>
        {props.data || props.auto ? (
          <Content previewInfo={props} />
        ) : (
          <> {props.empty || <PreviewEmpty type={props.type} />}</>
        )}
      </>
    </PreviewWrap>
  );
}

function Content({ previewInfo }: { previewInfo: Props }) {
  switch (previewInfo.type) {
    case "responsive": {
      const _DEFAULT_MARGIN = 12;
      const _DEFAULT_SHADOW = "0px 4px 64px rgba(160, 160, 160, 0.18)";
      const _DEFAULT_BORDER_RADIUS = 4;

      return (
        <VanillaPreview
          {...previewInfo}
          margin={_DEFAULT_MARGIN}
          borderRadius={_DEFAULT_BORDER_RADIUS}
          boxShadow={_DEFAULT_SHADOW}
        />
      );
    }
    case "static": {
      return (
        <StaticContainer heightscale={1}>
          <StaticPreview {...previewInfo} />
        </StaticContainer>
      );
    }
  }
}

const PreviewWrap = styled.div<{
  padding: number;
  initialPreviewHeight: number;
  isAutoSizable: boolean;
  bgColor: string;
}>`
  padding: ${(props) => `${props.padding}px`};
  height: ${(props) =>
    props.isAutoSizable
      ? `calc(100% - ${props.padding * 2}px)`
      : `calc(${props.initialPreviewHeight}px - ${props.padding * 2}px)`};

  background-color: ${(props) => props.bgColor};

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
