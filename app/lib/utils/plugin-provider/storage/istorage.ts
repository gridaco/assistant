export interface IStorage<T = string> {
  getItem(key: string): Promise<T>;
  setItem(key: string, value: T);
}
