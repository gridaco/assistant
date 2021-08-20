import styled from "@emotion/styled";
import React, { useState } from "react";
import { ReflectLintFeedback } from "../../../../packages/lint/lib/feedbacks";
import { BlackButton } from "../../components/style/global-style";
import { LintItemRow } from "../../lint";
import { rowDummy } from "../../lint/lint-list-view";
import { LintProcessPaginator } from "../../lint/lint-process-paginator";
import { _APP_EVENT_LINT_RESULT_EK } from "../../lint/__plugin/events";
import BackArrowIcon from "@assistant/icons/back-arrow";

/** Fix your self as page with router props ver. (not used. planned.) */
export function FixYourSelfPage(props: {
  proc: string | "current"; // id of lint proc
}) {
  throw "not implemented";
}

interface LayerLint {
  node: { id: string; name: string };
  feedbacks: ReflectLintFeedback[];
}

/**
 * manual fixing mode of feedbacks grouped by layer.
 * grouping logic live inside this component.
 **/
export function FixYourSelf(props: {
  onClose: () => void;
  feedbacks: ReflectLintFeedback[];
}) {
  const [isDropVisible, setIsDropVisible] = useState(-1);
  const { feedbacks } = props;
  const layerlints: LayerLint[] = []; // TODO: convert feedbacks to array of lints by layer.

  return (
    <Wrapper>
      <BackIcon onClick={props.onClose}>
        <BackArrowIcon />
      </BackIcon>

      {feedbacks.map((item, i) => {
        console.log(item);
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
        <LintProcessPaginator
          onChange={() => {
            //
          }}
          index={10}
          total={10}
        />
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
