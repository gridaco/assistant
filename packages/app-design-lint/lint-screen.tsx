import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { PluginSdk } from "@plugin-sdk/app";
import { ReflectLintFeedback } from "@reflect-ui/lint/lib/feedbacks";
import {
  /* non used (planned. do not remove) */
  LintItemRow,
  /* non used (planned. do not remove) */
  LintTreeView,
  LintLevelIndicator,
} from "@app/design-lint";
import { _APP_EVENT_LINT_RESULT_EK } from "@app/design-lint/__plugin/events";
import {
  BlackButtonStyle,
  TransparentButtonStyle,
} from "@ui/core/button-style";
import { useSingleSelection } from "plugin-app";
import { makeSummary, requestLintOnCurrentSelection } from "./actions";
import { FixYourSelf } from "./fix-your-self";
import { mapGrandchildren } from "@design-sdk/figma-utils";
import Dialog from "@material-ui/core/Dialog";
import { requiresEarlyAccess } from "@assistant-fp/early-access";

export const LintScreen = () => {
  const [feedbacks, setFeedbacks] = useState<ReflectLintFeedback[]>([]);
  const [isFixingMode, setIsFixingMode] = useState<boolean>(false);
  const selection = useSingleSelection();

  const messagehandler = (ev: MessageEvent) => {
    const msg = ev.data.pluginMessage;
    if (msg && msg.type == _APP_EVENT_LINT_RESULT_EK) {
      const _feedbacks = msg.data as Array<ReflectLintFeedback>;
      if (_feedbacks.length === 0) {
        PluginSdk.notify("🤩 Neat and clean (nothing to clean)", 2);
      } else {
        setFeedbacks(_feedbacks);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", messagehandler);
    return () => {
      window.removeEventListener("message", messagehandler);
    };
  }, []);

  function countSelection() {
    return mapGrandchildren(selection.node, null, {
      includeThis: true,
    }).length;
  }

  const onFeedbackTap = requiresEarlyAccess((feedback: ReflectLintFeedback) => {
    const targetNodeId = feedback.node.id;
    PluginSdk.focus(targetNodeId);
  });

  function handleSelectionLayer() {
    const summary = makeSummary(feedbacks);

    return (
      <>
        {feedbacks.length === 0 ? (
          <>
            <RunLintTitle>
              Run lint on “{_makeshortname(selection.node.name)}”
            </RunLintTitle>
            <RunLintSubTitle>
              Run lint under “{_makeshortname(selection.node.name, 80)}” Across
              {"  "}
              {countSelection()}
              {"  "}
              layers.
            </RunLintSubTitle>
          </>
        ) : (
          <>
            <ErrorTitle>{feedbacks.length} Improvements found</ErrorTitle>
            <ErrorComent>
              Across {summary.layers} layers, there were{" "}
              <b>{summary.errors} must-fix errors</b>
              <br />
              and {summary.warnings} warnings.
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
                <IndicatorBox>
                  <LintLevelIndicator color={item.level} />
                </IndicatorBox>
              </List>
            );
          })}
        </ErrorList>
      </>
    );
  }

  return (
    <>
      {/* <Preview data={undefined} name="selected node name" /> */}
      <Wrapper>
        {!!selection ? (
          <>{handleSelectionLayer()}</>
        ) : (
          <>
            <EmptyMessage>{`Select a layer / frame to run lint on :)`}</EmptyMessage>
          </>
        )}

        {ErrorLineItem()}
        <FooterActionsWrapper>
          {feedbacks.length === 0 ? (
            <RunLintButtton
              disabled={!selection}
              onClick={requestLintOnCurrentSelection}
            >
              Run lint
            </RunLintButtton>
          ) : (
            <>
              <FirstErrorButton
                onClick={() => {
                  setIsFixingMode(true);
                }}
              >
                Jump to first error
              </FirstErrorButton>
              <ClearButton
                onClick={() => {
                  setFeedbacks([]); // clear feedbacks
                }}
              >
                Clear
              </ClearButton>
            </>
          )}
        </FooterActionsWrapper>
      </Wrapper>
      <Dialog open={isFixingMode} fullScreen>
        <FixYourSelf
          feedbacks={feedbacks}
          onClose={() => {
            setIsFixingMode(false);
          }}
        />
      </Dialog>
    </>
  );
};

function _makeshortname(origin: string, cut?: number): string {
  const _cut = cut || 48;
  return _cut < origin.length ? origin.substring(0, _cut) + "..." : origin;
}

const Wrapper = styled.div`
  margin: 0 16px;
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
  margin: 0;
  margin-top: 5px;
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

  /* use only make center */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ErrorList = styled.ul`
  padding: 0;

  // FIXME:
  /* 158 is Navigation (140px) +  ErrorTitle (44px) + ErrorComent (34px) +  UnderBtnWrapper (48px)  */
  height: calc(100vh - 298px);
  overflow-y: scroll;
`;

const FooterActionsWrapper = styled.div`
  position: fixed;
  display: flex;
  margin: 0 16px;
  bottom: 16px;
  right: 0;
  left: 0;
`;

const RunLintButtton = styled.button`
  ${BlackButtonStyle}
  width: 100%;
`;

const FirstErrorButton = styled.button`
  ${BlackButtonStyle}
  /* temp before add button component */
  width: 61%;
  margin-right: 8px;
`;

const ClearButton = styled.button`
  ${TransparentButtonStyle}
  /* temp before add button component */
  width: 36%;
  background: #fff;
`;

const RunLintTitle = styled.h2`
  // Run lint on “example”
  word-wrap: break-word;
  max-lines: 3;
  text-overflow: ellipsis;

  margin: 0;
  margin-top: 20px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;

  color: #000000;
`;

const RunLintSubTitle = styled.h5`
  word-wrap: break-word;
  max-lines: 3;
  text-overflow: ellipsis;

  margin: 0;
  margin-top: 5px;
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
  margin: 0;
  max-width: calc(100% - 18px); // FIXME:
  margin-top: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  list-style-type: none;
  color: #242424;

  margin-right: auto;
`;

const IndicatorBox = styled.div`
  margin-left: 10px;
`;
