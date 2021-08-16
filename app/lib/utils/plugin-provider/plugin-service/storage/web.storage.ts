import { IStorage } from "./istorage";
import { encode, decode } from "./payload-handle";

/**
 * web storage using general localstorage
 */
export class WebStorage<T> implements IStorage<T> {
  getItem(key: string): Promise<T> {
    return decode(window.localStorage.getItem(key));
  }

  setItem(key: string, value: T) {
    window.localStorage.setItem(key, encode(value));
  }
}
