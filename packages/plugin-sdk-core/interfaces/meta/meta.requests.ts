import { BatchMetaOperationTargetType } from "./meta.types";

export type MetaRequest =
  | BatchMetaUpdateRequest
  | BatchMetaFetchRequest
  | NodeMetaFetchRequest
  | NodeMetaUpdateRequest;

export interface BatchMetaUpdateRequest<T = any> {
  type: "batch-meta-update-request";
  targetType: BatchMetaOperationTargetType;
  custom: T;
  key: string;
  value: string;
}

export interface BatchMetaFetchRequest {
  type: "batch-meta-fetch-request";
  key: string;
}

export interface NodeMetaFetchRequest {
  type: "node-meta-fetch-request";
  /**
   * the id of node
   */
  id: string;
  namespace: string;
  key: string;
}

export interface NodeMetaUpdateRequest<T = any> {
  type: "node-meta-update-request";
  /**
   * the id of node
   */
  id: string;
  namespace: string;
  key: string;
  value: T;
}
