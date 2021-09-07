import { PluginSdk } from "@plugin-sdk/app";
const __client_id_store_key = "co.grida.assistant/user-client-id";
let __memory_cache_client_id: string = null;
async function getClientId() {
  if (!__memory_cache_client_id) {
    __memory_cache_client_id = await PluginSdk.getItem<string>(
      __client_id_store_key
    );
  }
  return __memory_cache_client_id;
}

function setClientId(cid: string) {
  __memory_cache_client_id = cid;
  PluginSdk.setItem<string>(__client_id_store_key, cid);
}

async function upsertClientId(cid: string): Promise<string> {
  if (await getClientId()) {
    return __memory_cache_client_id;
  }
  setClientId(cid);
  return cid;
}

export const client_id_store = {
  get: getClientId,
  set: setClientId,
  upsert: upsertClientId,
};
