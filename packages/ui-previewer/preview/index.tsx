import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import {
  ResponsivePreview,
  ResponsivePreviewProps,
} from "../preview-responsive";
import { StaticPreview, StaticPreviewProps } from "../preview-static";
import { handle_wrap_bg_color, PreviewEmpty } from "../components";
import { useScrollTriggeredAnimation } from "app/lib/components/motions";
import { useSetRecoilState } from "recoil";
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
      return <ResponsiveRender {...previewInfo} />;
    }
    case "static": {
      return (
        <Render heightscale={1}>
          <StaticPreview {...previewInfo} />
        </Render>
      );
    }
  }
}

function ResponsiveRender(props: ResponsivePreviewProps) {
  const { ref: sizingref, height, width } = useComponentSize();
  // TODO: do not remove comments here. these are required for below height calculation.
  // DON'T REMOVE
  // const [renderheightScaleFactor, setRenderheightScaleFactor] = useState(1);

  return (
    <Render
      ref={sizingref}
      heightscale={1}
      // DON'T REMOVE
      // heightscale={renderheightScaleFactor}
    >
      <ResponsivePreview
        previewInfo={props}
        parent={{ width, height }}
        onScaleChange={() => {}}
        // DON'T REMOVE
        // onScaleChange={setRenderheightScaleFactor}
      />
    </Render>
  );
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

const Render = styled.div<{ heightscale: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex: 0 1 0;
  /* FIXME: this should be a height
  // this should work, but the flex is making inner iframe height to shrink.
  height: max(${(props) => props.heightscale * 100}%, 100%);
    ref:
    - https://stackoverflow.com/questions/51288769/scaling-a-flexbox-child-with-transform-leaves-empty-space
    - https://www.reddit.com/r/css/comments/q5cvei/css_fitcontent_on_parent_wont_work_for_scaled_item/
  */
  min-height: 100%;
`;
