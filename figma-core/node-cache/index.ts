import { SceneNode } from "@design-sdk/figma-types";
import { ReflectSceneNode } from "@design-sdk/figma-node";

const RUNTIME_RAPID_SHORT_LIVED_CACHE_TIMEOUT_MS = 5 * 1000; // after 5 seconds, we'll assume the node is not available
const RUNTIME_SHORT_LIVED_SAME_SELECTION_CACHE_TIMEOUT_MS = 2.5 * 1000;

interface TimedCacheContainer<T> {
  updatedAt: number;
  data: T;
}

/** Global runtime figma selection & conversion cache repository
 * @todo: add conversion cache
 */
export class FigmaNodeCache {
  constructor() {}

  private static _lastSelections: string[] = [];
  static get lastSelections(): string[] {
    return this._lastSelections;
  }

  private static _conversions: {
    [key: string]: TimedCacheContainer<ReflectSceneNode>;
  } = {};
  private static _lastConverted: TimedCacheContainer<ReflectSceneNode> | null =
    null;
  static get lastConverted(): ReflectSceneNode | null {
    return this._lastConverted.data;
  }

  static select(...ids: string[]) {
    this._lastSelections = ids;

    /// when deselected, update last selected nodes' updated at.
    if (ids.length === 0) {
      this._lastConverted = {
        ...this._lastConverted,
        updatedAt: Date.now(),
      };
    }
  }

  static setConverted(rnode: ReflectSceneNode) {
    const record = {
      updatedAt: Date.now(),
      data: rnode,
    };
    this._conversions[rnode.id] = record;
    this._lastConverted = record;
  }

  static getConverted(id: string): ReflectSceneNode | null {
    // when the selection is not changed, without looking up the timeout, return the last converted node.
    if (id == this._lastConverted?.data?.id) {
      if (
        this._lastConverted.updatedAt +
          RUNTIME_SHORT_LIVED_SAME_SELECTION_CACHE_TIMEOUT_MS >
        Date.now()
      ) {
        return this._lastConverted.data;
      }
    }
    //
    const conversion = this._conversions[id];
    if (conversion) {
      if (
        conversion.updatedAt + RUNTIME_RAPID_SHORT_LIVED_CACHE_TIMEOUT_MS >
        Date.now()
      ) {
        return conversion.data;
      }
    }
    return null;
  }

  static get lastId(): string | null {
    return this._lastSelections[
      this._lastSelections.length - 1
    ]; /* TODO: check if last index of selection is truely a last selection as user input seq*/
  }

  static getLast(): SceneNode | null {
    if (this._lastSelections) {
      return figma.getNodeById(this.lastId) as any as SceneNode;
    }
    return null;
  }

  static getLastConverted(): ReflectSceneNode | null {
    if (this.lastId && this.lastId == this._lastConverted?.data?.id) {
      return this._lastConverted.data;
    }
    return null;
  }
}
