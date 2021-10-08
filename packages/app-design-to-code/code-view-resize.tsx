import React, {
  MutableRefObject,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import styled from "@emotion/styled";

// FIXME: add preview resizeHeight set func
interface CodeViewResizeProps {
  codeWrap: { top: number; setTop: (n: number) => void };
  codeWrapRef: MutableRefObject<HTMLDivElement>;
}

export function CodeViewResize(props: CodeViewResizeProps) {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeY, setResizeY] = useState<number>(0);

  const startResizing = () => {
    console.log("Start");
    setIsResizing(true);
  };

  const stopResizing = () => {
    console.error("Stop");
    setIsResizing(false);
  };

  useEffect(() => {
    // console.log(isResizing);
  });

  // FIXME: add preview resizeHeight set func
  function resize(e: MouseEvent<HTMLDivElement>) {
    // console.log("resizeY", resizeY);
    // console.log("clientY", e.clientY);
    const d_y = resizeY - e.clientY;
    setResizeY(e.clientY);
    // console.log("dy", d_y);

    // console.log("codeWrapRefHeight", codeWrapRefHeight);
    // console.log("d_y", d_y);
    // console.log("clientY", e.clientY);
    // console.log("resizeY", resizeY);
    const codeWrapTop = props.codeWrap.top;
    // console.log(codeWrapTop - d_y);
    props.codeWrap.setTop(codeWrapTop - d_y);
  }

  function handleEvent(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.clientY < props.codeWrap.top + 4) {
      setResizeY(e.clientY);
      startResizing();
    }
  }

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    if (isResizing) {
      resize(e);
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
    <ControlBar
      onMouseDown={handleEvent}
      onMouseMove={handleMove}
      codeWrapTop={props.codeWrap.top}
      onMouseUp={handleRemoveEvent}
      onMouseOut={handleRemoveEvent}
    />
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
