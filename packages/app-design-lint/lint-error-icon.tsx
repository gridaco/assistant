import * as React from "react";
import ColorErrorIcon from "@assistant/lint-icons/error-missing-color-style";
import TextStyleErrorIcon from "@assistant/lint-icons/error-missing-text-style";
import NamingErrorIcon from "@assistant/lint-icons/error-missing-text-style";

export enum LintError {
  text = "missingTextStyle",
  name = "nameError",
  color = "missingColorStyleError",
}

interface Props {
  id?: string;
}

export function LintErrorIcon(props: Props) {
  switch (props.id) {
    case LintError.text:
      return <TextStyleErrorIcon />;
    case LintError.name:
      return <NamingErrorIcon />;
    case LintError.color:
      return <ColorErrorIcon />;
    default:
      return <></>;
  }
}
