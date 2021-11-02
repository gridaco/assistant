import { PluginSdk } from "@plugin-sdk/app";
import { PluginSdkService } from "@plugin-sdk/service";

const EVKEY = "figma-checksum-custom-transport";
export interface SignatureSeedRequest {
  type: "seed-signature-request";
  signature: string;
  /**
   * untrusted user provied filekey to be verified
   */
  filekey: string;
}

export type _Checksum_Event = SignatureSeedRequest;

export function fromApp(data: _Checksum_Event) {
  PluginSdk.appEvent(EVKEY, data);
}

export function onService(cb: (data: _Checksum_Event) => void) {
  PluginSdkService.onAppReqquest(EVKEY, cb);
}
