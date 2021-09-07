///
///
///
import { PluginSdk } from "@plugin-sdk/app";

/** Preserve value: Do not change value */
const _ASSISTANT_GRIDA_AUTHENTICATION_CREDENTIAL_KEY =
  "co.grida.assistant/user-auth";

type Credential = string;

function saveAuthCredential(credential: Credential) {
  PluginSdk.setItem(_ASSISTANT_GRIDA_AUTHENTICATION_CREDENTIAL_KEY, credential);
}

async function getAuthCredential(): Promise<Credential> {
  return PluginSdk.getItem(_ASSISTANT_GRIDA_AUTHENTICATION_CREDENTIAL_KEY);
}

export const AuthStorage = {
  save: saveAuthCredential,
  get: getAuthCredential,
};
