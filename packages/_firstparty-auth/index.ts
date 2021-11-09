import { cors, __HOSTS } from "@base-sdk/core";
import {
  __auth_proxy,
  ProxyAuthenticationMode,
  AuthProxySessionStartRequest,
  AuthProxySessionStartResult,
} from "@base-sdk-fp/auth";
import { client_id } from "plugin-app";
import { AuthStorage } from "./storage";
import Axios from "axios";

const PROXY_AUTH_REQUEST_SECRET =
  process.env.GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET ??
  process.env.NEXT_PUBLIC_GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET;

// pre configuration - this is required
__auth_proxy.api.preconfigure({
  useRetry: true,
  useCors: {
    apiKey: process.env.NEXT_PUBLIC_CORS_GRIDA_API_KEY,
  },
});

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

  AuthStorage.save(result.access_token);
  // save result

  return result;
}

export async function startAuthentication() {
  const session = await startAuthenticationSession();
  return await startAuthenticationWithSession(session);
}

export async function isAuthenticated() {
  return (await AuthStorage.get())?.length > 1; // using 1 (same as != undefined.)
}

export async function getAccessToken(): Promise<string> {
  return await AuthStorage.get();
}

export async function checkAuthSession(session: string): Promise<boolean> {
  // TODO:
  const res = await __auth_proxy.checkProxyAuthResult(
    PROXY_AUTH_REQUEST_SECRET,
    session
  );

  const success = res.success && res.access_token !== undefined;
  if (success) {
    AuthStorage.save(res.access_token);
  }
  return success;
}

const secure_axios = async () => {
  const axios = Axios.create({
    baseURL: "https://accounts.services.grida.co",
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  cors.useAxiosCors(axios, {
    apikey: process.env.NEXT_PUBLIC_CORS_GRIDA_API_KEY,
  });
  return axios;
};

export async function getUserProfile() {
  try {
    const resp = await (await secure_axios()).get(`profile`);
    return resp.data;
  } catch (error) {
    console.log("Error while fetching my profile ", error);
    throw error;
  }
}
