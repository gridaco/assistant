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

const page_code_mdx: PageConfig = {
  id: WorkScreen.code_mdx,
  title: "MDX",
  path: "/code/mdx",
};

const page_code_lint: PageConfig = {
  id: WorkScreen.lint,
  title: "Lint",
  path: "/code/lint",
};

const page_design_icon: PageConfig = {
  id: WorkScreen.icon,
  title: "Icon",
  path: "/design/icons",
};

const page_design_layout: PageConfig = {
  id: WorkScreen.layout,
  title: "Layout",
  path: "/design/layout",
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
  path: "/design/code-syntax-highlight",
};

const page_scene_upload_steps_final: PageConfig = {
  id: WorkScreen.scene_upload_steps_final,
  title: "Review your scene", // not used
  path: "/code/uploadsteps/final-upload",
};

const page_signup: PageConfig = {
  id: WorkScreen.signin,
  title: "Signin",
  path: "/signin",
};

/**
 * list of all pages
 */
const all_pages: PageConfig[] = [
  page_toolbox_data_mapper,
  page_toolbox_batch_meta_editor,
  page_toolbox_meta_editor,
  page_toolbox_desing_button_maker,
  page_toolbox_font_replacer,
  page_content_g11n,
  page_design_lint,
  page_design_layout,
  page_design_icon,
  page_code_layout,
  page_code_preview,
  page_code_component,
  page_code_lint,
  page_code_mdx,
  page_toolbox_code_syntax_highlight /** temporarily under design workmode */,
  // standalones
  page_signup,
  page_about,
  page_scene_upload_steps_final,
];

export const standalone_pages: PageConfig[] = [
  page_signup,
  page_about,
  page_scene_upload_steps_final,
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
