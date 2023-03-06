import type React from "react";
import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import type { SuggestionOptions } from "@tiptap/suggestion/dist/packages/suggestion/src/suggestion";

export interface CommandSuggestionItem {
  title: string;
  group?: string;
  icon?: React.ReactElement;
  description?: string;
  command?: SuggestionOptions<CommandSuggestionItem>["command"];
}

export const CommandExtension = Extension.create<{
  suggestion: Omit<SuggestionOptions<CommandSuggestionItem>, "editor">;
}>({
  name: "commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command?.({ editor, range, props });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
