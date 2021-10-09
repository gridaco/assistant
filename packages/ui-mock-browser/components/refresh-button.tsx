import React from "react";
import styled from "@emotion/styled";

interface RefreshButtonProps {
  isHoverEvent?: boolean;
}

export function RefreshButton(props?: RefreshButtonProps) {
  function RefreshIcon() {
    return (
      <IconWrap>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7667 4.23341C10.8 3.26675 9.47334 2.66675 8.00001 2.66675C5.05334 2.66675 2.67334 5.05341 2.67334 8.00008C2.67334 10.9467 5.05334 13.3334 8.00001 13.3334C10.4867 13.3334 12.56 11.6334 13.1533 9.33341H11.7667C11.22 10.8867 9.74001 12.0001 8.00001 12.0001C5.79334 12.0001 4.00001 10.2067 4.00001 8.00008C4.00001 5.79341 5.79334 4.00008 8.00001 4.00008C9.10667 4.00008 10.0933 4.46008 10.8133 5.18675L8.66667 7.33341H13.3333V2.66675L11.7667 4.23341Z"
            fill="black"
          />
        </svg>
      </IconWrap>
    );
  }

  return (
    <>
      <RefreshIcon />
    </>
  );
}

const IconWrap = styled.span`
  opacity: 0;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;
