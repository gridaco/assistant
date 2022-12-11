// save recently used items

const _k_store_key = "icons-load-history";

export class IconsLoadHistory {
  private readonly history: Set<string>;

  constructor() {
    this.history = new Set();

    const items = localStorage.getItem(_k_store_key);
    if (items) {
      this.history = new Set(JSON.parse(items));
    }
  }

  list(to: number = Infinity) {
    return Array.from(this.history).reverse().slice(0, to);
  }

  push(item: string) {
    this.history.delete(item);
    this.history.add(item);
    this.save();
  }

  private save() {
    localStorage.setItem(_k_store_key, JSON.stringify(this.list()));
  }
}
