import { variant } from "@design-sdk/figma/dist/features";
import {
  FigmaBoolean,
  FigmaNumber,
} from "@design-sdk/figma/dist/features/variant";
import {
  BooleanKeyword,
  LiteralType,
  NumberKeyword,
  StringLiteral,
  UnionType,
} from "coli";

export function typeToColiType(t: variant.FigmaVariantPropertyCompatType) {
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
}
