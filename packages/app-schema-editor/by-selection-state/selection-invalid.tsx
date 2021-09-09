import React from "react";
import { CodeViewWithControl } from "@app/design-to-code/code-view-with-control";
import { nodes } from "@design-sdk/core";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  return (
    <>
      <p>Not a component</p>
      <p>
        You have to click one of the layer that is already a component or in a
        component.
      </p>
      <div>
        <button>Move to Preview Tab</button>
        <button>Learn more</button>
      </div>
      <CodeViewWithControl targetid={props.node.id} />
    </>
  );
}
