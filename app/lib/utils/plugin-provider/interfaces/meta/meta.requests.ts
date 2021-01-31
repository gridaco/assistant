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
