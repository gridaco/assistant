import React from "react";
import styled from "@emotion/styled";
import { SmartPreview } from "./components/smart-preview";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useSingleSelection } from "plugin-app";
import { parseFromName } from "@design-sdk/flags";

const map = {
  camera: {
    name: "Camera view",
    description:
      "Specifies the view to stream the primary camera stream. (Preview will not work in Assistant due to security reasons)",
  },
};

export function DesignLibraryScreen() {
  const selection = useSingleSelection();
  const usedFlags = selection ? parseFromName(selection.node.name) : {};
  const currentId = "camera";
  const current = map[currentId];
  const value = usedFlags[currentId];

  return (
    <>
      <div>
        <ArrowBackIcon
          style={{
            position: "relative",
            left: 24,
            top: 24,
            zIndex: 1,
          }}
        />
        <SmartPreview />
      </div>
      <Container
        name={current.name}
        description={current.description}
        mode={value !== undefined ? "edit" : "add"}
        disabled={selection == undefined}
        onAdd={() => {}}
        onRemove={() => {}}
        onChange={() => {}}
        fields={{
          this: {
            initial: undefined,
            placeholder: "Front / Back",
            type: "string",
          },
        }}
      />
    </>
  );
}

export function Container({
  name,
  description,
  fields = {},
  onAdd,
  onChange,
  onRemove,
  disabled,
  mode,
  errorMessage,
}: {
  name: string;
  description: string;
  mode: "add" | "edit";
  disabled?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  onChange?: (key: string, value: string) => void;
  fields?: {
    [key: string | "this"]: {
      placeholder: string;
      initial?: string;
      type: "string";
    };
  };
  errorMessage?: string;
}) {
  const _icon_style = {
    fontSize: 24,
  };

  return (
    <RootWrapperContainer>
      <Contents>
        <NameAndDescriptions>
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : <></>}
          <NameAndControl>
            <Name>{name}</Name>
            {mode === "add" ? (
              <IconButton disabled={disabled} onClick={onAdd}>
                <AddIcon style={_icon_style} />
              </IconButton>
            ) : (
              <IconButton disabled={disabled} onClick={onRemove}>
                <RemoveIcon style={_icon_style} />
              </IconButton>
            )}
          </NameAndControl>
          <Description>{description}</Description>
        </NameAndDescriptions>
        {Object.keys(fields).map((key) => {
          const field = fields[key];
          return (
            <TextFieldOneLine
              placeholder={field.placeholder}
              defaultValue={field.initial}
              onChange={(e) => {
                onChange?.(key, e.target.value);
              }}
            />
          );
        })}
      </Contents>
    </RootWrapperContainer>
  );
}

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 0.8);
  text-overflow: ellipsis;
  font-size: 12px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
`;

const IconButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;

  &:hover {
    background: rgba(221, 221, 221, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RootWrapperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  align-self: stretch;
  background-color: white;
  box-sizing: border-box;
  padding: 24px 16px;
  flex-shrink: 0;
`;

const Contents = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const NameAndDescriptions = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const NameAndControl = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const Name = styled.span`
  color: black;
  flex: 1;
  text-overflow: ellipsis;
  font-size: 21px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  text-align: left;
`;

const Description = styled.span`
  color: rgb(155, 155, 155);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  align-self: stretch;
  flex-shrink: 0;
`;

const TextFieldOneLine = styled.input`
  outline: none;
  border: 1px solid transparent;
  position: relative;
  align-self: stretch;
  flex-shrink: 0;
  background-color: rgb(251, 251, 251);
  border-radius: 4px;
  padding: 14px 18px;

  text-overflow: ellipsis;
  font-size: 13px;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  text-align: left;
  color: black;

  ::placeholder {
    color: rgb(163, 163, 163);
  }

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.5);
  }
`;

// const Text = styled.span`
//   color: rgb(19, 19, 19);
//   text-overflow: ellipsis;
//   font-size: 16px;
//   font-family: "Helvetica Neue", sans-serif;
//   font-weight: 500;
//   text-align: center;
// `;
