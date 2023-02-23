import { ImageExportOptions, QuickImageExportPreset } from "@plugin-sdk/core";

type SerializableImageExportOption =
  | ImageExportOptions
  | QuickImageExportPreset;

export class PreviewSessionCache {
  private readonly key;
  constructor(
    readonly node: string,
    readonly setting: SerializableImageExportOption
  ) {
    this.key = `${node}-${
      typeof setting === "string" ? setting : JSON.stringify(setting)
    }`;
  }

  setCache(data: Uint8Array) {
    const payload = JSON.stringify(Array.from(data));
    payload && window.localStorage.setItem(this.key, payload);
  }

  getCache(): Uint8Array | null {
    const payload = window.localStorage.getItem(this.key);
    return payload && new Uint8Array(JSON.parse(payload));
  }
}
