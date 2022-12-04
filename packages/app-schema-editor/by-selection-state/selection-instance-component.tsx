import React, { useEffect, useState } from "react";
import * as nodes from "@design-sdk/figma-node";
import { ISingleLayerProperty } from "../types";
import { NameCases, nameit } from "@coli.codes/naming";
import { MappedPropertyStorage } from "../storage";
import { CodeBox } from "@ui/codebox";
import { buildeExampleDataDeclaration } from "../interface-code-builder";
import this_interface_builder from "./selection-instance-component.coli";
import { tsNamer } from "../interface-code-builder/scoped-property-id-namer";
import { stringfy } from "coli";
import { CodeStyleWrapper } from "./_shared-components";
import { SingleLayerPropertyDefinition } from "../components/single-property";

export default function (props: { node: nodes.IReflectNodeReference }) {
  const [properties, setProperties] = useState<ISingleLayerProperty[]>([]);

  const master = props.node.mainComponent;
  const interfaceName = nameit(master.name + "-props", {
    case: NameCases.pascal,
  }).name;

  const storage = new MappedPropertyStorage(master.id);
  useEffect(() => {
    storage.getProperties().then((properties) => {
      setProperties(properties);
    });
  }, []);

  const interface_code_coli = this_interface_builder({
    mainInterfaceName: interfaceName,
    properties: properties,
    propertyNamer: tsNamer(master.id),
  });
  const interface_code_string = stringfy(interface_code_coli, {
    language: "typescript",
  });

  const properties_as_data_map = properties.reduce(function (map, p) {
    map[p.schema.name] = p.schema.type;
    return map;
  }, {});

  return (
    <CodeStyleWrapper>
      <CodeBox language="typescript" code={interface_code_string} />

      <CodeBox
        language="jsx"
        code={buildeExampleDataDeclaration({
          name: "data",
          interfaceName: interfaceName,
          properties: properties_as_data_map,
        })}
      />

      {properties.map((d, i) => (
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
