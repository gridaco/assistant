import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  ResponsivePreview,
  ResponsivePreviewProps,
} from "../preview-responsive";
import { StaticPreview, StaticPreviewProps } from "../preview-static";
import { EmptyState } from "../components";
import { useScrollTriggeredAnimation } from "app/lib/components/motions";
import { useSetRecoilState, useRecoilState } from "recoil";
import { hide_navigation } from "app/lib/main/global-state-atoms";
import { useComponentSize } from "react-use-size";

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

interface SizeProps {
  w?: number;
  h?: number;
}

type Subscenario = StaticPreviewProps | ResponsivePreviewProps;
type Props = PreviewProps & Subscenario;

export function Preview(props: Props) {
  const previewRefWrap = useRef<HTMLDivElement>();
  const { ref: sizingref, height, width } = useComponentSize();

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
    >
      <Render id="render" ref={sizingref}>
        <>
          {props.data || props.auto ? (
            <Content previewInfo={props} parent={{ width, height }} />
          ) : (
            <div className="inner-render">{props.empty || <EmptyState />}</div>
          )}
        </>
      </Render>
    </PreviewWrap>
  );
}

function Content({
  previewInfo,
  parent,
}: {
  previewInfo: Props;
  parent: { width: number; height: number };
}) {
  switch (previewInfo.type) {
    case "responsive": {
      return <ResponsivePreview previewInfo={previewInfo} parent={parent} />;
    }
    case "static": {
      return <StaticPreview {...previewInfo} />;
    }
  }
}

const PreviewWrap = styled.div<{
  padding: number;
  initialPreviewHeight: number;
  isAutoSizable: boolean;
}>`
  padding: ${(props) => `${props.padding}px`};
  height: ${(props) =>
    props.isAutoSizable
      ? `calc(100% - ${props.padding * 2}px)`
      : `calc(${props.initialPreviewHeight}px - ${props.padding * 2}px)`};
  overflow-y: auto;
  overflow-x: hidden;
`;

const Render = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  position: relative;
  min-height: 100%;
`;
