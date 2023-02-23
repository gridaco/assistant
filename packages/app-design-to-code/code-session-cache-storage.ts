import { DesigntoCodeUserOptions } from "./user-options";

export class CodeSessionCacheStorage {
  private readonly key;
  constructor(
    readonly node: string,
    readonly preference: DesigntoCodeUserOptions
  ) {
    if (!node || !preference) {
      // both required
      this.key = null;
    } else {
      this.key = `${node}-${preference?.framework}-${preference?.language}`;
    }
  }

  setCache(code: string) {
    if (this.key) {
      window.localStorage.setItem(this.key, code);
    }
  }

  getCache(): string | null {
    if (this.key) {
      return window.localStorage.getItem(this.key);
    }
    // using null return since localstorage return is also optional<null>
    return null;
  }
}
