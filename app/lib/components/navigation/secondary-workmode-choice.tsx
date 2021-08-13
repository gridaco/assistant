import React from "react";

export function SecondaryWorkmodeChoice(props: {
  name: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  // TODO: add hover style support
  return (
    <h6
      style={{
        color: props.disabled ? "gray" : "black",
      }}
    >
      {props.name}
    </h6>
  );
  //
}
