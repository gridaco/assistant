import React from "react";
import { CodeViewWithControl } from "@app/design-to-code/code-view-with-control";
import { nodes } from "@design-sdk/core";
import { padding } from "@web-builder/styles";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  return (
    <>
      <div style={{ backgroundColor: "#1e1e1e", color: "#FFF", padding: 16 }}>
        <p>Not a component</p>
        <p>
          You have to click one of the layer that is already a component or in a
          component.
        </p>
        <div>
          <button>Move to Preview Tab</button>
          <button>Learn more</button>
        </div>
      </div>
      <CodeViewWithControl
        targetid={props.node.id}
        disabled
        editor="prism"
        customMessages={["@oops this is not a component"]}
      />
    </>
  );
}
