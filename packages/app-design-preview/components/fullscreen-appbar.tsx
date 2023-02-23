import React from "react";
import styled from "@emotion/styled";
import ArrowBackIosRounded from "@material-ui/icons/ArrowBackIosRounded";

export function FullsreenAppbar({
  onBack,
  actions,
}: {
  onBack?: () => void;
  actions: React.ReactNode;
}) {
  return (
    <Warpper>
      <button
        style={{
          background: "none",
          border: "none",
          width: 24,
          height: 24,
        }}
        onClick={onBack}
      >
        <ArrowBackIosRounded
          style={{
            color: "#737373",
            fontSize: 16,
          }}
        />
      </button>
      <Actions>{actions}</Actions>
    </Warpper>
  );
}

const Warpper = styled.div`
  background: none;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  flex: none;
  box-sizing: border-box;
  padding: 12px 16px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  flex: none;
  gap: 8px;
  box-sizing: border-box;
`;
