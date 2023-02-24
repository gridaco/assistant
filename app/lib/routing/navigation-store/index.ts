import { PluginSdk } from "@plugin-sdk/app";
import { PrimaryWorkmodeSet } from "../primary-workmode-selector";
import { WorkMode } from "../work-mode";
import { WorkScreen } from "../work-screen";
import { saved_work_by_workmode } from "./save-workmode-work";

export interface NavigationStoreState {
  workmodeSet: PrimaryWorkmodeSet;
  currentWorkmode: WorkMode;
  currentWork: WorkScreen;
}

const _default_state: NavigationStoreState = {
  workmodeSet: {
    first: WorkMode.design,
    second: WorkMode.code,
  },
  currentWorkmode: WorkMode.design,
  currentWork: WorkScreen.preview,
};

const __KEY = "app-navigation-full-layout";

let __layout_cache: NavigationStoreState;
export async function saveLayout(state: NavigationStoreState) {
  __layout_cache = state;
  PluginSdk.setItem<NavigationStoreState>(__KEY, state);
}

export async function loadLayout(): Promise<NavigationStoreState> {
  if (__layout_cache) {
    return __layout_cache;
  }

  __layout_cache = await PluginSdk.getItem<NavigationStoreState>(__KEY);
  if (__layout_cache == null) {
    saveLayout(_default_state);
  }

  return __layout_cache;
}

/** updates and saves the layout only with diff data. */
export async function updateLayout({
  work,
  workmode,
}: {
  work: WorkScreen;
  workmode: WorkMode;
}) {
  const curr_layout = await loadLayout();
  //
  await saveLayout({
    ...curr_layout,
    currentWorkmode: workmode,
    currentWork: work,
  });
}
