import { atom } from "recoil";
import { WorkScreen } from "../main/screens";

export type ReleaseChannel = "release" | "beta" | "alpha";
export interface ReleaseVisibilityPreference {
  screen: WorkScreen;
  allowedChannel: ReleaseChannel;
}

const appWorkspaceModeAtom = atom({
  key: "app-workspace-mode",
  default: undefined!,
});

const appWorkScreeAtom = atom({
  key: "app-work-screen",
  default: undefined!,
});
