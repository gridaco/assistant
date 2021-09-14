import { DesigntoCodeUserOptions } from "./user-options";

export class CodeSessionCacheStorage {
  private readonly key;
  constructor(
    readonly node: string,
    readonly preference: DesigntoCodeUserOptions
  ) {
    this.key = `${node}-${preference?.framework}-${preference?.language}`;
  }

  setCache(code: string) {
    window.localStorage.setItem(this.key, code);
  }

  getCache(): string | null {
    return window.localStorage.getItem(this.key);
  }
}
