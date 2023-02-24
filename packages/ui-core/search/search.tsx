import React from "react";
import { Search } from "@material-ui/icons";
import styled from "@emotion/styled";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";

const LoadingIndicator = withStyles((theme) => ({
  root: {},
  primaryColor: {
    color: "#000000",
  },
}))(CircularProgress);

export function SearchInput({
  onChange,
  onEnter,
  loading = false,
  placeholder = "Serach anything...",
  disabled = false,
  readonly = false,
}: {
  onChange?: (value: string) => void;
  onEnter?: () => void;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
}) {
  return (
    <SearchBarWrapper>
      {loading && <LoadingIndicator />}
      {!loading && <Search style={{ fontSize: "20px" }} />}
      <Input
        readOnly={readonly}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnter?.();
          }
        }}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </SearchBarWrapper>
  );
}

const SearchBarWrapper = styled.div`
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
  flex: 1;
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
