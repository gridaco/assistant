import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import useMeasure from "react-use-measure";
import { Resizable, ResizeCallback } from "re-resizable";
import { PluginSdk } from "@plugin-sdk/app";

/**
 * minwidth of host window
 */
const MIN_WIDTH = 320;

type Size = { width: number; height: number };
function initialTransform(
  canvas: Size,
  frame: Size,
  margin: number
): InitialTransform {
  const __canvas_width = canvas.width;
  const __canvas_height = canvas.height;
  const __margin_2x = margin * 2;
  const __initial_scale =
    frame.width > __canvas_width
      ? (__canvas_width - __margin_2x) / frame.width
      : 1;

  const __initial_xy = [0, 0] as [number, number];

  return {
    scale: __initial_scale,
    xy: __initial_xy,
    transformOrigin: "top center",
  };
}

type InitialTransform = {
  scale: number;
  xy: [number, number];
  transformOrigin: string;
};

export function InteractiveCanvas({
  children,
  defaultSize,
}: {
  defaultSize: { width: number; height: number };
  children?: React.ReactNode;
}) {
  const _margin = 12;
  const [canvasSizingRef, canvasBounds] = useMeasure();
  const [initial, setInitial] = useState(
    initialTransform(canvasBounds, defaultSize, _margin)
  );
  const [hasUserOverride, setHasUserOverride] = useState(false);

  useEffect(() => {
    if (canvasBounds.width !== 0 && canvasBounds.height !== 0) {
      const i = initialTransform(canvasBounds, defaultSize, _margin);
      setInitial(i); // setup new initial
      if (!hasUserOverride) {
        setScale(i.scale);
        setXY(i.xy);
        setTransformOrigin(i.transformOrigin);
      }
    }
  }, [canvasBounds.width, canvasBounds.height]);

  const [scale, setScale] = useState(initial.scale);
  const [xy, setXY] = useState<[number, number]>(initial.xy);
  const [transformOrigin, setTransformOrigin] = useState(
    initial.transformOrigin
  );

  const interactionEventTargetRef = useRef();

  return (
    <InteractiveCanvasWrapper ref={canvasSizingRef} id="interactive-canvas">
      <div
        id="event-listener"
        ref={interactionEventTargetRef}
        style={{
          marginTop: _margin * 2,
          marginBottom: _margin * 4,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TransformContainer
          scale={scale}
          xy={xy}
          transformOrigin={transformOrigin}
          isTransitioning={false}
        >
          <ResizableFrame
            defaultSize={defaultSize}
            scale={scale}
            onResize={(e, d, ref, delta) => {
              const childrenWidthOnScreen = ref.clientWidth * scale;
              if (childrenWidthOnScreen + _margin * 2 > canvasBounds.width) {
                const currheight =
                  window.innerHeight ||
                  document.documentElement.clientHeight ||
                  document.body.clientHeight;
                const currwidth = canvasBounds.width;

                PluginSdk.resizeHost({
                  width: Math.max(MIN_WIDTH, currwidth + 50),
                  height: currheight,
                });
                //
              }
            }}
          >
            {children}
          </ResizableFrame>
        </TransformContainer>
        {/* </ScalingAreaStaticRoot> */}
      </div>
    </InteractiveCanvasWrapper>
  );
}

const InteractiveCanvasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
`;

const TransformContainer = ({
  scale,
  children,
  xy,
  isTransitioning,
  transformOrigin = "top center",
}: {
  transformOrigin?: string;
  scale: number;
  xy: [number, number];
  isTransitioning: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        pointerEvents: isTransitioning ? "none" : undefined,
        transform: `scale(${scale}) translateX(${xy[0]}px) translateY(${xy[1]}px)`,
        willChange: "transform",
        transformOrigin: transformOrigin,
      }}
    >
      {children}
    </div>
  );
};

function ResizableFrame({
  scale,
  children,
  defaultSize,
  onResize,
}: {
  defaultSize?: { width: number; height: number };
  scale: number;
  children?: React.ReactNode;
  onResize?: ResizeCallback;
}) {
  return (
    <Resizable
      onResize={onResize}
      defaultSize={
        defaultSize ?? {
          width: 500,
          height: 500,
        }
      }
      scale={scale}
    >
      {children}
    </Resizable>
  );
}
