// TODO:

import React from "react";
import { OptionChoiceItem } from "../../pages/lint/lint-option-choice-item";
import { LintErrorIcon } from "../lint-error-icon";

/** @deprecated this is dummy. replace me */
export const dummy = "dummy";

export const choiceItem = {
  selected: false,
  choice: {
    title: "choice 1",
    explanation: "I’ll choose this option to resolve this issue.",
  },
};

export const rowDummy = {
  onTap: function T(children: any[]) {
    children.map((item, i) => {
      return <OptionChoiceItem key={i} {...item} />;
    });
  },
  name: "hi",
  icon: "missingTextStyle",
  expand: false,
  level: "warning",
  error: {
    id: "id",
    name: "Error name",
    userMessage: "This error is caused by “layer-name” and needs to be fixed.",
  },
};
