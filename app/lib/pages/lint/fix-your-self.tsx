import styled from "@emotion/styled";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { BlackButton } from "../../components/style/global-style";
import { LintItemRow } from "../../lint";
import { rowDummy } from "../../lint/lint-list-view";
import { LintProcessPaginator } from "../../lint/lint-process-paginator";

export function FixYourSelf() {
  const history = useHistory();
  const [isDropVisible, setIsDropVisible] = useState(-1);

  function LeftArrow() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
          fill="black"
        />
      </svg>
    );
  }
  return (
    <Wrapper>
      <BackIcon
        onClick={() => {
          history.goBack();
        }}
      >
        <LeftArrow />
      </BackIcon>

      {["hi"].map((item, i) => {
        return (
          <LintItemRow
            {...rowDummy}
            expand={isDropVisible === i}
            onTap={() => {
              if (isDropVisible === i) {
                setIsDropVisible(-1);
              } else {
                setIsDropVisible(i);
              }
            }}
          />
        );
      })}

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
