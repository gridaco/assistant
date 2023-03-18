import React from "react";
import styled from "@emotion/styled";

export function BrowserTabsIndications() {
  function PinIcon() {
    return (
      <IconWrap>
        <svg
          width="10"
          height="14"
          viewBox="0 0 10 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 7C8.9 7 8 6.1 8 5V1H8.5C8.78 1 9 0.78 9 0.5C9 0.22 8.78 2.38419e-07 8.5 2.38419e-07H1.5C1.22 2.38419e-07 1 0.22 1 0.5C1 0.78 1.22 1 1.5 1H2V5C2 6.1 1.1 7 0 7V8H4.5V13.5L5 14L5.5 13.5V8H10V7ZM2.23 7C2.71 6.47 3 5.77 3 5V1H7V5C7 5.77 7.29 6.47 7.77 7H2.23Z"
            fill="black"
          />
        </svg>
      </IconWrap>
    );
  }

  return <></>;
}

const IconWrap = styled.svg`
  &:hover {
    fill: #737373;
  }
`;

const PlaceholderIcon = styled.div`
  border-radius: 3px;
  background: linear-gradient(
    180deg,
    rgba(196, 196, 196, 1),
    rgba(196, 196, 196, 0)
  );
`;
