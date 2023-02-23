// save recently used items

import type { Icon } from "./resources";

const _k_store_key = "icons-load-history";

export class IconsLoadHistory {
  private readonly data: Array<Icon> = [];

  constructor(readonly max: number = 50) {
    const items = localStorage.getItem(_k_store_key);
    if (items) {
      this.data = JSON.parse(items);
    }
  }

  list(to: number = Infinity): Array<Icon> {
    return Array.from(this.data).reverse().slice(0, to);
  }

  push(item: Icon) {
    const index = this.data.findIndex(
      (i) =>
        i.package === item.package &&
        i.name === item.name &&
        i.variant === item.variant
    );
    if (index >= 0) {
      this.data.splice(index, 1);
    }
    this.data.push(item);

    if (this.data.length > this.max) {
      this.data.shift();
    }

    this.save();
  }

  private save() {
    localStorage.setItem(_k_store_key, JSON.stringify(this.data));
  }
}
