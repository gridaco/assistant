import React from "react";

export function NavigatorExpansionControlButton(props: {
  action: "expand" | "close";
  onClick: () => void;
}) {
  // TODO: add icon
  const icon = () => {
    switch (props.action) {
      case "expand":
        return <>^</>;
      case "close":
        return <>{"<"}</>;
    }
  };

  return <div onClick={props.onClick}>{icon}</div>;
}
