import styled from "@emotion/styled";
import * as React from "react";

interface Props {
  index: number;
  total: number;
}
const LeftArrow = require("../../../lib/components/assets/pre-before-paginator.svg");
const RightArrow = require("../../../lib/components/assets/pre-next-paginator.svg");

export function LintProcessPaginator(props?: Props) {
  return (
    <Wrapper>
      <Paginator>
        {!props ? "--" : `${props.index} of ${props.total}`}
      </Paginator>
      <NextArrow disable={props.index === 1} />
      <BeforeArrow disable={props.index === props.total} />
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

const NextArrow = styled(LeftArrow)<{ disable: boolean }>`
  fill: ${(props) => (props.disable ? "#808080" : "#000")};
`;

const BeforeArrow = styled(RightArrow)<{ disable: boolean }>`
  fill: ${(props) => (props.disable ? "#808080" : "#000")};
`;
