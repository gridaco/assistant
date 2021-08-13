export * from "./layout-preference";
export * from "./work-mode";
export * from "./work-screen";
export * from "./primary-workmode-selector";

import { WorkScreen } from "./work-screen";

export interface WorkmodeConfig {
  tabs: PageConfig[];
}

export interface PageConfig {
  id: WorkScreen;
  title: string;
}

///
/// region page declarations
///

const page_about: PageConfig = {
  id: WorkScreen.about,
  title: "About",
};

const page_code_preview: PageConfig = {
  id: WorkScreen.code,
  title: "About",
};

// const page_about: PageConfig = {
//   id: WorkScreen.about,
//   title: "About",
// };

///
/// endregion page declarations
///
