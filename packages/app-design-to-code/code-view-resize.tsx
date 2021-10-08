import React, {
  MutableRefObject,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import styled from "@emotion/styled";

// FIXME: add preview resizeHeight set func
interface CodeViewResizeProps {
  codeWrapTop: number;
  codeWrapRef: MutableRefObject<HTMLDivElement>;
}

export function CodeViewResize(props: CodeViewResizeProps) {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [codeWrapY, setCodeWrapY] = useState<number>(0);

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  // FIXME: add preview resizeHeight set func
  function resize(movementY: number) {
    const codeWrapRefHeight = parseInt(
      getComputedStyle(props.codeWrapRef.current, "").height
    );

    // props.codeWrapRef.current.style.height = `${codeWrapRefHeight + -1}px`;
  }

  function handleEvent(e: MouseEvent<HTMLDivElement>) {
    setCodeWrapY(e.currentTarget.clientHeight);
    startResizing();
  }

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (isResizing) {
      // console.log(e.clientY);
      resize(e.movementY);
    } else {
      return;
    }
  }

  function handleRemoveEvent(e: MouseEvent<HTMLDivElement>) {
    // stop resizing
    e.preventDefault();
    stopResizing();
  }

  return (
    // <ControlWrap>
    <ControlBar
      onMouseDown={handleEvent}
      onMouseMove={handleMove}
      codeWrapTop={props.codeWrapTop}
      onMouseUp={handleRemoveEvent}
    />
    // </ControlWrap>
  );
}

const ControlBar = styled.div<{ codeWrapTop: number }>`
  cursor: row-resize;
  height: 5px;
  width: 100%;

  &:hover {
    ::after {
      content: "";
      background-color: #2663ff;
      position: absolute;
      left: 0;
      top: ${(props) => `${props.codeWrapTop}px`};
      width: 100%;
      height: 4px;
    }
  }
`;
