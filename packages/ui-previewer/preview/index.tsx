import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  ResponsivePreview,
  ResponsivePreviewProps,
} from "../preview-responsive";
import { StaticPreview, StaticPreviewProps } from "../preview-static";
import { EmptyState } from "../components";

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
  return (
    <Container>
      <PreviewWrap ref={previewRefWrap}>
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

const PreviewWrap = styled.div`
  padding: 12px;
  background: #f1f1f1;
  height: calc(200px - 24px);
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
