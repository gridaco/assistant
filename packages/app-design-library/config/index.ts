export type Categroy = "interface" | "layout" | "basics" | "media" | "seo";

export interface LibraryItem {
  id: string;
  name: string;
  description: string;
  category: Categroy;
}
