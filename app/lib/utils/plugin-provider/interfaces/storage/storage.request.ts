export type StorageRequest = StorageSetItemRequest | StorageGetItemRequest;
export interface StorageSetItemRequest<T = string> {
  type: "set-item";
  key: string;
  /** value must be json serializable. (without circular reference.) */
  value: T;
}

export interface StorageGetItemRequest<T = string> {
  type: "get-item";
  key: string;
}

export interface StorageRemoveItemRequest {
  type: "remove-item";
  key: string;
}
