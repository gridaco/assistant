export enum WorkspaceMode {
  code,
  design,
  content,
  toolbox,
  settings,
}

export enum WorkScreen {
  code = "code",
  component = "component",
  layout = "layout",
  icon = "icon",
  lint = "lint",
  g11n = "g11n",
  dev = "dev",
  slot = "slot",
  exporter = "exporter",
  desing_button_maker = "desing_button_maker",
  tool_font_replacer = "tool_font_replacer",
  tool_meta_editor = "tool_meta_editor",
  tool_batch_meta_editor = "tool_batch_meta_editor",
  tool_componentizer = "tool_componentizer",
}

export function workScreenToName(appMode: WorkScreen): string {
  switch (appMode) {
    case WorkScreen.code:
      return "code";
    case WorkScreen.component:
      return "component";
    case WorkScreen.layout:
      return "layout";
    case WorkScreen.dev:
      return "tools";
    case WorkScreen.icon:
      return "icon";
    case WorkScreen.lint:
      return "lint";
    case WorkScreen.slot:
      return "slots";
    case WorkScreen.exporter:
      return "exporter";
    case WorkScreen.g11n:
      return "globalization";
    case WorkScreen.tool_font_replacer:
      return "font replacer";
    case WorkScreen.tool_meta_editor:
      return "meta datas";
    case WorkScreen.tool_batch_meta_editor:
      return "batch meta data";
    case WorkScreen.desing_button_maker:
      return "button maker";
    case WorkScreen.tool_componentizer:
      return "componentizer";
  }
  console.warn(`name not found for ${appMode}`);
  return "N/A";
}
