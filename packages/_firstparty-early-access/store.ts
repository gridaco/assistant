import { __key } from "./k";
import { PluginSdk } from "@plugin-sdk/app";

const store = {
  set: (value: any) => {
    return PluginSdk.setItem(__key, value);
  },
  get: async () => {
    return await PluginSdk.getItem(__key);
  },
};

export default store;
