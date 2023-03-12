import { variant } from "@design-sdk/figma/dist/features";
import {
  FigmaBoolean,
  FigmaNumber,
  FigmaUnique,
  _FigmaVariantPropertyCompatType_to_string,
} from "@design-sdk/figma/dist/features/variant";
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

import { NameCases, nameit, ScopedVariableNamer } from "@coli.codes/naming";
import { ReservedKeywordPlatforms } from "coli";
import { typeToColiType } from "./type-to-coli-type";

export interface InterfaceCodeBuilParam {
  name: string;
  properties: {
    name: string;
    type: variant.FigmaVariantPropertyCompatType;
  }[];
}

export function buildInterface(p: InterfaceCodeBuilParam) {
  const propertyNamer = new ScopedVariableNamer("property", [
    ReservedKeywordPlatforms.typescript,
  ]);

  return new InterfaceDeclaration({
    name: p.name,
    members: p.properties.map((n) => {
      return new PropertySignature({
        name: new Identifier(
          propertyNamer.nameit(n.name, {
            case: NameCases.camel,
          }).name
        ),
        type: typeToColiType(n.type),
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
