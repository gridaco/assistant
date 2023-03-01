import React from "react";
import styled from "@emotion/styled";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

const LoadingIndicator = withStyles((theme) => ({
  root: {},
  primaryColor: {
    color: "#000000",
  },
}))(CircularProgress);

export function SearchInput({
  onClear,
  onChange,
  onEnter,
  loading = false,
  placeholder = "Serach anything...",
  disabled = false,
  readonly = false,
}: {
  onClear?: () => void;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<string>("");

  const canclear = onClear && value;

  const focus = React.useCallback(() => {
    ref.current?.focus();
  }, [ref.current]);

  return (
    <SearchBarWrapper onClick={focus}>
      {loading && <LoadingIndicator className="leading-icon" size={20} />}
      {!loading && <MagnifyingGlassIcon className="leading-icon" />}
      <Input
        ref={ref}
        readOnly={readonly}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onEnter?.();
          }
        }}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value === "") {
            onClear?.();
          }
          onChange?.(e.target.value);
        }}
      />
      {canclear && (
        <button
          className="clear"
          onClick={() => {
            setValue("");
            onClear?.();
          }}
        >
          <Cross2Icon />
        </button>
      )}
    </SearchBarWrapper>
  );
}

const SearchBarWrapper = styled.div`
  font-size: 14px;
  height: 55px;
  padding: 8px 16px;
  display: flex;
  align-items: center;

  .leading-icon {
    color: black;
    margin: 10px 10px 10px 0px;
    width: 20px;
    height: 20px;
  }

  .clear {
    padding: 0;
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    width: 16px;
    height: 16px;

    svg {
      color: white;
      width: 12px;
      height: 12px;
    }
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
  color: rgba(0, 0, 0, 0.8);

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;
