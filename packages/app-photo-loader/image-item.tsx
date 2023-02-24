import React, { useEffect, useRef, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import styled from "@emotion/styled";

export function LoadableGraphicItem({
  onResourceReady,
  name,
  src,
}: {
  onResourceReady?: () => void;
  name: string;
  src: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  // TODO: handle on ready (onResourceReady)

  const onclick = () => {
    onResourceReady?.();
    setIsDownloading(true);

    // mock progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          clearInterval(interval);
          setIsDownloading(false);
          return 0;
        }
        return p + 0.1;
      });
    }, 100);
  };

  return (
    <ItemWrapper onClick={onclick}>
      <img
        style={{ width: "100%", height: "100%", display: "block" }}
        src={src}
        alt={name}
      />
      <div
        className={"loading-overlay"}
        data-state={isDownloading ? "loading" : "idle"}
        style={{ "--progress": progress } as OverlayStyle}
      />
    </ItemWrapper>
  );
}

interface OverlayStyle extends React.CSSProperties {
  "--progress"?: number;
}

const ItemWrapper = styled.div`
  position: relative;
  /*  */

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 1;

    &[data-state="idle"] {
      opacity: 0;
    }

    &[data-state="loading"] {
      opacity: 1;
    }

    &[data-state="idle"]::before {
      transform-origin: right;
    }

    &[data-state="loading"]::before {
      transform-origin: left;
    }

    transition: opacity 0.5s ease-in-out;
  }

  .loading-overlay:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    transform: scaleX(var(--progress));
    transition: transform 0.3s linear;
  }
`;
