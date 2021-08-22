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
  onTap: function T() {
    // FIXME: here is setState
  },
  name: "hi",
  icon: "missingTextStyle",
  expand: false, // FIXME: here is state
  level: "warning",
  error: {
    id: "id",
    name: "Error name",
    userMessage: "This error is caused by “layer-name” and needs to be fixed.",
  },
};
