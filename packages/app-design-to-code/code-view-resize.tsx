import React, {
  MutableRefObject,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import styled from "@emotion/styled";

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

  function resize(movementY: number) {
    // props.codeWrapRef.current.style.height = codeWrapRefHeight + movementY;
    // props.codeWrapRef.current.style.height = `${
    //   codeWrapRefHeight + movementY
    // }px`;
    const codeWrapRefHeight = getComputedStyle(props.codeWrapRef.current, "")
      .height;
    // console.log("codeWrapY", codeWrapY);
    // console.log("movementY", movementY);
    // console.log("codeWrapRefHeight", codeWrapRefHeight);
  }

  function handleEvent(e: MouseEvent<HTMLDivElement>) {
    // const targetTop = e.clientY;
    // if (targetTop < props.codeWrapTop + 4) {
    //   startResizing();
    // } else {
    //   stopResizing();
    // }
    setCodeWrapY(e.clientY);
    // console.log("in mouse down");
    startResizing();
  }

  function handleResize(e: MouseEvent<HTMLDivElement>) {
    if (isResizing) {
      // props.codeWrapRef.current
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
      onMouseMove={handleResize}
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
