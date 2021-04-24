/// utils for extracting data from data source node
/// if node with name pattern "@//data-source/*", it means it contians data for logic representation.

import {
  ignoranceTypeFrom,
  IgnoreKeys,
} from "@bridged.xyz/design-sdk/lib/features/ignore";
import { Figma } from "@bridged.xyz/design-sdk/lib/figma";
import type { IReflectNodeReference } from "@bridged.xyz/design-sdk/lib/nodes/lignt";

/**
 * currently only root level text are supported for data source node.
 * @param node
 */
export function extractDataFromDataSourceNode<T>(node: Figma.TextNode) {
  const raw = node.characters;
  const data = JSON.parse(raw);
  return data as T;
}

interface DataSourceNodeAndOthers {
  datasource: IReflectNodeReference;
  others: IReflectNodeReference[];
}
export function findDatasourceNodeAndOthers(
  ...all: IReflectNodeReference[]
): DataSourceNodeAndOthers {
  const res: DataSourceNodeAndOthers = {
    datasource: undefined,
    others: [],
  };

  all.forEach((v) => {
    const ignoranceType = ignoranceTypeFrom(v.name);
    console.log(`ignoranceType for ${v.name}`, ignoranceType);
    if (ignoranceType) {
      if (ignoranceType == IgnoreKeys.KEY_DATA_SOURCE) {
        if (res.datasource) {
          throw "multiple datasource node was selected. this is not allowed and assistant cannot identify how to handle this form of input.";
        }
        res.datasource = v;
      }
    } else {
      res.others.push(v);
    }
  });

  return res;
}
