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

function saveProfile(profile) {
  // usees localstorage
  window.localStorage.setItem("my-profile", JSON.stringify(profile));
}

function getProfile() {
  // usees localstorage
  return JSON.parse(window.localStorage.getItem("my-profile"));
}

export const AuthStorage = {
  save: saveAuthCredential,
  saveProfile: saveProfile,
  get: getAuthCredential,
  getProfile: getProfile,
};
