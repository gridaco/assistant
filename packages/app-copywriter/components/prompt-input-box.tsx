import React, { useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styled from "@emotion/styled";
import { LightningBoltIcon } from "@radix-ui/react-icons";

export function PromptInputBox({
  placeholder = "Type your prompt here",
}: {
  placeholder?: string;
}) {
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const focus = useCallback(() => {
    ref.current?.focus();
  }, [ref.current]);

  return (
    <BoxWrapper onClick={focus} data-focused={focused}>
      <TextareaAutosize
        ref={ref}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus
      />
      <div className="toolbar">
        <div />
        <button className="send">
          <LightningBoltIcon />
          Generate
        </button>
      </div>
    </BoxWrapper>
  );
}

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 21px;
  outline: 1px solid transparent;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;

  &:hover {
    outline: 1px solid rgba(0, 0, 0, 0.1);
  }

  &[data-focused="true"] {
    background: rgba(0, 0, 0, 0.04);
    outline: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  }

  transition: all 0.15s ease-in-out;

  textarea {
    resize: none;
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
  }

  .toolbar {
    margin-top: 16px;

    display: flex;
    flex-direction: row;
    /* space-between */
    justify-content: space-between;
  }

  button {
    background: black;
    color: white;
    padding: 8px 12px;
    border-radius: 24px;
    border: none;
    outline: none;
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: center;

    &:focus {
      outline: 1px solid rgba(0, 0, 0, 0.2);
    }
  }

  .send {
    align-self: flex-end;
  }
`;
