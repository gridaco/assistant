export interface SchemaAndLanguage {
  language: string;
  colorSchema: string;
}

export type FavoriteBookmarks = SchemaAndLanguage[];
export type CurrentPreference = SchemaAndLanguage;
