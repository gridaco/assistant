import React, { useState, useEffect } from "react";
import * as nodes from "@design-sdk/figma-node";
import {
  FigmaNumber,
  VariantProperty,
  VariantPropertyParser,
} from "@design-sdk/figma/dist/features/variant";
import { CodeBox } from "@ui/codebox";
import {
  buildeExampleDataDeclaration,
  buildInterfaceString,
  jsxViewExampleBuilder,
} from "../interface-code-builder";
import { nameit, NameCases } from "@coli.codes/naming";
import { ISingleLayerProperty } from "../types";
import { MappedPropertyStorage } from "../storage";
import { CodeStyleWrapper } from "./_shared-components";
import { SingleLayerPropertyDefinition } from "../components/single-property";

export default function (props: { node: nodes.IReflectNodeReference }) {
  const master = props.node;
  const [mappedProperties, setMappedProperties] =
    useState<ISingleLayerProperty[]>(null);
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
          properties: merged_properties.map((d) => {
            return {
              name: d.key,
              type: d.type,
            };
          }),
        })}
      />
      <CodeBox
        language="jsx"
        code={buildeExampleDataDeclaration({
          name: "data",
          interfaceName: interfaceName,
          properties: data_of_properties,
        })}
      />

      <CodeBox
        language="jsx"
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
  );
}
