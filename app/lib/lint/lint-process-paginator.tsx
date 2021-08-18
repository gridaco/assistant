import styled from "@emotion/styled";
import * as React from "react";

interface Props {
  index: number;
  total: number;
}
const LeftArrow = require("../components/assets/prev-before-paginator.svg");
const RightArrow = require("../components/assets/prev-next-paginator.svg");

export function LintProcessPaginator(props?: Props) {
  return (
    <Wrapper>
      <Paginator>
        {!props ? "--" : `${props.index} of ${props.total}`}
      </Paginator>
      <NextArrow src={LeftArrow} disable={props.index === 1} />
      <BeforeArrow src={RightArrow} disable={props.index === props.total} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
`;

const Paginator = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px;
`;

const NextArrow = styled.img<{ disable: boolean }>`
  fill: ${(props) => (props.disable ? "#808080" : "#000")};
`;

const BeforeArrow = styled.img<{ disable: boolean }>`
  fill: ${(props) => (props.disable ? "#808080" : "#000")};
`;
