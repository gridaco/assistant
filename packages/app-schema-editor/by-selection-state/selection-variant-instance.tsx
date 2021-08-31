import React from "react";
import { nodes, utils } from "@design-sdk/core";
import { variant } from "@design-sdk/figma/features";
import {
  FigmaBoolean,
  FigmaNumber,
  FigmaUnique,
  _FigmaVariantPropertyCompatType_to_string,
} from "@design-sdk/figma/features/variant";
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
              type: d.type,
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
    type: variant.FigmaVariantPropertyCompatType;
  }[];
}

import {
  InterfaceDeclaration,
  PropertySignature,
  Identifier,
  LiteralType,
  StringLiteral,
  UnionType,
  BooleanKeyword,
  NumberKeyword,
} from "coli";

import { stringfy } from "@coli.codes/export-string";
function buildInterface(p: InterfaceCodeBuilParam) {
  const _make_type = (t: variant.FigmaVariantPropertyCompatType) => {
    if (t == FigmaNumber) {
      return new NumberKeyword();
    } else if (t == FigmaBoolean) {
      return new BooleanKeyword();
    } else if (t.type == "unique") {
      return new LiteralType(new StringLiteral(t.value));
    } else if (t.type == "enum") {
      return new UnionType({
        types: t.values.map((v) => {
          return new LiteralType(new StringLiteral(v));
        }),
      });
    }
  };

  return new InterfaceDeclaration({
    name: p.name,
    members: p.properties.map((n) => {
      return new PropertySignature({
        name: new Identifier(n.name),
        type: _make_type(n.type),
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
