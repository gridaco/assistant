import { variant } from "@design-sdk/figma/features";
import {
  FigmaBoolean,
  FigmaNumber,
  FigmaUnique,
  _FigmaVariantPropertyCompatType_to_string,
} from "@design-sdk/figma/features/variant";
import {
  InterfaceDeclaration,
  PropertySignature,
  Identifier,
  LiteralType,
  StringLiteral,
  UnionType,
  BooleanKeyword,
  NumberKeyword,
  stringfy,
} from "coli";

import { NameCases, nameit } from "@coli.codes/naming";

export interface InterfaceCodeBuilParam {
  name: string;
  properties: {
    name: string;
    type: variant.FigmaVariantPropertyCompatType;
  }[];
}

export function buildInterface(p: InterfaceCodeBuilParam) {
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
        name: new Identifier(
          nameit(n.name, {
            case: NameCases.camel,
          }).name
        ),
        type: _make_type(n.type),
      });
    }),
  });
}

export function buildInterfaceString(p: InterfaceCodeBuilParam): string {
  return interfaceColiToString(buildInterface(p));
}

export function interfaceColiToString(i: InterfaceDeclaration): string {
  return stringfy(i, {
    language: "typescript",
  });
}
