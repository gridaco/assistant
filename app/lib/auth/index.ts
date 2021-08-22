import { __HOSTS } from "@base-sdk/core";
import { __auth_proxy, ProxyAuthenticationMode } from "@base-sdk-fp/auth";
import { PluginSdk } from "@plugin-sdk/app";
//#region export
export * from "./storage";
//#endregion export

const PROXY_AUTH_REQUEST_SECRET =
  process.env.GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET ??
  process.env.NEXT_PUBLIC_GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET;

export async function startAuthentication() {
  const request = await __auth_proxy.requesetProxyAuth(
    PROXY_AUTH_REQUEST_SECRET,
    {
      appId: "co.grida.assistant",
      clientId: "", // todo
      mode: ProxyAuthenticationMode.long_polling,
    },
    {
      autoOpen: true,
      openner: PluginSdk.openUri,
    }
  );

  // todo - build full url using method in base sdk
  // PluginSdk.openUri(__HOSTS.INTERNAL_SECURE_ACCOUNTS_SERVICE_HOST);
}
