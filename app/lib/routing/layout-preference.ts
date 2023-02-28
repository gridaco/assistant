import { filter_production_only } from "./release-visibility-preference";
import { WorkMode } from "./work-mode";
import { WorkScreen } from "./work-screen";

export type TabLayout = ReadonlyArray<WorkScreen>;

export function getWorkmodeTabLayout(workspaceMode: WorkMode): TabLayout {
  const layouts = (): TabLayout => {
    switch (workspaceMode) {
      case WorkMode.code:
        return [
          WorkScreen.code,
          WorkScreen.component,
          WorkScreen.live,
          // WorkScreen.layout,
          WorkScreen.lint,
        ];
      case WorkMode.design:
        return [
          WorkScreen.preview,
          WorkScreen.icon,
          WorkScreen.photo,
          WorkScreen.copy,
          WorkScreen.lint,
          WorkScreen.layout,
        ];
      case WorkMode.content:
        return [WorkScreen.g11n, WorkScreen.exporter];
      case WorkMode.settings:
        return [WorkScreen.about];
      case WorkMode.toolbox:
        return [
          WorkScreen.tool_code_syntax_highlighter,
          WorkScreen.tool_font_replacer,
          WorkScreen.tool_desing_button_maker,
          WorkScreen.tool_meta_editor,
          WorkScreen.tool_batch_meta_editor,
          WorkScreen.tool_data_mapper,
        ];
    }
  };

  return filter_production_only(layouts());
}

export function workScreenToName(appMode: WorkScreen): string {
  switch (appMode) {
    case WorkScreen.about:
      return "about";
    case WorkScreen.upgrade:
      return "upgrade";
    case WorkScreen.code:
      return "code";
    case WorkScreen.code_flutter:
      return "flutter";
    case WorkScreen.code_react:
      return "react";
    case WorkScreen.component:
      return "component";
    case WorkScreen.live:
      return "live";
    case WorkScreen.layout:
      return "layout";
    case WorkScreen.preview:
      return "preview";
    case WorkScreen.tool_home:
      return "tools";
    case WorkScreen.icon:
      return "icon";
    case WorkScreen.photo:
      return "photo";
    case WorkScreen.copy:
      return "copy";
    case WorkScreen.lint:
      return "lint";
    case WorkScreen.exporter:
      return "exporter";
    case WorkScreen.g11n:
      return "globalization";
    case WorkScreen.tool_code_syntax_highlighter:
      return "syntax highlight";
    case WorkScreen.tool_desing_button_maker:
      return "button maker";
    case WorkScreen.tool_font_replacer:
      return "font replacer";
    case WorkScreen.tool_meta_editor:
      return "meta datas";
    case WorkScreen.tool_batch_meta_editor:
      return "batch meta data";
    case WorkScreen.tool_data_mapper:
      return "data mapper";
  }
  console.warn(`name not found for ${appMode}`);
  return "N/A";
}

export function worspaceModeToName(workspaceMode: WorkMode): string {
  switch (workspaceMode) {
    case WorkMode.code:
      return "Code";
    case WorkMode.design:
      return "Design";
    case WorkMode.content:
      return "Content";
    case WorkMode.settings:
      return "About"; // change to settings after other features are implemented.
    case WorkMode.toolbox:
      return "Tools";
  }
  console.warn(`no name found for workspace mode ${workspaceMode}`);
  return "N/A";
}
