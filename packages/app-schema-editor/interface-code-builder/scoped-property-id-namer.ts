import { ScopedVariableNamer } from "@coli.codes/naming";
import { ReservedKeywordPlatformPresets } from "coli";

const _default_key_val = "property-key";
export const reactNamer = (scope: string = _default_key_val) =>
  new ScopedVariableNamer(
    _make_scope_name(scope),
    ReservedKeywordPlatformPresets.react
  );

export const tsNamer = (scope: string = _default_key_val) =>
  new ScopedVariableNamer(
    _make_scope_name(scope),
    ReservedKeywordPlatformPresets.typescript
  );

const _make_scope_name = (scope: string) =>
  scope === _default_key_val ? _default_key_val : `property-key-of-${scope}`;
