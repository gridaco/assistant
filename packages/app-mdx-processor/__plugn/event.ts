import { PluginSdk } from "@plugin-sdk/app";
import { PluginSdkService } from "@plugin-sdk/service";

const _KEY = "@app/mdx-processor";

export type Requests = ParseMdxRequest;
export interface ParseMdxRequest {
  type: "request-parse-mdx-from-frame";
  /**
   * target frame id to parse
   */
  frame: string;
  /**
   * @deprecated - wip
   */
  options?: {
    customComponents?: {}[];
  };
}

export interface MdxParsedResponse {
  /**
   * full mdx code
   */
  mdx: string;
  /**
   * @deprecated - not implemented
   * mdx value mapped by node id
   */
  map?: { [node: string]: string };
}

export function fromApp(req: Requests) {
  PluginSdk.appEvent(_KEY, req);
}

export function onService(cb: (data: Requests) => void) {
  PluginSdkService.onAppReqquest(_KEY, cb);
}
