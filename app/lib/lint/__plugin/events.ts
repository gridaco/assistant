import { PluginSdk } from "@plugin-sdk/app";
import { PluginSdkService } from "@plugin-sdk/service";

const EVKEY = "lint-runner-custom-transport";
export interface D {}

export function fromApp(data: D) {
  PluginSdk.appEvent(EVKEY, data);
}

export function onService(cb: (data: D) => void) {
  PluginSdkService.onAppReqquest(EVKEY, cb);
}
