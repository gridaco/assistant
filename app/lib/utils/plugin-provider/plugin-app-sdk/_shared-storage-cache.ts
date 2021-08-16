/** Memory cache for saving data in memory before actual IO completes. */
export class _SharedStorageCache {
  constructor(readonly id: string) {}

  private __cache: Map<string, any> = new Map();

  setCache<T = string>(key: string, value: T) {
    this.__cache.set(key, value);
  }

  getCache<T = string>(key: string): T {
    return this.__cache.get(key) as T;
  }

  /** clears all cahce allocated */
  clearCache() {
    this.__cache = new Map();
  }

  removeCache(key: string) {
    this.__cache.delete(key);
  }
}
