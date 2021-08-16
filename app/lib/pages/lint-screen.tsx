import { Button, Typography } from "@material-ui/core";
import { ReflectLintFeedback } from "@reflect-ui/lint/lib/feedbacks";
import * as React from "react";
import { Preview } from "../components/preview";
import { TreeView } from "../components/tree-view";
import { EK_FOCUS_REQUEST, EK_LINT_FEEDBACK } from "../constants/ek.constant";

interface State {
  feedbacks: Array<ReflectLintFeedback>;
}

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
    const { feedbacks } = this.state;
    return (
      <>
        <Preview data={undefined} name="selected node name" />
        <ul>
          <h1>hi</h1>
          <TreeView
            ignoredErrorArray={[]}
            // activeNodeIds={props.activeNodeIds}
            // selectedListItems={props.selectedListItems}
            errorArray={[]}
            onClick={() => {}}
            key={"elfishefl"}
            node={[{ name: "hi" }, { name: "hi" }, { name: "hi" }]}
          />
          {feedbacks.map((item, i) => {
            return (
              <li key={i}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">{item.userMessage}</Typography>
                <Button
                  onClick={() => {
                    this.onFeedbackTap(item);
                  }}
                >
                  goto
                </Button>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}
