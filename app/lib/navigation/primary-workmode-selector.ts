import { WorkMode } from "./work-mode";
export interface PrimaryWorkmodeSet {
  first: WorkMode;
  second: WorkMode;
}

export function getPrimaryWorkmodeSet(): PrimaryWorkmodeSet {
  return {
    first: WorkMode.code,
    second: WorkMode.design,
  };
}
