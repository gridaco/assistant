import { randimizeText } from "../tool-box/manipulate";
import { addEventHandler } from "../code-thread";

export function __register__() {
  addEventHandler("randomize-selection", () => {
    randimizeText();
  });
}
