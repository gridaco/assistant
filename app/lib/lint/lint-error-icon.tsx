import * as React from "react";

export enum LintError {
  text = "missingTextStyle",
  name = "nameError",
  mdi = "mdiTexture",
  color = "missingColorStyleError",
}

interface Props {
  id?: string;
}

export function LintErrorIcon(props: Props) {
  const MdiTextureIcon =
    require("../components/assets/mdi-texture.svg") as string;
  const ColorErrorIcon =
    require("../components/assets/missing-color-style-error.svg") as string;
  const TextErrorIcon =
    require("../components/assets/missing-text.svg") as string;
  const NameErrorIcon =
    require("../components/assets/name-error.svg") as string;

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
