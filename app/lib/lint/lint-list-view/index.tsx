// TODO:

import React from "react";
import { LintErrorIcon } from "../lint-error-icon";

/** @deprecated this is dummy. replace me */
export const dummy = "dummy";

export const rowDummy = {
  onTap: () => {},
  name: "hi",
  icon: () => <LintErrorIcon id="missingTextStyle" />,
  expand: false,
  level: "warning",
  error: {
    id: "s",
    name: "name",
    userMessage: "has error beacsue",
  },
};
