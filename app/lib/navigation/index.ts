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

const page_code_preview: PageConfig = {
  id: WorkScreen.code,
  title: "Preview",
};

const page_code_layout: PageConfig = {
  id: WorkScreen.layout,
  title: "Layout",
};

const page_code_component: PageConfig = {
  id: WorkScreen.component,
  title: "Component",
};

const page_code_lint: PageConfig = {
  id: WorkScreen.lint,
  title: "Lint",
};

const page_design_icon: PageConfig = {
  id: WorkScreen.icon,
  title: "Icon",
};

const page_design_layout: PageConfig = {
  id: WorkScreen.layout,
  title: "Layout",
};

const page_design_lint: PageConfig = {
  id: WorkScreen.lint,
  title: "Lint",
};

const page_content_g11n: PageConfig = {
  id: WorkScreen.g11n,
  title: "Globalize",
};

const page_about: PageConfig = {
  id: WorkScreen.about,
  title: "About",
};

const page_toolbox_font_replacer: PageConfig = {
  id: WorkScreen.tool_font_replacer,
  title: "About",
};

const page_toolbox_desing_button_maker: PageConfig = {
  id: WorkScreen.tool_desing_button_maker,
  title: "Button Maker",
};

const page_toolbox_meta_editor: PageConfig = {
  id: WorkScreen.tool_meta_editor,
  title: "Meta",
};

const page_toolbox_batch_meta_editor: PageConfig = {
  id: WorkScreen.tool_batch_meta_editor,
  title: "Batch Meta",
};

const page_toolbox_data_mapper: PageConfig = {
  id: WorkScreen.tool_data_mapper,
  title: "Data mapper",
};

const all_pages: PageConfig[] = [
  page_toolbox_data_mapper,
  page_toolbox_batch_meta_editor,
  page_toolbox_meta_editor,
  page_toolbox_desing_button_maker,
  page_toolbox_font_replacer,
  page_about,
  page_content_g11n,
  page_design_lint,
  page_design_layout,
  page_design_icon,
  page_code_layout,
  page_code_preview,
  page_code_component,
  page_code_lint,
];

export function get_page_config(id: WorkScreen): PageConfig {
  const _ = all_pages.find((p) => p.id === id);
  if (_) {
    return _;
  }
  throw `${id} is not found from registered page configs`;
}
///
/// endregion page declarations
///
