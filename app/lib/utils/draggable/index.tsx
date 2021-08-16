import React from "react";
import { DragAndDropOnCanvasRequest } from "@plugin-sdk/core";
import { PluginSdk } from "@plugin-sdk/app";

export function Draggable(props: {
  customData?: object;
  customDataLoader?: () => Promise<any>;
  eventKey: string;
  children: JSX.Element;
}) {
  // pre validate
  if (props.customData && props.customDataLoader) {
    console.warn(
      "both customData and customDataLoader are provided. customData will be ignored."
    );
  }

  // Initialize offset variables to be assigned later
  let offsetX = 0;
  let offsetY = 0;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Getting the offset position (The position of the cursor relative to the top-left corner of item being dragged)
    offsetX = e.nativeEvent.offsetX;
    offsetY = e.nativeEvent.offsetY;
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Don't proceed if the item was dropped inside the plugin window.
    if (e.nativeEvent.view.length === 0) return;

    // Getting the position of the cursor relative to the top-left corner of the browser page (Where the hamburger icon is)
    const dropPosition = {
      clientX: e.clientX,
      clientY: e.clientY,
    };

    // Getting the size of the app/browser window.
    const windowSize = {
      width: window.outerWidth,
      height: window.outerHeight,
    };

    // These are the offsets set from the dragstart event.
    const offset = {
      x: offsetX,
      y: offsetY,
    };

    const itemSize = {
      width: (e.target as any).clientWidth,
      height: (e.target as any).clientHeight,
    };

    // Sending the variables over to the main code.
    if (props.customDataLoader) {
      props.customDataLoader().then((r) => {
        emit(r);
      });
    } else {
      emit(props.customData);
    }

    function emit(customData: any) {
      const message: DragAndDropOnCanvasRequest = {
        dropPosition,
        windowSize,
        offset,
        itemSize,
        eventKey: props.eventKey,
        customData: customData,
      };

      PluginSdk.dropOnCanvas(message);
    }
  };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {props.children}
    </div>
  );
}
