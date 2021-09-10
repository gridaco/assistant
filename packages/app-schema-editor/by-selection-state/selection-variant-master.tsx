import React, { useState, useEffect } from "react";
import { nodes } from "@design-sdk/core";
import {
  FigmaNumber,
  VariantProperty,
  VariantPropertyParser,
} from "@design-sdk/figma/features/variant";
import { CodeBox } from "@ui/codebox";
import {
  buildeExampleData,
  buildInterfaceString,
  jsxViewExampleBuilder,
} from "../interface-code-builder";
import { nameit, NameCases } from "@coli.codes/naming";
import { PropsInterfaceView } from "../interface-code-builder/props-interface-view";
import styled from "@emotion/styled";
import { ISingleLayerProperty } from "../types";
import { MappedPropertyStorage } from "../storage";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const master = props.node;
  const [mappedProperties, setMappedProperties] = useState<
    ISingleLayerProperty[]
  >(null);
  const parser = new VariantPropertyParser(master);
  const data_of_properties = parser.getData(master);
  const interfaceName = nameit(master.parent.name + "-props", {
    case: NameCases.pascal,
  }).name;

  const viewName = nameit(master.parent.name, {
    case: NameCases.pascal,
  }).name;

  const mappedPropertyStorage = new MappedPropertyStorage(master.id);
  useEffect(() => {
    mappedPropertyStorage.getProperties().then((properties) => {
      setMappedProperties(properties);
    });
  }, []);
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

  return (
    <CodeStyleWrapper>
      <CodeBox
        language="jsx"
        code={buildInterfaceString({
          name: interfaceName,
          properties: parser.properties.map((d) => {
            return {
              name: d.key,
              type: d.type,
            };
          }),
        })}
      />
      <CodeBox
        language="jsx"
        code={buildeExampleData({
          name: "data",
          interfaceName: interfaceName,
          properties: data_of_properties,
        })}
      />

      <CodeBox
        language="jsx"
        code={jsxViewExampleBuilder({
          varName: "view",
          viewTag: viewName,
          typeReference: viewName,
          properties: data_of_properties,
        })}
      />
    </CodeStyleWrapper>
  );
}

const CodeStyleWrapper = styled.div`
  height: calc(100vh - 292px);
  background: #1e1e1e;
  overflow: auto;
  padding: 0 6px;
`;
