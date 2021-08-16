import { IStorage } from "./istorage";

/**
 * web storage using general localstorage
 */
export class WebStorage<T> implements IStorage<T> {
  getItem(key: string): T {
    const parse = window.localStorage.getItem(key);
    return JSON.parse(parse);
  }

  setItem(key: string, value: T) {
    const payload = JSON.stringify(value);
    return window.localStorage.setItem(key, payload);
  }
}
