import React from "react";
export function ButtonMakerScreen() {
  function handleRandomizeClick(e: any) {
    parent.postMessage(
      {
        pluginMessage: {
          type: "reflect-ui-generation/button-base",
          data: undefined,
        },
      },
      "*"
    );
  }

  return (
    <div>
      <p>Reflect button maker</p>
      <button onClick={handleRandomizeClick}>randomize 500</button>
    </div>
  );
}
