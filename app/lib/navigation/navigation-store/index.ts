import { PrimaryWorkmodeSet } from "../primary-workmode-selector";
import { WorkMode } from "../work-mode";
import { WorkScreen } from "../work-screen";

export interface NavigationStoreState {
  workmodeSet: PrimaryWorkmodeSet;
  currentWorkmode: WorkMode;
  currentWork: WorkScreen;
}

const __KEY = "app-navigation-full-layout";
export async function saveLayout(state: NavigationStoreState) {
  const payload = JSON.stringify(state);

  // save payload
  //
}

export async function loadLayout(): Promise<NavigationStoreState> {
  const payload = await localStorage.getItem(__KEY);
  return JSON.parse(payload);
}
