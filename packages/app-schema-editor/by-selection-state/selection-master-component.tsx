import React, { useEffect, useState } from "react";
import * as nodes from "@design-sdk/figma-node";
import { ISingleLayerProperty } from "../types";
import { NameCases, nameit } from "@coli.codes/naming";
import { MappedPropertyStorage } from "../storage";
import { CodeBox } from "@ui/codebox";
import this_interface_builder from "./selection-master-component.coli";
import { tsNamer } from "../interface-code-builder/scoped-property-id-namer";
import { stringfy } from "coli";
import { CodeStyleWrapper } from "./_shared-components";
import { SingleLayerPropertyDefinition } from "../components/single-property";
export default function (props: { node: nodes.IReflectNodeReference }) {
  const { node } = props;
  const [mappedProperties, setMappedProperties] = useState<
    ISingleLayerProperty[]
  >([]);

  const interfaceName = nameit(node.name + "-props", {
    case: NameCases.pascal,
  }).name;

  const storage = new MappedPropertyStorage(node.id);
  useEffect(() => {
    storage.getProperties().then((properties) => {
      setMappedProperties(properties);
    });
  }, []);

  const interface_code_coli = this_interface_builder({
    mainInterfaceName: interfaceName,
    properties: mappedProperties,
    propertyNamer: tsNamer(node.id),
  });
  const interface_code_string = stringfy(interface_code_coli, {
    language: "typescript",
  });

  return (
    <CodeStyleWrapper>
      <CodeBox language="typescript" code={interface_code_string} />

      {mappedProperties.map((d, i) => (
        <SingleLayerPropertyDefinition
          onRemove={() => {
            // handleOnRemove(i);
          }}
          key={d?.schema.name}
          onSave={() => {}}
          initial={d}
          suggestions={[]}
        />
      ))}
    </CodeStyleWrapper>
  );
}
