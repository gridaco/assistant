import { PluginSdk } from "@plugin-sdk/app";
import { PrimaryWorkmodeSet } from "../primary-workmode-selector";
import { WorkMode } from "../work-mode";
import { WorkScreen } from "../work-screen";

export interface NavigationStoreState {
  workmodeSet: PrimaryWorkmodeSet;
  currentWorkmode: WorkMode;
  currentWork: WorkScreen;
}

const _default_state: NavigationStoreState = {
  workmodeSet: {
    first: WorkMode.code,
    second: WorkMode.design,
  },
  currentWorkmode: WorkMode.code,
  currentWork: WorkScreen.code,
};

const __KEY = "app-navigation-full-layout";
export async function saveLayout(state: NavigationStoreState) {
  PluginSdk.setItem<NavigationStoreState>(__KEY, state);
}

export async function loadLayout(): Promise<NavigationStoreState> {
  const saved = await PluginSdk.getItem<NavigationStoreState>(__KEY);
  if (saved) {
    return saved;
  }
  return _default_state;
}
