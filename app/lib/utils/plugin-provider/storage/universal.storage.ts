import { IStorage } from "./istorage";

/** @deprecated not implemented. */
export class UniversalStorage implements IStorage {
  // storage cache
  setItem(key: string, value: string) {
    //
  }
  getItem(key: string): Promise<string> {
    return;
    //
  }
}
