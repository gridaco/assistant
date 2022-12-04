import React from "react";
import { Button } from "@material-ui/core";
import { EK_REPLACE_FONT } from "@core/constant/ek.constant";

export function FontReplacerScreen() {
  function onReplaceFontClick() {
    parent.postMessage(
      {
        pluginMessage: {
          type: EK_REPLACE_FONT,
          data: {
            // todo add more options for user to chose font maps to be replaced
          },
        },
      },
      "*"
    );
  }

  return (
    <div>
      <em>WARNING! this is a hightly distructive operation.</em>
      <p>
        converts all text in selected frame as Roboto Regular. this can be used
        when no font on original design is installed on your device.
      </p>
      <Button variant="outlined" onClick={onReplaceFontClick} color="secondary">
        replace fonts to roboto regular
      </Button>
    </div>
  );
}
