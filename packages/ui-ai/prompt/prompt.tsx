import React, { useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styled from "@emotion/styled";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import TiptapInput from "./tiptap";

const LoadingIndicator = withStyles((theme) => ({
  root: {},
  primaryColor: {
    color: "#ffffff",
  },
}))(CircularProgress);

export function PromptInputBox({
  onChange,
  onSubmit,
  value = "",
  readonly = false,
  placeholder = "Type your prompt here",
  canSubmit = true,
  autofocus = true,
  prompting = false,
  submit: submitConfig,
  style = {},
  onPreviousPrompt,
  onNextPrompt,
}: {
  readonly?: boolean;
  onSubmit?: () => void;
  onChange?: (value: string) => void;
  value?: string;
  canSubmit?: boolean;
  prompting?: boolean;
  placeholder?: string;
  autofocus?: boolean;
  submit?: {
    icon?: React.ReactNode;
  };
  style?: React.CSSProperties;
  onPreviousPrompt?: () => void;
  onNextPrompt?: () => void;
}) {
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const focus = useCallback(() => {
    ref.current?.focus();
  }, [ref.current]);

  const submit = useCallback(() => {
    onSubmit?.();
    focus();
  }, [onSubmit, focus]);

  return (
    <BoxWrapper
      //
      onClick={focus}
      data-readonly={readonly}
      data-prompting={prompting}
      data-focused={focused}
      style={style}
      onKeyDown={(e) => {
        // if shift + enter, new line
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          submit();
        }

        if (value.trim().length === 0) {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onPreviousPrompt?.();
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onNextPrompt?.();
          }
        }
      }}
    >
      {/* <TiptapInput
        placeholder={placeholder}
        autofocus={autofocus}
        onSubmit={submit}
        onChange={onChange}
        value={value}
      /> */}
      <TextareaAutosize
        ref={ref}
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        readOnly={readonly}
        autoFocus={autofocus}
      />
      <div className="toolbar">
        <div />
        <button
          onClick={(e) => {
            e.preventDefault();
            submit();
          }}
          disabled={!canSubmit || readonly}
          className="send"
        >
          {prompting ? (
            <LoadingIndicator className="icon" size={15} />
          ) : (
            <>
              {submitConfig?.icon ? (
                <div className="icon">{submitConfig.icon}</div>
              ) : (
                <LightningBoltIcon className="icon" />
              )}
            </>
          )}
        </button>
      </div>
    </BoxWrapper>
  );
}

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 12px;
  padding-bottom: 12px;
  outline: 1px solid transparent;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;

  &:hover {
    outline: 1px solid rgba(0, 0, 0, 0.1);
  }

  &[data-focused="true"] {
    background: white;
    outline: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  }

  &[data-readonly="true"] {
    .toolbar {
      opacity: 0.5;
      pointer-events: none;
    }
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

    &:disabled {
      cursor: not-allowed;
      background: rgba(0, 0, 0, 0.8);
    }

    .icon {
      color: white;
    }
  }

  .send {
    align-self: flex-end;
  }
`;
