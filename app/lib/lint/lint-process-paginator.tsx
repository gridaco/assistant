import styled from "@emotion/styled";
import * as React from "react";
import CaretLeftIcon from "@assistant/icons/caret-left";
import CaretRightIcon from "@assistant/icons/caret-right";

interface Props {
  index: number;
  total: number;
  onChange?: (index: number, prev?: number, diff?: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function LintProcessPaginator(props?: Props) {
  const emmit_change = (diff: number) => {
    props.onChange?.(props.index + diff);
    if (diff > 0) {
      props.onNext?.();
    } else if (diff < 0) {
      props.onPrev?.();
    }
  };
  return (
    <Wrapper>
      <Paginator>
        {!props ? "--" : `${props.index} of ${props.total}`}
      </Paginator>
      <NextArrow
        onClick={() => {
          emmit_change(+1);
        }}
        disable={props.index === 1}
      >
        <CaretLeftIcon />
      </NextArrow>
      <BeforeArrow
        onClick={() => {
          emmit_change(-1);
        }}
        disable={props.index === props.total}
      >
        <CaretRightIcon />
      </BeforeArrow>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Paginator = styled.p`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px;
`;

const NextArrow = styled.div<{ disable: boolean }>`
  cursor: pointer;
  svg {
    fill: ${(props) => (props.disable ? "#808080" : "#000")};
  }
`;

const BeforeArrow = styled.div<{ disable: boolean }>`
  cursor: pointer;
  svg {
    fill: ${(props) => (props.disable ? "#808080" : "#000")};
  }
`;
