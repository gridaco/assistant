import { Button, Typography } from "@material-ui/core";
import { ReflectLintFeedback } from "@reflect-ui/lint/lib/feedbacks";
import * as React from "react";
import { Preview } from "../../components/preview";
import { LintTreeView } from "../../lint";
import { EK_FOCUS_REQUEST } from "../../constants/ek.constant";
import styled from "@emotion/styled";
import { LintLevelIndicator } from "./lint-level-indicator";
import { Level } from "./lint-colors";
import { _APP_EVENT_LINT_RESULT_EK } from "../../lint/__plugin/events";
import {
  BlackButton,
  TransparencyButton,
} from "../../components/style/global-style";
import { makeSummary, requestLintOnCurrentSelection } from "../../lint/actions";
import { useSingleSelection } from "../../utils/plugin-hooks";

interface State {
  feedbacks: Array<ReflectLintFeedback>;
  selection: any;
}

export const LintScreen = () => {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     feedbacks: [],
  //     selection: useSelection(),
  //   };
  // }

  // componentDidMount() {
  // console.log(_selection);
  // this.setState({ selection: _selection });

  const [feedbacks, setFeedbacks] = React.useState<ReflectLintFeedback[]>([]);

  const selection = useSingleSelection();

  console.log("feedbacks: ", feedbacks);
  // console.log("selection: ", _s);

  window.addEventListener("message", (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg.type == _APP_EVENT_LINT_RESULT_EK) {
      const _feedbacks = msg.data as Array<ReflectLintFeedback>;
      setFeedbacks(_feedbacks);
    }
  });
  // }

  function onFeedbackTap(feedback: ReflectLintFeedback) {
    const targetNodeId = feedback.node.id;
    console.log(targetNodeId);
    // move to target element
    parent.postMessage(
      {
        pluginMessage: {
          type: EK_FOCUS_REQUEST,
          data: {
            id: targetNodeId,
          },
        },
      },
      "*"
    );
  }

  function handleSelectionLayer() {
    return (
      <>
        {feedbacks ? (
          <>
            <RunLintTitle>Run lint on “example”</RunLintTitle>
            <RunLintSubTitle>
              Run lint under “example” Across {feedbacks.length} layers.
            </RunLintSubTitle>
          </>
        ) : (
          <>
            <ErrorTitle>{feedbacks.length} Improvements found</ErrorTitle>
            <ErrorComent>
              {console.log(makeSummary(feedbacks))}
              Across 24 layers, there were <b>4 must-fix errors</b> and 8
              warnings.
            </ErrorComent>
          </>
        )}
      </>
    );
  }

  function ErrorLineItem() {
    return (
      <>
        <ErrorList>
          {feedbacks.map((item, i) => {
            return (
              <List key={i} onClick={() => onFeedbackTap(item)}>
                <Label>{item.userMessage}</Label>
                <LintLevelIndicator color={item.level} />
              </List>
            );
          })}
        </ErrorList>
      </>
    );
  }

  return (
    <>
      <Preview data={undefined} name="selected node name" />
      <ErrorWrapper>
        {!!selection ? (
          <>{handleSelectionLayer()}</>
        ) : (
          <>
            <EmptyMessage>{`Select a layer / frame to run lint on :)`}</EmptyMessage>
          </>
        )}

        {ErrorLineItem()}
        {/* {!!feedbacks ? ( */}
        {!feedbacks ? (
          <RunLintButtton
            disabled={!selection}
            onClick={requestLintOnCurrentSelection}
          >
            Run lint
          </RunLintButtton>
        ) : (
          <UnderBtnWrapper>
            <FirstErrorButton>Jump to first error</FirstErrorButton>
            <ClearButton>Clear</ClearButton>
          </UnderBtnWrapper>
        )}
      </ErrorWrapper>
    </>
  );
};

const ErrorWrapper = styled.div`
  margin: 0 8px;
`;

const ErrorTitle = styled.h6`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #000;
  margin: 0;
  margin-top: 24px;
`;

const ErrorComent = styled.h6`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  color: #959595;

  b {
    font-size: 12px;
    font-weight: 700;
    line-height: 15px;
  }
`;

const EmptyMessage = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;

  color: #8d8d8d;
`;

const ErrorList = styled.ul`
  padding: 0;
`;

const UnderBtnWrapper = styled.div`
  width: calc(100% - 32px);
  display: flex;
  position: absolute;
  bottom: 16px;
`;

const RunLintButtton = styled.button`
  ${BlackButton}
  width: calc(100% - 32px);
  position: absolute;
  bottom: 16px;
`;

const FirstErrorButton = styled.button`
  ${BlackButton}
  width: 66.6666%;
  margin-right: 8px;
`;

const ClearButton = styled.button`
  ${TransparencyButton}
  width: 33.3333%;
`;

const RunLintTitle = styled.h2`
  // Run lint on “example”
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;

  color: #000000;
`;

const RunLintSubTitle = styled.h5`
  margin: 0;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;

  color: #959595;
`;

const List = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.h6`
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  list-style-type: none;
  color: #242424;

  margin: 0;
  margin-right: auto;
`;
