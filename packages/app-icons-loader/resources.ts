import { useState, useEffect } from "react";
import Axios from "axios";
import { search } from "./search";
const _BUCKET = "https://reflect-icons.s3-us-west-1.amazonaws.com";
const _META_JSON_S3 = _BUCKET + "/all.v2.json";

export type IConStyleVariant =
  | "solid"
  | "outlined"
  | "thin"
  | "twotone"
  | "sharp"
  | "round";

export interface IconMeta {
  uri: string;
  name: string;
  variants: Array<IConStyleVariant>;
  font?: string;
  codepoint?: number;
  size: number;
  package: string;
  version: number;
  category: string;
  tags: string[];
}

export interface Icon {
  name: string;
  size: number;
  variant?: IConStyleVariant | null;
  package: string;
}

let _cachedMeta: Array<IconMeta> = undefined;
export function fetchMeta() {
  if (_cachedMeta) {
    return Promise.resolve(_cachedMeta);
  }
  return fetch(_META_JSON_S3)
    .then((response) => response.json())
    .then((json) => {
      _cachedMeta = json;
      return json;
    });
}

export function useIcons({
  query = "",
  max = 100,
}: {
  query?: string;
  max?: number;
}) {
  const [meta, setMeta] = useState<Array<IconMeta>>(undefined);
  const [queriedMeta, setQueriedMeta] = useState<Array<IconMeta>>(undefined);
  const [icons, setIcons] = useState<Array<Icon>>(undefined);

  useEffect(() => {
    fetchMeta().then((d) => {
      setMeta(d);
      setQueriedMeta(d);
    });
  }, []);

  useEffect(() => {
    if (meta) {
      setQueriedMeta(search(meta, { query }));
    }
  }, [query, meta]);

  useEffect(() => {
    if (queriedMeta) {
      let icons = queriedMeta.flatMap((meta) => {
        if (meta.variants.length === 0) {
          return {
            name: meta.name,
            size: meta.size,
            package: meta.package,
          } as Icon;
        }
        return meta.variants.map((variant) => {
          return {
            name: meta.name,
            variant: variant,
            size: meta.size,
            package: meta.package,
          } as Icon;
        });
      });

      setIcons(icons);
    }
  }, [queriedMeta]);

  const hasMore = icons?.length > max;

  let result = Array.from(icons ?? []);

  // sort by package name

  const pkg_order = query
    ? ["radix-ui", "unicons", "material", "ant-design"] // if query is set, prioritize radix-ui and unicons
    : ["radix-ui", "material", "unicons", "ant-design"]; // if query is not set, prioritize radix-ui and material
  result = result.sort((i, i2) => {
    const pkg1 = pkg_order.indexOf(i.package);
    const pkg2 = pkg_order.indexOf(i2.package);
    if (pkg1 < pkg2) {
      return -1;
    }
    if (pkg1 > pkg2) {
      return 1;
    }
    return 0;
  });

  return { icons: result.slice(0, max), hasMore };
}

/**
 * sorts icons with below logic
 * 1. sort a-z first
 * 2. sort number later
 *
 * e.g. ["a", "b", "1", "2", "1a", "a1"]
 * -> ["a", "a1", "b", "1", "1a", "2"]
 */
function sort_alphabetically(names: string[]) {
  const _contains_number_char = (c) => {
    return "0123456789".includes(c[0] ?? "");
  };
  return names.sort((i, i2) => {
    if (_contains_number_char(i) && _contains_number_char(i2)) {
      return Number(i) - Number(i2);
    } else if (_contains_number_char(i) && !_contains_number_char(i2)) {
      return 1;
    } else if (!_contains_number_char(i) && _contains_number_char(i2)) {
      return -1;
    } else if (!_contains_number_char(i) && !_contains_number_char(i2)) {
      if (i < i2) {
        return -1;
      }
      if (i > i2) {
        return 1;
      }
      return 0;
    }
  });
}

export async function loadSvg(
  icon: Icon,
  options?: {
    disable_cache: boolean;
  }
): Promise<string> {
  const headers = {};
  if (options?.disable_cache) {
    headers["Cache-Control"] = "no-cache";
  }

  const url = makeIconUrl(icon);
  const raw =
    await // s3 cors issue. fetching resource wil cause cors issue with 200, if cache is enabled. (don't know why !)
    (
      await Axios.get(url, { headers: headers })
    ).data;
  return raw;
}

export function makeIconUrl(icon: Icon): string {
  const __ = sepkeymap[icon.package];
  let filename = icon.name;
  if (icon.variant) {
    switch (icon.package) {
      case "material": {
        switch (icon.variant) {
          case "solid":
            // on material, no suffix on solid
            break;
          case "outlined":
            filename += `${__}outlined`;
            break;
          case "round":
            filename += `${__}round`;
            break;
          case "sharp":
            filename += `${__}sharp`;
            break;
          case "twotone":
            filename += `${__}twotone`;
            break;
        }
        break;
      }
      case "ant-design": {
        switch (icon.variant) {
          case "solid":
            filename += `${__}default`; // legacy file naming support
            break;
          case "outlined":
            filename += `${__}outlined`;
            break;
          case "round":
            filename += `${__}round`;
            break;
          case "sharp":
            filename += `${__}sharp`;
            break;
          case "twotone":
            filename += `${__}twotone`;
            break;
        }
        break;
      }
      case "radix-ui": {
        // no variants supported on radix-ui icons
        break;
      }
      case "unicons": {
        switch (icon.variant) {
          case "solid":
            filename += `${__}solid`;
            break;
          case "thin":
            filename += `${__}thinline`; // unicons only
            break;
          case "outlined":
            filename += `${__}outlined`;
            break;
          case "round":
            filename += `${__}round`;
            break;
          case "sharp":
            filename += `${__}sharp`;
            break;
          case "twotone":
            filename += `${__}twotone`;
            break;
        }
        break;
      }
    }
  }
  return `https://reflect-icons.s3-us-west-1.amazonaws.com/${icon.package}/${filename}.svg`;
}

const sepkeymap = {
  material: "_",
  "ant-design": "-",
  "radix-ui": "-",
  unicons: "-",
} as const;
