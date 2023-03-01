import React, { useCallback, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styled from "@emotion/styled";
import { LightningBoltIcon, ImageIcon } from "@radix-ui/react-icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import { generative_styles } from "./k";
import Select from "react-select";

const LoadingIndicator = withStyles((theme) => ({
  root: {},
  primaryColor: {
    color: "#ffffff",
  },
}))(CircularProgress);

export function ImagePromptBox({
  onChange,
  onSubmit,
  value = "",
  readonly = false,
  disabled = false,
  placeholder = "Type your prompt here",
  canSubmit = true,
  autofocus = false,
  prompting = false,
}: {
  readonly?: boolean;
  disabled?: boolean;
  onSubmit?: (
    value: string,
    c: {
      style?: string;
    }
  ) => void;
  onChange?: (value: string) => void;
  value?: string;
  canSubmit?: boolean;
  prompting?: boolean;
  placeholder?: string;
  autofocus?: boolean;
}) {
  const options = useMemo(() => {
    return Object.keys(generative_styles).map((key) => {
      const lablel = generative_styles[key] ?? "No specific style";
      return { value: key, label: lablel };
    });
  }, []);

  const [style, setStyle] = React.useState<string | undefined>(undefined);
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const focus = useCallback(() => {
    ref.current?.focus();
  }, [ref.current]);

  const submit = useCallback(() => {
    onSubmit?.(value, { style });
    focus();
  }, [onSubmit, focus, style]);

  return (
    <BoxWrapper
      //
      onClick={focus}
      data-disabled={disabled}
      data-prompting={prompting}
      data-focused={focused}
    >
      <div className="content">
        {readonly ? (
          <div
            style={{
              flex: 1,
            }}
            className="gradient-text"
          >
            {value}
          </div>
        ) : (
          <TextareaAutosize
            ref={ref}
            disabled={readonly || disabled}
            onChange={(e) => onChange?.(e.target.value)}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            readOnly={readonly}
            autoFocus={autofocus}
          />
        )}
        <div className="badges">
          <Badge color="#000AFF" background="rgba(0, 10, 255, 0.2)">
            AI
          </Badge>
          <Badge>PRO</Badge>
        </div>
      </div>
      <div style={{ height: 21 }} />
      <div className="toolbar">
        <div className="tool">
          <ImageIcon className="icon" />
          <Select
            placeholder="Select style..."
            styles={{
              // no border
              control: (provided) => ({
                ...provided,
                cursor: "pointer",
                border: "none",
                padding: 0,
                margin: 0,
                boxShadow: "none",
                width: 140,
                minHeight: 24,
                fontSize: 14,
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: 0,
                margin: 0,
              }),
              menu: (provided) => ({
                ...provided,
                fontSize: 14,
              }),
            }}
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: () => null,
            }}
            onChange={(e) => {
              setStyle(e.value);
            }}
            options={options}
          />
        </div>

        <div />
        <button
          onClick={(e) => {
            e.preventDefault();
            submit();
          }}
          disabled={!canSubmit || disabled}
          className="send"
        >
          {prompting ? (
            <LoadingIndicator className="icon" size={15} />
          ) : (
            <LightningBoltIcon className="icon" />
          )}
        </button>
      </div>
    </BoxWrapper>
  );
}

function Badge({
  children,
  color = "white",
  background = "black",
}: React.PropsWithChildren<{
  color?: React.CSSProperties["color"];
  background?: React.CSSProperties["background"];
}>) {
  return (
    <div
      style={{
        padding: "2px 4px",
        borderRadius: 4,
        color,
        background,
        fontSize: 10,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

const BoxWrapper = styled.div`
  --g-1: #001aff;
  --g-2: #fa00ff;

  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 12px;
  padding-bottom: 12px;
  outline: 1px solid transparent;
  background: white;
  box-shadow: 0px 4px 8px 0px rgba(255, 0, 229, 0.04);

  .gradient-text {
    background-image: linear-gradient(135deg, var(--g-1), var(--g-2));
    background-clip: text;
    color: transparent;
  }

  /* border styles */
  ::before {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 1px;
    background: linear-gradient(135deg, var(--g-1), var(--g-2));
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  &[data-prompting="true"] {
    &::before {
      animation: gradient 15s ease infinite;
    }
  }

  border-radius: 8px;

  &:hover {
    outline: 1px solid rgba(0, 0, 0, 0.1);
  }

  &[data-focused="true"] {
    background: white;
    outline: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  }

  &[data-disabled="true"] {
    .toolbar {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  transition: all 0.15s ease-in-out;

  .content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: row;

    textarea {
      width: 100%;
      resize: none;
      border: none;
      outline: none;
      background: none;
      font-size: 14px;
    }
  }

  .toolbar {
    margin-top: 16px;

    display: flex;
    flex-direction: row;
    /* space-between */
    justify-content: space-between;
    align-items: center;

    .tool {
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
    }
  }

  .badges {
    margin-left: 12px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: flex-start;
  }

  button {
    cursor: pointer;
    background: black;
    color: white;
    padding: 6px;
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
