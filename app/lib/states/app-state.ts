import { atom } from "recoil";

export enum WorkspaceMode {
  code,
  design,
  content,
  toolbox,
  settings, // "about" page for now
}

export enum WorkScreen {
  about = "about",
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
  tool_data_mapper = "tool_data_mapper",
}

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

type TabLayout = ReadonlyArray<WorkScreen>;

export function getWorkspaceTabLayout(workspaceMode: WorkspaceMode): TabLayout {
  const layouts = (): TabLayout => {
    switch (workspaceMode) {
      case WorkspaceMode.code:
        return [
          WorkScreen.code,
          WorkScreen.component,
          WorkScreen.layout,
          WorkScreen.lint,
          WorkScreen.slot,
        ];
      case WorkspaceMode.design:
        return [WorkScreen.icon, WorkScreen.layout, WorkScreen.lint];
      case WorkspaceMode.content:
        return [WorkScreen.g11n, WorkScreen.lint, WorkScreen.exporter];
      case WorkspaceMode.settings:
        return [WorkScreen.about];
      case WorkspaceMode.toolbox:
        return [
          WorkScreen.tool_font_replacer,
          WorkScreen.desing_button_maker,
          WorkScreen.tool_meta_editor,
          WorkScreen.tool_batch_meta_editor,
          WorkScreen.tool_data_mapper,
        ];
    }
  };

  // this only returns release capable screens on production mode, if not -> reutns all.
  const filtered = layouts().filter((e) => {
    const release = process.env.NODE_ENV == "production";
    if (release) {
      if (SCREEN_VISIBILITY_PREFERENCE.get(e) === "release") {
        return true;
      } else {
        return false;
      }
    }
    return true;
  });
  return filtered;
}

const SCREEN_VISIBILITY_PREFERENCE: Map<WorkScreen, ReleaseChannel> = new Map([
  [WorkScreen.code, "release"],
  [WorkScreen.about, "release"],
  [WorkScreen.component, "release"],
  [WorkScreen.layout, "beta"],
  [WorkScreen.icon, "release"],
  [WorkScreen.lint, "release"],
  [WorkScreen.g11n, "beta"],
  [WorkScreen.exporter, "beta"],
  [WorkScreen.dev, "beta"],
  [WorkScreen.slot, "alpha"],
  [WorkScreen.desing_button_maker, "alpha"],
  [WorkScreen.tool_font_replacer, "release"],
  [WorkScreen.tool_meta_editor, "release"],
  [WorkScreen.tool_batch_meta_editor, "release"],
  [WorkScreen.tool_data_mapper, "release"],
]);
