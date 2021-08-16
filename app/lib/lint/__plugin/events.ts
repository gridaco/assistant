import { PluginSdk } from "@plugin-sdk/app";
import { PluginSdkService } from "@plugin-sdk/service";

const EVKEY = "lint-runner-custom-transport";
export const _APP_EVENT_LINT_RESULT_EK = "lint-result";
export interface LintRequest {
  type: "lint-request";
}

export type _Lint_Event = LintRequest;

export function fromApp(data: _Lint_Event) {
  PluginSdk.appEvent(EVKEY, data);
}

export function onService(cb: (data: _Lint_Event) => void) {
  PluginSdkService.onAppReqquest(EVKEY, cb);
}
