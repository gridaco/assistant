import React from "react";
import styled from "@emotion/styled";
import { useHistory } from "react-router";
import BackArrow from "@assistant/icons/back-arrow";

export function RouteBackButton({ onClick }: { onClick?: () => void }) {
  const history = useHistory();

  const close = () => {
    onClick ? onClick() : history.goBack();
  };

  return (
    <BackIcon onClick={close}>
      <BackArrow />
    </BackIcon>
  );
}

export const BackIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
