import React from "react";
import { Search } from "@material-ui/icons";
import styled from "@emotion/styled";

export function SearchInput({
  onChange,
  placeholder = "Serach anything...",
}: {
  onChange?: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <SearchBarWrapper>
      <Search style={{ fontSize: "20px" }} />
      <Input
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </SearchBarWrapper>
  );
}

const SearchBarWrapper = styled.div`
  width: 100%;
  font-size: 14px;
  height: 55px;
  padding: 8px;
  display: flex;
  align-items: center;

  svg {
    margin: 10px 10px 10px 8px;
    font-size: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 90%;
  border: none;
  outline: none;

  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: #adaeb2;

  &::placeholder {
    color: #adaeb2;
  }
`;
