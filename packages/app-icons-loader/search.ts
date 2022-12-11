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

  if (!query) {
    return metas;
  }

  const q = query?.toLowerCase();
  // split [" ", ","]
  const qs = q?.split(/[\s,]+/).filter((q) => q.length > 0);

  return metas.filter((m) => {
    // name
    if (qs.some((q) => m.name.toLowerCase().includes(q))) {
      return true;
    }

    // category
    if (m.category && qs.some((q) => m.category.toLowerCase().includes(q))) {
      return true;
    }

    // package
    if (qs.some((q) => m.package.toLowerCase().includes(q))) {
      return true;
    }

    // tags
    if (m.tags.some((t) => qs.some((q) => t.toLowerCase().includes(q)))) {
      return true;
    }
    // return m.tags.some((t) => t.includes(query));
  });
}
