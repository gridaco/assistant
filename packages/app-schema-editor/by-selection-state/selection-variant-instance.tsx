import React, { useState, useEffect } from "react";
import * as nodes from "@design-sdk/figma-node";
import {
  _FigmaVariantPropertyCompatType_to_string,
  VariantPropertyParser,
  FigmaNumber,
  VariantProperty,
} from "@design-sdk/figma/dist/features/variant";
import { CodeBox } from "@ui/codebox";
import {
  buildeExampleDataDeclaration,
  buildInterfaceString,
  jsxViewExampleBuilder,
} from "../interface-code-builder";
import { nameit, NameCases } from "@coli.codes/naming";
import { PropsInterfaceView } from "../components/props-interface-view";
import styled from "@emotion/styled";
import { MappedPropertyStorage } from "../storage";
import { ISingleLayerProperty } from "../types";
import { SingleLayerPropertyDefinition } from "../components/single-property";

export default function (props: { node: nodes.IReflectNodeReference }) {
  const _format_interface_pascal = (n) => {
    return nameit(n + "-props", {
      case: NameCases.pascal,
    }).name;
  };

  const [mappedProperties, setMappedProperties] =
    useState<ISingleLayerProperty[]>(null);
  const [interfaceName, setInterfaceName] = useState(
    _format_interface_pascal(props.node.name)
  );

  const formattedInterfaceName = _format_interface_pascal(interfaceName);

  const master = props.node.mainComponent;
  const mappedPropertyStorage = new MappedPropertyStorage(master.id);
  useEffect(() => {
    mappedPropertyStorage.getProperties().then((properties) => {
      setMappedProperties(properties);
    });
  }, []);
  const parser = new VariantPropertyParser(master);
  const data_of_properties = parser.getData(master);

  const merged_properties: VariantProperty[] = [
    ...parser.properties,
    ...(mappedProperties?.map((i) => {
      return {
        key: i.schema.name,
        type: FigmaNumber, // FIXME: change this to - i.schema.type
        nullable: false, // TODO:
      } as VariantProperty;
    }) || []),
  ];

  const interface_raw_code = buildInterfaceString({
    name: formattedInterfaceName,
    properties: parser.properties.map((d) => {
      return {
        name: d.key,
        type: d.type,
      };
    }),
  });
  const viewName = nameit(master.parent.name, {
    case: NameCases.pascal,
  }).name;
  // display available layer schema as this component's property

  return (
    <>
      <CodeStyleWrapper>
        {/* TODO: add copy  - 1interface_raw_code1 */}
        <CodeBox
          language="ts"
          code={buildInterfaceString({
            name: interfaceName,
            properties: merged_properties.map((d) => {
              return {
                name: d.key,
                type: d.type,
              };
            }),
          })}
        />

        <CodeBox
          language="ts"
          code={buildeExampleDataDeclaration({
            name: "data",
            interfaceName: formattedInterfaceName,
            properties: data_of_properties,
          })}
        />

        <CodeBox
          language="tsx"
          code={jsxViewExampleBuilder({
            viewTag: viewName,
            typeReference: viewName,
            properties: data_of_properties,
          })}
        />
        {mappedProperties?.map((d, i) => (
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
    </>
  );
}

const CodeStyleWrapper = styled.div`
  height: calc(100vh - 292px);
  background: #1e1e1e;
  overflow: auto;
  padding: 0 6px;
`;
