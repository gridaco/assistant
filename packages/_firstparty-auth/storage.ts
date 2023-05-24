import * as k from "./k";

type Credential = string;

function saveAuthCredential(credential: Credential) {
  // usees localstorage
  localStorage.setItem(
    k.ASSISTANT_GRIDA_AUTHENTICATION_CREDENTIAL_KEY,
    credential
  );

  // propagate event (this is required since we're listening in same window)
  // although, caution required since this will trigger multiple times if listening in other windows
  // ref: https://stackoverflow.com/questions/35865481/storage-event-not-firing
  const event = new StorageEvent("storage", {
    key: k.ASSISTANT_GRIDA_AUTHENTICATION_CREDENTIAL_KEY,
    oldValue: null,
    newValue: credential,
  });
  window.dispatchEvent(event);
}

async function getAuthCredential(): Promise<Credential> {
  // usees localstorage
  return localStorage.getItem(k.ASSISTANT_GRIDA_AUTHENTICATION_CREDENTIAL_KEY);
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
