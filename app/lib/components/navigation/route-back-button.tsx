import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router";
import BackArrow from "@assistant/icons/back-arrow";

export function RouteBackButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  navigate("");

  const close = () => {
    onClick ? onClick() : navigate(-1);
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
