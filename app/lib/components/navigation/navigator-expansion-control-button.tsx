import React from "react";
import ArrowDown from "@material-ui/icons/ArrowDownward";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
export function NavigatorExpansionControlButton(props: {
  action: "expand" | "close";
  onClick: () => void;
}) {
  const icon = () => {
    switch (props.action) {
      case "expand":
        return (
          <>
            <ArrowUpward />
          </>
        );
      case "close":
        return (
          <>
            <ArrowDown />
          </>
        );
    }
  };

  return <div onClick={props.onClick}>{icon}</div>;
}
