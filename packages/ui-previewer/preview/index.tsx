import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  ResponsivePreview,
  ResponsivePreviewProps,
} from "../preview-responsive";
import { StaticPreview, StaticPreviewProps } from "../preview-static";
import { EmptyState } from "../components";
import { calc } from "@web-builder/styles";

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

  useEffect(() => {
    if (previewRefWrap.current) {
      setsize(previewRefWrap.current?.offsetWidth);
    }
  }, []);

  const initialPreviewHeight = 200;
  const previewWrapPadding = 0;
  return (
    <Container>
      <PreviewWrap
        ref={previewRefWrap}
        padding={previewWrapPadding}
        isAutoSizable={props.isAutoSizable}
        initialPreviewHeight={initialPreviewHeight}
      >
        <Render>
          {props.data || props.auto ? (
            <>{size && <Content props={props} pW={size} />}</>
          ) : (
            <div className="inner-render">{props.empty || <EmptyState />}</div>
          )}
        </Render>
      </PreviewWrap>
    </Container>
  );
}

function Content({ props, pW }: { props: Props; pW: number }) {
  switch (props.type) {
    case "responsive": {
      return <ResponsivePreview props={props} parentWidth={pW} />;
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
  background: #f1f1f1;
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
  height: auto;
  /* text-align: center; */
`;

const Container = styled.div`
  /* To be deleted later */

  height: 100%;

  .preview {
    background: #f1f1f1;
    height: calc(200px - 24px);
  }

  .preview-loading {
    width: 100%;
    background-color: gray;
  }

  .render {
    /* .render height equal .preview height */
    width: 100%;
    height: calc(200px - 24px);
    text-align: center;
    object-fit: contain;
    display: table;
  }

  .inner-render {
    margin: 0 auto;
    display: table-cell;
    vertical-align: middle;
  }

  .rendering-notify {
    color: #adaeb2;
    font-size: 18px;
  }
`;
