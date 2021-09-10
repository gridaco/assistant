import { ScopedVariableNamer } from "@coli.codes/naming";
import { ReservedKeywordPlatformPresets } from "@coli.codes/naming/reserved";

export const reactNamer = new ScopedVariableNamer(
  "properties",
  ReservedKeywordPlatformPresets.react
);
