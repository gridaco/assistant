import { atom } from "recoil";

export const hide_navigation = atom<boolean>({
  key: "hide_navigation",
  default: false,
});
