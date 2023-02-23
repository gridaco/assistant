import {
  PLUGIN_SDK_EK_UI_RESIZE,
  PLUGIN_SDK_EK_UI_CLOSE,
  PLUGIN_SDK_EK_UI_SHOW,
  PLUGIN_SDK_EK_UI_HIDE,
} from "../../events";

export type UIControlRequest =
  | UIControlResizeRequest
  | UIControlCloseRequest
  | UIControlHideRequest
  | UIControlShowRequest;

export interface UIControlResizeRequest {
  type: typeof PLUGIN_SDK_EK_UI_RESIZE;
  size: { width: number; height: number };
}

export interface UIControlCloseRequest {
  type: typeof PLUGIN_SDK_EK_UI_CLOSE;
}

export interface UIControlHideRequest {
  type: typeof PLUGIN_SDK_EK_UI_HIDE;
}

export interface UIControlShowRequest {
  type: typeof PLUGIN_SDK_EK_UI_SHOW;
}
