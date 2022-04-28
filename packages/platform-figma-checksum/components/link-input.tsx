import React from "react";
import styled from "@emotion/styled";
import {
  analyze,
  parseFileAndNodeId,
  FigmaInputAnalysisResult,
  FigmaFileOrNodeIdType,
  FigmaUrlType,
} from "@design-sdk/figma-url";

export function LinkInput({
  onValidLink,
}: {
  onValidLink: (
    file?: string,
    node?: string,
    url?: string,
    type?: FigmaInputAnalysisResult
  ) => void;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const [valid, setValid] = React.useState(false);
  const whenInvalid = (msg: string) => {
    setError(msg);
  };

  const selectAll = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleFocus = (event) => {
    selectAll(event);
  };

  const validate = (e) => {
    const url = e.target.value;
    try {
      new URL(url); // for url format validation

      const _ = analyze(url);
      switch (_) {
        case FigmaUrlType.empty:
          whenInvalid("Please enter a valid Figma URL");
          return;
        case FigmaUrlType.node:
        case FigmaUrlType.file:
        case FigmaUrlType.embed:
        case FigmaFileOrNodeIdType.fileid:
        case FigmaFileOrNodeIdType.maybe_fileid:
        case FigmaFileOrNodeIdType.maybe_nodeid:
        case FigmaFileOrNodeIdType.nodeid:
          try {
            const parsed = parseFileAndNodeId(url);
            setError(null);
            setValid(true);
            onValidLink(parsed.file, parsed.node, url, _);
          } catch (_) {
            whenInvalid("Please enter a valid Figma URL");
          }
          return;
        default:
          whenInvalid("Please enter a valid Figma URL");
          console.error("Unhandled case", _);
          break;
      }
    } catch (_) {
      whenInvalid("Please enter a valid Figma URL");
    }
  };

  const onPaste = (e) => {
    validate(e);
    selectAll(e);
  };

  return (
    <>
      <Input
        autoFocus
        disabled={valid}
        onFocus={handleFocus}
        onPaste={onPaste}
        onChange={validate}
        placeholder="https://www.figma.com/file/a98bc76d/assistant?node-id=1234%3A5678"
      />
      {error && <Error>{error}</Error>}
    </>
  );
}

const Input = styled.input`
  height: 52px;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 16px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 4px;
  position: relative;
  box-shadow: 0px 4px 16px rgba(176, 176, 176, 0.12);
  align-self: stretch;
  font-weight: 400;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  text-align: left;
  &::placeholder {
    color: rgba(232, 232, 232, 1);
  }

  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    color: #808080;
  }
`;

const Error = styled.span`
  color: rgba(220, 105, 105, 1);
  text-overflow: ellipsis;
  font-size: 12px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
`;
