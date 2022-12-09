import type { IconMeta } from "./resources";

/**
 * filters icon meta by query from name, category, tags
 * @returns
 */
export function search(
  metas: Array<IconMeta>,
  { query }: { query?: string }
): IconMeta[] {
  // fields
  // - name (fuzzy search)
  // - tags (fuzzy search)
  // - category (fuzzy search)

  return metas.filter((m) => {
    if (m.name.includes(query)) {
      return true;
    }

    if (m.category?.includes(query)) {
      return true;
    }

    return m.tags.some((t) => t.includes(query));
  });
}
