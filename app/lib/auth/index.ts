import {
  __auth_proxy,
  ProxyAuthenticationMode,
} from "@base-sdk/auth-first-party";
import { __HOSTS } from "@base-sdk/core";

const PROXY_AUTH_REQUEST_SECRET =
  process.env.BRIDGED_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET;

export async function startAuthentication() {
  const request = await __auth_proxy.requesetProxyAuth({
    mode: ProxyAuthenticationMode.ws,
    secret: PROXY_AUTH_REQUEST_SECRET,
  });

  // todo - build full url using method in base sdk
  open(__HOSTS.INTERNAL_SECURE_ACCOUNTS_SERVICE_HOST);
}
