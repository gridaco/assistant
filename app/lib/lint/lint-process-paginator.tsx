import styled from "@emotion/styled";
import * as React from "react";
import CaretLeftIcon from "@assistant/icons/caret-left";
import CaretRightIcon from "@assistant/icons/caret-right";

interface Props {
  /** starts from 0 */
  index: number;
  /** length of data */
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
        {!props ? "--" : `${props.index + 1} of ${props.total}`}
      </Paginator>
      <Cursor
        onClick={() => {
          emmit_change(-1);
        }}
        disabled={props.index <= 0}
        disable={props.index <= 0} /* style FIXME:@You-J*/
      >
        <CaretLeftIcon />
      </Cursor>
      <Cursor
        onClick={() => {
          emmit_change(+1);
        }}
        disabled={props.index >= props.total - 1}
        disable={props.index >= props.total - 1} /* style FIXME:@You-J*/
      >
        <CaretRightIcon />
      </Cursor>
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

const Cursor = styled.button<{ disable: boolean }>`
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  svg {
    fill: ${(props) => (props.disable ? "#808080" : "#000")};
  }
`;
