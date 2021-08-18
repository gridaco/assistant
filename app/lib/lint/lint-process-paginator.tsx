import styled from "@emotion/styled";
import * as React from "react";

interface Props {
  index: number;
  total: number;
}

function LeftArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
    </svg>
  );
}

function RightArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 6L8.59003 7.41L13.17 12L8.59003 16.59L10 18L16 12L10 6Z" />
    </svg>
  );
}

export function LintProcessPaginator(props?: Props) {
  return (
    <Wrapper>
      <Paginator>
        {!props ? "--" : `${props.index} of ${props.total}`}
      </Paginator>
      <NextArrow disable={props.index === 1}>
        <LeftArrow />
      </NextArrow>
      <BeforeArrow disable={props.index === props.total}>
        <RightArrow />
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
