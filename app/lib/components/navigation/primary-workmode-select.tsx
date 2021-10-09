import React from "react";
import { PrimaryWorkmodeSet, WorkMode } from "../../routing";
import { WorkmodeButton } from "./work-mode-button";

export function PrimaryWorkmodeSelect(props: {
  set: PrimaryWorkmodeSet;
  selection: WorkMode;
  onSelect: (selection: WorkMode) => void;
}) {
  const _is_active = (mode: WorkMode) => {
    return mode == props.selection;
  };

  return (
    <>
      <WorkmodeButton
        name={props.set.first}
        active={_is_active(props.set.first)}
        onClick={() => {
          props.onSelect(props.set.first);
        }}
      />
      <WorkmodeButton
        name={props.set.second}
        active={_is_active(props.set.second)}
        onClick={() => {
          props.onSelect(props.set.second);
        }}
      />
    </>
  );
}
