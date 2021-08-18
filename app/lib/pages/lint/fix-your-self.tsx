import styled from "@emotion/styled";
import React from "react";
import { BlackButton } from "../../components/style/global-style";
import { LintItemRow } from "../../lint";
import { rowDummy } from "../../lint/lint-list-view";
import { LintProcessPaginator } from "../../lint/lint-process-paginator";

export function FixYourSelf() {
  const LeftArrow = require("../../components/assets/left-arrow.svg");
  return (
    <Wrapper>
      <BackIcon>
        <img src={LeftArrow} />
      </BackIcon>

      <LintItemRow {...rowDummy} />
      <Pagination>
        <LintProcessPaginator index={10} total={10} />
      </Pagination>

      <NextLayerBtn>Next Layer</NextLayerBtn>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 16px 8px;
`;

const BackIcon = styled.div`
  margin-bottom: 24px;
`;

const Pagination = styled.div`
  position: absolute;
  bottom: 83px;
  right: 16px;
`;

const NextLayerBtn = styled.button`
  ${BlackButton}
  width: calc(100% - 32px);
  position: absolute;
  bottom: 16px;
  left: 16px;
`;
