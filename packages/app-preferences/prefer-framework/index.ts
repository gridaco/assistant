import { Framework } from "@grida/builder-platform-types";

const key = "prefer-platform";
export class PreferFramework {
  readonly storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }
  set(platform: Framework) {
    this.storage.setItem(key, platform);
  }
  get(options?: { fallback?: Framework }): Framework | undefined {
    return (this.storage.getItem(key) as Framework) ?? options?.fallback;
  }
}
