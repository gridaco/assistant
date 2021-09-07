import { PluginSdkService } from "@plugin-sdk/service";
import { PluginSdk } from "@plugin-sdk/app";
import { SchemaAndLanguage } from "../models";

const EVKEY = "highligter";
const CHANGE_COLOR_REQUEST_KEY = "CHANGE_COLOR";

export interface HighlightEvent {
  type: typeof CHANGE_COLOR_REQUEST_KEY;
  schemaAndLanguage: SchemaAndLanguage;
}

export function fromApp(data: HighlightEvent) {
  PluginSdk.appEvent(EVKEY, data);
}

export function onService(cb: (data: HighlightEvent) => void) {
  PluginSdkService.onAppReqquest(EVKEY, cb);
}
