import React from "react";
import { nodes } from "@design-sdk/core";
import { PropsInterfaceView } from "../interface-code-builder/props-interface-view";
import { NameCases, nameit } from "@coli.codes/naming";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const master = props.node.mainComponent;
  const interfaceName = nameit(master.name + "-props", {
    case: NameCases.pascal,
  }).name;

  return (
    <>
      <PropsInterfaceView
        onInterfaceNameChange={() => {}}
        properties={[]}
        initialInterfaceName={interfaceName}
        onChange={() => {}}
      />
    </>
  );
}
