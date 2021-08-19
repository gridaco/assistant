import { SceneNode } from "@design-sdk/figma-types";
import { ReflectSceneNode } from "@design-sdk/core/nodes";

/** Global runtime figma selection & conversion cache repository
 * @todo: add conversion cache
 */
export class FigmaNodeCache {
  constructor() {}

  private static _lastSelections: string[] = [];
  static get lastSelections(): string[] {
    return this._lastSelections;
  }

  private static _lastConverted: ReflectSceneNode | null = null;
  static get lastConverted(): ReflectSceneNode | null {
    return this._lastConverted;
  }

  static select(...ids: string[]) {
    this._lastSelections = ids;
  }

  static setConverted(rnode: ReflectSceneNode) {
    this._lastConverted = rnode;
  }

  static get lastId(): string | null {
    return this._lastSelections[
      this._lastSelections.length - 1
    ]; /* TODO: check if last index of selection is truely a last selection as user input seq*/
  }

  static getLast(): SceneNode | null {
    if (this._lastSelections) {
      return figma.getNodeById(this.lastId) as SceneNode;
    }
    return null;
  }

  static getLastConverted(): ReflectSceneNode | null {
    if (this.lastId == this._lastConverted?.id) {
      return this._lastConverted;
    }
    return null;
  }
}
