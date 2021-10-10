import React, { MutableRefObject, useEffect, useRef, useState } from "react";
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
import { editor_size } from "app/lib/main/global-state-atoms";

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
}

type Subscenario = StaticPreviewProps | ResponsivePreviewProps;
type Props = PreviewProps & Subscenario;

export function Preview(props: Props) {
  const previewRefWrap = useRef<HTMLDivElement>();
  const [size, setsize] = useState(undefined);

  // region navigation animation global state handling by preview's scolling.
  const set_hide_navigation_state = useSetRecoilState(hide_navigation);
  const hide = useScrollTriggeredAnimation(previewRefWrap);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setsize(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    if (previewRefWrap.current) {
      setsize(previewRefWrap.current?.offsetWidth);
    }
  }, [previewRefWrap]);

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
      <Render id="render">
        <>
          {props.data || props.auto ? (
            <>{size && <Content props={props} wrapWidth={size} />}</>
          ) : (
            <div className="inner-render">{props.empty || <EmptyState />}</div>
          )}
        </>
      </Render>
    </PreviewWrap>
  );
}

function Content({ props, wrapWidth }: { props: Props; wrapWidth: number }) {
  switch (props.type) {
    case "responsive": {
      return <ResponsivePreview props={props as any} parentWidth={wrapWidth} />;
    }
    case "static": {
      return <StaticPreview {...props} />;
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
  position: relative;
  width: 100%;
  height: 100%;
`;

// const Container = styled.div`
//   /* To be deleted later */

//   /* height: 100%; */
//   /*
//   .preview {
//     background: #f1f1f1;
//     height: calc(200px - 24px);
//   } */
//   /*
//   .preview-loading {
//     width: 100%;
//     background-color: gray;
//   } */
//   /*
//   .render {
//     .render height equal .preview height
//     width: 100%;
//     height: calc(200px - 24px);
//     text-align: center;
//     object-fit: contain;
//     display: table;
//   }
//   */

//   /* .inner-render {
//     margin: 0 auto;
//     display: table-cell;
//     vertical-align: middle;
//   } */
//   /*
//   .rendering-notify {
//     color: #adaeb2;
//     font-size: 18px;
//   } */
// `;
