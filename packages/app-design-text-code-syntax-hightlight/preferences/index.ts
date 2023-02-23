import { SchemaAndLanguage, FavoriteBookmarks } from "../models";
import { PluginSdk } from "@plugin-sdk/app";

const current_schema_and_language_setting_key =
  "highlighter/current-schema-and-language";
const bookmarks_store_key = "highlighter/favorite-settings-bookmark";

export async function get_syntax_highlight_preferences() {
  return await PluginSdk.getItem<SchemaAndLanguage>(
    current_schema_and_language_setting_key
  );
}

export async function set_syntax_highlight_preferences(d: SchemaAndLanguage) {
  return await PluginSdk.setItem<SchemaAndLanguage>(
    current_schema_and_language_setting_key,
    d
  );
}

export async function get_favorite_bookmarks() {
  return await PluginSdk.getItem<SchemaAndLanguage[]>(bookmarks_store_key);
}

export function set_favorite_bookmarks(l: FavoriteBookmarks) {
  PluginSdk.setItem(bookmarks_store_key, l);
}
