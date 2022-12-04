import { EK_REPLACE_FONT } from "@core/constant";
import { replaceAllTextFontInFrame } from "../tool-box/manipulate";
import { addEventHandler, singleFigmaNodeSelection } from "../code-thread";

export function __register__() {
  addEventHandler(EK_REPLACE_FONT, async (msg) => {
    if (singleFigmaNodeSelection.type == "FRAME") {
      const font = "Roboto";
      await replaceAllTextFontInFrame(singleFigmaNodeSelection, font);
      figma.notify(`successfuly changed font to ${font}`);
    } else {
      figma.notify("cannot replace font of non-frame node");
    }
  });
}
