import React from "react";
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

export function Preview({ ...props }: Props) {
  return (
    <Container>
      <div className="preview">
        <div className="render">
          {props.data || props.auto ? (
            <Content {...props} />
          ) : (
            <div className="inner-render">{props.empty || <EmptyState />}</div>
          )}
        </div>
      </div>
    </Container>
  );
}

function Content(props: Props) {
  switch (props.type) {
    case "responsive": {
      return <ResponsivePreview {...props} />;
    }
    case "static": {
      return <StaticPreview {...props} />;
    }
  }
}

const Container = styled.div`
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
