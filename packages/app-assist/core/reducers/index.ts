import { Action } from "core/actions";
import type { State } from "core/states";
import produce from "immer";

export function reducer(state: Action, action: Action): State {
  switch (action.type) {
    default: {
      return produce(state, (draft) => {
        return draft;
      });
    }
  }
}
