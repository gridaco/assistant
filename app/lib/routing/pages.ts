import { WorkScreen } from "./work-screen";

export interface PageConfig {
  id: WorkScreen;
  title: string;
  path: string;
}

///
/// region page declarations
///

const page_code_preview: PageConfig = {
  id: WorkScreen.code,
  title: "Preview",
  path: "/code/preview",
};

const page_code_layout: PageConfig = {
  id: WorkScreen.layout,
  title: "Layout",
  path: "/code/layout",
};

const page_code_component: PageConfig = {
  id: WorkScreen.component,
  title: "Component",
  path: "/code/component",
};

const page_code_lint: PageConfig = {
  id: WorkScreen.lint,
  title: "Lint",
  path: "/code/lint",
};

const page_live_session: PageConfig = {
  id: WorkScreen.live,
  title: "Live",
  path: "/code/live",
};

const page_design_icon: PageConfig = {
  id: WorkScreen.icon,
  title: "Icon",
  path: "/design/icons",
};

const page_design_photo: PageConfig = {
  id: WorkScreen.photo,
  title: "Photo",
  path: "/design/photos-loader",
};

const page_design_copywriter: PageConfig = {
  id: WorkScreen.copy,
  title: "Copy",
  path: "/design/copywriter",
};

const page_design_layout: PageConfig = {
  id: WorkScreen.layout,
  title: "Layout",
  path: "/design/layout",
};

const page_design_preview: PageConfig = {
  id: WorkScreen.preview,
  title: "Preview",
  path: "/design/preview",
};

const page_design_lint: PageConfig = {
  id: WorkScreen.lint,
  title: "Lint",
  path: "/design/lint",
};

const page_content_g11n: PageConfig = {
  id: WorkScreen.g11n,
  title: "Globalize",
  path: "/content/globalize",
};

const page_about: PageConfig = {
  id: WorkScreen.about,
  title: "About",
  path: "/about",
};

const page_toolbox_home: PageConfig = {
  id: WorkScreen.tool_home,
  title: "Tools",
  path: "/toolbox/home",
};

const page_toolbox_font_replacer: PageConfig = {
  id: WorkScreen.tool_font_replacer,
  title: "Font replacer",
  path: "/toolbox/font-replacer",
};

const page_toolbox_desing_button_maker: PageConfig = {
  id: WorkScreen.tool_desing_button_maker,
  title: "Button Maker",
  path: "/toolbox/button-maker",
};

const page_toolbox_meta_editor: PageConfig = {
  id: WorkScreen.tool_meta_editor,
  title: "Meta",
  path: "/toolbox/meta-editor",
};

const page_toolbox_batch_meta_editor: PageConfig = {
  id: WorkScreen.tool_batch_meta_editor,
  title: "Batch Meta",
  path: "/toolbox/batch-meta-editor",
};

const page_toolbox_data_mapper: PageConfig = {
  id: WorkScreen.tool_data_mapper,
  title: "Data mapper",
  path: "/toolbox/data-mapper",
};

const page_toolbox_code_syntax_highlight: PageConfig = {
  id: WorkScreen.tool_code_syntax_highlighter,
  title: "Code syntax highlighter",
  /** this is temporarily under design workmode. - change under toolbox after workmode preference switch is ready. */
  path: "/toolbox/code-syntax-highlight",
};

const page_signup: PageConfig = {
  id: WorkScreen.signin,
  title: "Signin",
  path: "/signin",
};

const page_early_access: PageConfig = {
  id: WorkScreen.upgrade,
  title: "Upgrade",
  path: "/upgrade",
};

/**
 * list of all pages
 */
const all_pages: PageConfig[] = [
  page_content_g11n,
  page_design_lint,
  page_design_preview,
  page_design_layout,
  page_design_icon,
  page_design_photo,
  page_design_copywriter,
  page_code_layout,
  page_code_preview,
  page_code_component,
  page_code_lint,
  page_live_session,
  // standalones
  page_signup,
  page_about,
  page_early_access,
  // tools
  page_toolbox_home,
  page_toolbox_data_mapper,
  page_toolbox_batch_meta_editor,
  page_toolbox_meta_editor,
  page_toolbox_desing_button_maker,
  page_toolbox_font_replacer,
  page_toolbox_home,
  page_toolbox_code_syntax_highlight,
];

export const standalone_pages: PageConfig[] = [
  page_signup,
  page_about,
  page_early_access,
  // tools
  page_toolbox_home,
  page_toolbox_data_mapper,
  page_toolbox_batch_meta_editor,
  page_toolbox_meta_editor,
  page_toolbox_desing_button_maker,
  page_toolbox_font_replacer,
  page_toolbox_home,
  page_toolbox_code_syntax_highlight,
];

export function get_page_config(id: WorkScreen): PageConfig {
  const _ = all_pages.find((p) => p.id === id);
  if (_) {
    return _;
  }
  throw `${id} is not found from registered page configs`;
}

export function get_page_config_by_path(path: string) {
  return all_pages.find((p) => p.path === path);
}

///
/// endregion page declarations
///
