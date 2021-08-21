import { PluginSdk } from "@plugin-sdk/app";
import { WorkMode } from "../work-mode";
import { WorkScreen } from "../work-screen";

async function _set_work_by_workmode(workmode: WorkMode, work: string) {
  PluginSdk.setItem(_make_id(workmode), work);
}

async function _get_work_by_workmode(workmode: WorkMode) {
  const saved = await PluginSdk.getItem(_make_id(workmode));
  if (!saved) {
    return _default_work_by_workmode(workmode);
  }
}

function _default_work_by_workmode(workmode: WorkMode): WorkScreen {
  switch (workmode) {
    case WorkMode.code:
      return WorkScreen.code;
    case WorkMode.design:
      return WorkScreen.icon;
  }
}

function _make_id(workmode: WorkMode): string {
  return `workmode-current-work-of-${workmode}`;
}

///
/// region export
///
export const saved_work_by_workmode = {
  set: _set_work_by_workmode,
  get: _get_work_by_workmode,
};
///
/// endregion export
///
