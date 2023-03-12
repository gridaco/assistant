import { NameCases } from "@coli.codes/naming";
import { FigmaNumber } from "@design-sdk/figma/dist/features/variant";
import { Identifier, PropertySignature } from "coli";
import { ISingleLayerPropertyMapping } from "../types/single-layer-property-type";
import { typeToColiType } from "./type-to-coli-type";

export function singleLayerPropertyMappingToPropertySignature({
  singlePropertyMapping,
  propertyNamer,
}: {
  singlePropertyMapping: ISingleLayerPropertyMapping;
  propertyNamer;
}) {
  return new PropertySignature({
    name: new Identifier(
      propertyNamer.nameit(singlePropertyMapping.schema.name, {
        case: NameCases.camel,
      }).name
    ),
    type: typeToColiType(FigmaNumber), // FIXME: use => n.schema.type
  });
}
