import React from "react";
import { nodes, utils } from "@design-sdk/core";
import { variant } from "@design-sdk/figma/features";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/features/variant";
import { CodeBox } from "@ui/codebox";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const master = props.node.mainComponent;

  // 0. check if variant compat component (if it's parent is variant-set then it is.)
  // load default property set by variant namings.
  const names = variant.getVariantNamesSetFromReference_Figma(master);
  const variantProperties: variant.VariantProperty[] =
    variant.extractTypeFromVariantNames_Figma(names);

  // display available layer schema as this component's property
  return (
    <>
      <h6>instance of variant</h6>
      <CodeBox
        language="jsx"
        code={buildInterfaceString({
          name: "Props",
          properties: variantProperties.map((d) => {
            return {
              name: d.key,
              type: _FigmaVariantPropertyCompatType_to_string(d.type),
            };
          }),
        })}
      />
      <h6>Properties</h6>
      {/*  */}
      {variantProperties ? (
        <>
          <h6>variant properties</h6>
          <ul>
            {variantProperties.map((n) => {
              return (
                <li>
                  name:{n.key}, type:
                  {`${_FigmaVariantPropertyCompatType_to_string(n.type)}`}
                </li>
              );
            })}
          </ul>
          <h6>data</h6>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

interface InterfaceCodeBuilParam {
  name: string;
  properties: {
    name: string;
    type: string;
  }[];
}

import {
  InterfaceDeclaration,
  PropertySignature,
  Identifier,
  LiteralType,
  StringLiteral,
} from "coli";
import { stringfy } from "@coli.codes/export-string";
function buildInterface(p: InterfaceCodeBuilParam) {
  return new InterfaceDeclaration({
    name: p.name,
    members: p.properties.map((n) => {
      return new PropertySignature({
        name: new Identifier(n.name),
        type: new LiteralType(new StringLiteral(n.type)),
      });
    }),
  });
}

function buildInterfaceString(p: InterfaceCodeBuilParam): string {
  return interfaceColiToString(buildInterface(p));
}

function interfaceColiToString(i: InterfaceDeclaration): string {
  return stringfy(i, {
    language: "typescript",
  });
}
