import { createContext } from "react";
import { State } from "./state";

export const StateContext = createContext<State | undefined>(undefined);
