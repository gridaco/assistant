import { atom } from "recoil";

export interface EditorSizeProps {
  width: number;
  height: number;
}

export const hide_navigation = atom<boolean>({
  key: "hide_navigation",
  default: false,
});
