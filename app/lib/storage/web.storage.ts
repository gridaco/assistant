/**
 * web storage using general localstorage
 */
export class WebStorage {
  getItem(key: string) {
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    return window.localStorage.setItem(key, value);
  }
}
