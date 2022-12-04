import React from "react";
import styled from "@emotion/styled";

export function FullscreenAppbarActionButton({
  onClick,
  children,
  disabled,
  title,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <Button title={title} onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

const Button = styled.button`
  background-color: rgb(236, 236, 236);
  border-radius: 4px;
  padding: 8px 10px;
  color: rgb(115, 115, 115);
  font-size: 12px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  border: none;
  outline: none;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :active {
    opacity: 1;
  }

  :focus {
  }
`;
