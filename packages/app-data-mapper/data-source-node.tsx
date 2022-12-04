/// utils for extracting data from data source node
/// if node with name pattern "@//data-source/*", it means it contians data for logic representation.

// TOOD - make it universal
import { Figma } from "@design-sdk/figma";
import type { IReflectNodeReference } from "@design-sdk/figma-node";

/**
 * currently only root level text are supported for data source node.
 * @param node
 */
export function extractDataFromDataSourceNode<T = any>(
  node: Figma.SceneNode
): T | null {
  try {
    if (node.type == "TEXT") {
      const raw = node.characters;
      const data = JSON.parse(raw);
      return data as T;
    } else {
      console.warn(
        `the givven data source node was not in text node type. selected node was "${node.name}"`
      );
      return null;
    }
  } catch (_) {
    console.warn(_);
    return null;
  }
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
    // FIXME: temporarilly disabled.
    // const ignoranceType = flags.utils.specialKeyTypeFrom(v.name);
    // if (ignoranceType) {
    //   if (ignoranceType == flags.SpecialKeys.KEY_DATA_SOURCE) {
    //     if (res.datasource) {
    //       throw "multiple datasource node was selected. this is not allowed and assistant cannot identify how to handle this form of input.";
    //     }
    //     res.datasource = v;
    //   }
    // } else {
    //   res.others.push(v);
    // }
  });

  return res;
}
