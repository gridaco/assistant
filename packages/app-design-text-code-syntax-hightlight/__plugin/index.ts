import { SchemaAndLanguage } from "../models/schema-and-language";
import changeColorUsecase from "./change-color-usecase";
import { HighlightEvent, onService } from "./event";

onService(main_cb);

// main callback
function main_cb(evt: HighlightEvent) {
  if (evt.type == "CHANGE_COLOR") {
    const schemaAndLanguage: SchemaAndLanguage = evt.schemaAndLanguage;

    try {
      figma.currentPage.selection &&
        changeColorUsecase(figma.currentPage.selection, schemaAndLanguage);
    } catch (e) {
      console.error(e);
      figma.notify(`😭 ${e}`);
    }
  }
}
