import { atom } from "recoil";

export interface EditorSizeProps {
  width: number;
  height: number;
}

export const hide_navigation = atom<boolean>({
  key: "hide_navigation",
  default: false,
});

export const editor_size = atom<EditorSizeProps>({
  key: "editor_size",
  default: {
    width: 0,
    height: 0,
  },
});
