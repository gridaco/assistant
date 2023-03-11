import { NameCases, ScopedVariableNamer } from "@coli.codes/naming";

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
import { singleLayerPropertyMappingToPropertySignature } from "../interface-code-builder/single-layer-property-mapping-to-property-signature";
import { typeToColiType } from "../interface-code-builder/type-to-coli-type";
import { IProperties } from "../types";
import { ISingleLayerPropertyMapping } from "../types/single-layer-property-type";

export default function ({
  mainInterfaceName,
  properties,
  propertyNamer,
}: {
  mainInterfaceName: string;
  properties: IProperties;
  propertyNamer: ScopedVariableNamer;
}) {
  const property_signatures = properties.map((d) => {
    return singleLayerPropertyMappingToPropertySignature({
      singlePropertyMapping: d,
      propertyNamer,
    });
  });

  return new InterfaceDeclaration({
    name: mainInterfaceName,
    members: [...property_signatures],
  });
}
