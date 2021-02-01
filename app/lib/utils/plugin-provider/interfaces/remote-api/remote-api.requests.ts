export interface NetworkRequest {
  requestId: string;
  method: "post" | "get" | "put" | "patch" | "head";
  url: string;
  data?: object;
  headers?: object;
}
