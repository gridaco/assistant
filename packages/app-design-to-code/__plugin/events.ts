import { PluginSdk } from "@plugin-sdk/app";
import { PluginSdkService } from "@plugin-sdk/service";
import { FrameworkOption } from "../framework-option";

const EVKEY = "design-to-code-preview-custom-transport";
export const _APP_EVENT_CODE_GEN_RESULT_EK = "design-to-code-result";
export interface CodeGenRequest {
  type: "code-gen-request";
  option: FrameworkOption;
  config: {
    do_generate_vanilla_preview_source: boolean;
  };
}

export type _Code_Event = CodeGenRequest;

export function fromApp(data: _Code_Event) {
  PluginSdk.appEvent(EVKEY, data);
}

export function onService(cb: (data: _Code_Event) => void) {
  PluginSdkService.onAppReqquest(EVKEY, cb);
}
