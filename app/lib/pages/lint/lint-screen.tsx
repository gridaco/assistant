import { Button, Typography } from "@material-ui/core";
import { ReflectLintFeedback } from "@reflect-ui/lint/lib/feedbacks";
import * as React from "react";
import { Preview } from "../../components/preview";
import { LintTreeView } from "../../lint";
import { EK_FOCUS_REQUEST } from "../../constants/ek.constant";
import styled from "@emotion/styled";
import { LintLevelIndicator } from "./lint-level-indicator";
import { LintColor } from "./lint-colors";

interface State {
  feedbacks: Array<ReflectLintFeedback>;
}

const TestObj = [
  {
    name: "MissingTextStyleWarning",
    userMessage:
      'missing text style on text node "“iPhone XS - 3” is not a valid component name"',
    node: {
      name: "“iPhone XS - 3” is not a valid component name",
      type: "TEXT",
      origin: "TEXT",
      id: "I2787:3460;2787:3435;61:171",
      parentReference: {
        name: "(base) error-line-item",
        type: "FRAME",
        origin: "INSTANCE",
        id: "I2787:3460;2787:3435",
        children: [
          {
            name: "“iPhone XS - 3” is not a valid component name",
            type: "TEXT",
            origin: "TEXT",
            id: "I2787:3460;2787:3435;61:171",
          },
          {
            name: "lint-level-indicator",
            type: "FRAME",
            origin: "INSTANCE",
            id: "I2787:3460;2787:3435;2831:11867",
          },
        ],
      },
    },
  },
  {
    name: "MissingTextStyleWarning",
    userMessage:
      'missing text style on text node "“iPhone XS - 3” is not a valid component name"',
    node: {
      name: "“iPhone XS - 3” is not a valid component name",
      type: "TEXT",
      origin: "TEXT",
      id: "I2787:3465;2787:3435;61:171",
      parentReference: {
        name: "(base) error-line-item",
        type: "FRAME",
        origin: "INSTANCE",
        id: "I2787:3465;2787:3435",
        children: [
          {
            name: "“iPhone XS - 3” is not a valid component name",
            type: "TEXT",
            origin: "TEXT",
            id: "I2787:3465;2787:3435;61:171",
          },
          {
            name: "lint-level-indicator",
            type: "FRAME",
            origin: "INSTANCE",
            id: "I2787:3465;2787:3435;2831:11867",
          },
        ],
      },
    },
  },
  {
    name: "MissingTextStyleWarning",
    userMessage:
      'missing text style on text node "“iPhone XS - 3” is not a valid component name"',
    node: {
      name: "“iPhone XS - 3” is not a valid component name",
      type: "TEXT",
      origin: "TEXT",
      id: "I2787:3470;2787:3435;61:171",
      parentReference: {
        name: "(base) error-line-item",
        type: "FRAME",
        origin: "INSTANCE",
        id: "I2787:3470;2787:3435",
        children: [
          {
            name: "“iPhone XS - 3” is not a valid component name",
            type: "TEXT",
            origin: "TEXT",
            id: "I2787:3470;2787:3435;61:171",
          },
          {
            name: "lint-level-indicator",
            type: "FRAME",
            origin: "INSTANCE",
            id: "I2787:3470;2787:3435;2831:11867",
          },
        ],
      },
    },
  },
  {
    name: "MissingTextStyleWarning",
    userMessage:
      'missing text style on text node "“iPhone XS - 3” is not a valid component name"',
    node: {
      name: "“iPhone XS - 3” is not a valid component name",
      type: "TEXT",
      origin: "TEXT",
      id: "I2787:3475;2787:3435;61:171",
      parentReference: {
        name: "(base) error-line-item",
        type: "FRAME",
        origin: "INSTANCE",
        id: "I2787:3475;2787:3435",
        children: [
          {
            name: "“iPhone XS - 3” is not a valid component name",
            type: "TEXT",
            origin: "TEXT",
            id: "I2787:3475;2787:3435;61:171",
          },
          {
            name: "lint-level-indicator",
            type: "FRAME",
            origin: "INSTANCE",
            id: "I2787:3475;2787:3435;2831:11867",
          },
        ],
      },
    },
  },
  {
    name: "MissingTextStyleWarning",
    userMessage:
      'missing text style on text node "“iPhone XS - 3” is not a valid component name"',
    node: {
      name: "“iPhone XS - 3” is not a valid component name",
      type: "TEXT",
      origin: "TEXT",
      id: "I2787:3695;2787:3435;61:171",
      parentReference: {
        name: "(base) error-line-item",
        type: "FRAME",
        origin: "INSTANCE",
        id: "I2787:3695;2787:3435",
        children: [
          {
            name: "“iPhone XS - 3” is not a valid component name",
            type: "TEXT",
            origin: "TEXT",
            id: "I2787:3695;2787:3435;61:171",
          },
          {
            name: "lint-level-indicator",
            type: "FRAME",
            origin: "INSTANCE",
            id: "I2787:3695;2787:3435;2831:11867",
          },
        ],
      },
    },
  },
];

export class LintScreen extends React.Component<any, State> {
  constructor(props) {
    super(props);

    this.state = {
      feedbacks: [],
    };
  }

  componentDidMount() {
    window.addEventListener("message", (ev: MessageEvent) => {
      const msg = ev.data.pluginMessage;
      if (msg.type == EK_LINT_FEEDBACK) {
        const feedbacks = msg.data as Array<ReflectLintFeedback>;
        this.setState((state, props) => {
          return { feedbacks: feedbacks };
        });
      }
    });
  }

  onFeedbackTap(feedback: ReflectLintFeedback) {
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

  render() {
    // const { feedbacks } = this.state;
    const feedbacks = TestObj;
    return (
      <>
        <Preview data={undefined} name="selected node name" />

        {console.log(feedbacks)}
        <ErrorWrapper>
          <ErrorTitle>{feedbacks.length} Improvements found</ErrorTitle>
          <ErrorComent>
            Across 24 layers, there were <b>4 must-fix errors</b> and 8
            warnings.
          </ErrorComent>
          <ErrorList>
            {feedbacks.map((item, i) => {
              return (
                <List key={i}>
                  <Label>{item.node.name}</Label>
                  <LintLevelIndicator color={LintColor.warn} />
                </List>
              );
            })}
          </ErrorList>
        </ErrorWrapper>
      </>
    );
  }
}

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

const ErrorList = styled.ul`
  padding: 0;
`;

const List = styled.li`
  display: flex;
  align-items: center;

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
