import { EK_APPLY_TEXT_CHARACTERS } from "@core/constant";
import { replaceTextCharacters } from "../reflect-render/text.render";
import { addEventHandler } from "../code-thread";

interface ApplyTextCharactersProps {
  type: "selection" | "id";
  id?: string;
  characters: string;
}

function applyCharacters(data: ApplyTextCharactersProps) {
  console.log("creating image with data", data);

  const { type, characters } = data;

  let _operations_count = 0;

  switch (type) {
    case "selection": {
      const selections = figma.currentPage.selection;

      console.log(
        "finding & updating texts from",
        selections.length,
        "selections"
      );

      if (selections.length > 0) {
        // find all text selection & operate

        selections.map((s) => {
          if (s.type == "TEXT") {
            replaceTextCharacters(s, { characters });
            _operations_count++;
          }
        });
      }
      if (_operations_count === 0) {
        figma.notify("No text layer selected");
      } else if (_operations_count === 1) {
        figma.notify("Text updated");
      } else {
        figma.notify(`${_operations_count} texts updated`);
      }
      break;
    }
    default: {
      console.log("not implemented", type);
    }
  }
}

export function __register__() {
  addEventHandler<ApplyTextCharactersProps>(EK_APPLY_TEXT_CHARACTERS, (msg) => {
    console.log("replace text characters", msg.data);
    applyCharacters(msg.data);
  });
}
