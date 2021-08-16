import { BatchMetaOperationTargetType } from "./meta.types";

export interface BatchMetaUpdateRequest<T = any> {
  targetType: BatchMetaOperationTargetType;
  custom: T;
  key: string;
  value: string;
}

export interface BatchMetaFetchRequest {
  key: string;
}

export interface NodeMetaFetchRequest {
  /**
   * the id of node
   */
  id: string;
  namespace: string;
  key: string;
}

export interface NodeMetaUpdateRequest<T = any> {
  /**
   * the id of node
   */
  id: string;
  namespace: string;
  key: string;
  value: T;
}
