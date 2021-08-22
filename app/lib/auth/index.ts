import { __HOSTS } from "@base-sdk/core";
import {
  __auth_proxy,
  ProxyAuthenticationMode,
  AuthProxySessionStartRequest,
  AuthProxySessionStartResult,
} from "@base-sdk-fp/auth";
import { client_id } from "plugin-app";

//#region export
export * from "./storage";
//#endregion export

const PROXY_AUTH_REQUEST_SECRET =
  process.env.GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET ??
  process.env.NEXT_PUBLIC_GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET;

function _make_request(): AuthProxySessionStartRequest {
  return {
    appId: "co.grida.assistant",
    clientId: client_id,
    mode: ProxyAuthenticationMode.long_polling,
    redirect_uri: "figma://", // TODO: change this scheme based on target platform.
  };
}

export async function startAuthenticationSession(): Promise<AuthProxySessionStartResult> {
  return __auth_proxy.openProxyAuthSession(
    PROXY_AUTH_REQUEST_SECRET,
    _make_request()
  );
}

export async function startAuthenticationWithSession(
  session: AuthProxySessionStartResult
) {
  const result = await __auth_proxy.requesetProxyAuthWithSession(
    PROXY_AUTH_REQUEST_SECRET,
    session,
    _make_request()
  );
  return result;
}

export async function startAuthentication() {
  const session = await startAuthenticationSession();
  return await startAuthenticationWithSession(session);
}

export async function checkAuthSession() {
  // TODO:
}
