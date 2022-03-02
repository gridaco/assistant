import { PluginSdk } from "@plugin-sdk/app";
import { NS_FILE_ROOT_METADATA } from "@core/constant";

export const saveFilekey = async (filekey: string) => {
  return PluginSdk.updateMetadata({
    type: "node-meta-update-request",
    id: "0:0", // 0:0 stands for root node
    key: "filekey",
    value: filekey,
    namespace: NS_FILE_ROOT_METADATA,
  });
};

export const loadFilekey = async (): Promise<string> => {
  return await PluginSdk.fetchRootMetadata("filekey");
};
