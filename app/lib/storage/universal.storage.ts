import { IStorage } from "./istorage";

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
