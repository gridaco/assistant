import * as React from "react";

export enum LintError {
  text = "missing-text-style",
  name = "name-error",
  mdi = "mdi_texture",
  color = "missing-color-style-error",
}

interface Props {
  id?: LintError;
}

export function LintErrorIcon(props: Props) {
  const MdiTextureIcon =
    require("../../../lib/components/assets/mdi-texture.svg") as string;
  const ColorErrorIcon =
    require("../../../lib/components/assets/missing-color-style-error.svg") as string;
  const TextErrorIcon =
    require("../../../lib/components/assets/missing-text.svg") as string;
  const NameErrorIcon =
    require("../../../lib/components/assets/name-error.svg") as string;

  switch (props.id) {
    case LintError.text:
      return <TextErrorIcon />;
    case LintError.name:
      return <NameErrorIcon />;
    case LintError.mdi:
      return <MdiTextureIcon />;
    case LintError.color:
      return <ColorErrorIcon />;
    default:
      return <></>;
  }
}
