import { drawButtons } from "../reflect-render";
import { addEventHandler } from "../code-thread";

async function draw100000Buttons() {
  for (let i = 0; i < 1; i++) {
    await drawButtons(i);
  }
}

export function __register__() {
  addEventHandler("reflect-ui-generation/button-base", () => {
    draw100000Buttons();
  });
}
