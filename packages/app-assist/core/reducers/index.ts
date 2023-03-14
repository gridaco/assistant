import { Action } from "core/actions";
import type { State } from "core/states";
import produce from "immer";

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    default: {
      return produce(state, (draft) => {
        return state;
      });
    }
  }
}
