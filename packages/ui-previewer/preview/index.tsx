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
  // using only like this - calc({resizeHeight}px - {previewWrap's padding*2}px)
  resizeHeight?: number;
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
  const previewWrapPadding = 12;

  return (
    <Container>
      <PreviewWrap
        padding={previewWrapPadding}
        resizeHeight={props.resizeHeight}
        ref={previewRefWrap}
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

const PreviewWrap = styled.div<{ padding: number; resizeHeight?: number }>`
  padding: ${(props) => `${props.padding}px`};
  background: #f1f1f1;
  height: ${(props) =>
    props.resizeHeight
      ? `calc(${props.resizeHeight}px - ${props.padding * 2}px)`
      : `calc(200px - ${props.padding * 2}px)`};
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

  .preview {
    padding: 12px;
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
