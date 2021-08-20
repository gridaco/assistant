/**
 * holder interface for focusing to target node with zoom
 */
export interface FocusRequest {
  /** target node/layer id */
  target: string;
  /** zoom */
  zoom?: number;
}
