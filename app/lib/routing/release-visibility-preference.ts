import { WorkScreen } from "./work-screen";
import type { TabLayout } from "./layout-preference";

export type ReleaseChannel = "release" | "beta" | "alpha";
export interface ReleaseVisibilityPreference {
  screen: WorkScreen;
  allowedChannel: ReleaseChannel;
}

const SCREEN_VISIBILITY_PREFERENCE: Map<WorkScreen, ReleaseChannel> = new Map([
  [WorkScreen.code, "release"],
  [WorkScreen.about, "release"],
  [WorkScreen.upgrade, "release"],
  [WorkScreen.component, "beta"],
  [WorkScreen.layout, "beta"],
  [WorkScreen.icon, "release"],
  [WorkScreen.photo, "release"],
  [WorkScreen.copy, "release"],
  [WorkScreen.preview, "release"],
  [WorkScreen.live, "beta"],
  [WorkScreen.lint, "release"],
  [WorkScreen.g11n, "beta"],
  [WorkScreen.exporter, "beta"],
  [WorkScreen.dev, "beta"],
  [WorkScreen.tool_code_syntax_highlighter, "beta"],
  [WorkScreen.tool_desing_button_maker, "alpha"],
  [WorkScreen.tool_font_replacer, "release"],
  [WorkScreen.tool_meta_editor, "release"],
  [WorkScreen.tool_batch_meta_editor, "release"],
  [WorkScreen.tool_data_mapper, "release"],
]);

export function include_in(
  screen: WorkScreen,
  channel: ReleaseChannel
): boolean {
  if (SCREEN_VISIBILITY_PREFERENCE.get(screen) === channel) {
    return true;
  } else {
    return false;
  }
}

export function include_in_production(screen: WorkScreen): boolean {
  return include_in(screen, "release");
}

export function filter_production_only(layout: TabLayout) {
  // this only returns release capable screens on production mode, if not -> reutns all.
  const filtered = layout.filter((e) => {
    const release = process.env.NODE_ENV == "production";
    if (release) {
      return include_in_production(e);
    }
    return true;
  });
  return filtered;
  //
}
