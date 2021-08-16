import React from "react";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styled from "@emotion/styled";

export function NavigatorExpansionControlButton(props: {
  action: "expand" | "close";
  onClick: () => void;
}) {
  const icon = () => {
    switch (props.action) {
      case "expand":
        return (
          <>
            <ExpandLessIcon />
          </>
        );
      case "close":
        return (
          <>
            <ExpandMoreIcon />
          </>
        );
    }
  };

  return <Button onClick={props.onClick}>{icon()}</Button>;
}

const Button = styled.div`
  cursor: pointer;
  align-items: center;
  display: flex;
  margin-left: auto;

  svg {
    fill: #cfcfcf;
  }
`;
