////
//// Manage the quota of app usage as on unauthenticated anonymous user.
////

import { PluginSdk } from "@plugin-sdk/app";

const _STATE_STORE_KEY = "trial-state-store-key";
export class TrialManager {
  private static _instance: TrialManager;
  private state;
  public static get instance(): TrialManager {
    if (!TrialManager._instance) {
      TrialManager._instance = new TrialManager();
    }
    return TrialManager._instance;
  }

  private constructor() {
    this._loadstate();
  }

  async _loadstate() {
    if (!this.state) {
      this.state = await PluginSdk.getItem(_STATE_STORE_KEY);
    }
  }
}
