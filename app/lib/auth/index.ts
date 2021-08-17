import { __HOSTS } from "@base-sdk/core";
import { __auth_proxy, ProxyAuthenticationMode } from "@base-sdk-fp/auth";

//#region export
export * from "./storage";
//#endregion export

const PROXY_AUTH_REQUEST_SECRET =
  process.env.GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET ??
  process.env.REACT_APP_GRIDA_FIRST_PARTY_PROXY_AUTH_REQUEST_TOTP_SECRET; // for CRA

export async function startAuthentication() {
  console.log("PROXY_AUTH_REQUEST_SECRET", PROXY_AUTH_REQUEST_SECRET);
  const request = await __auth_proxy.requesetProxyAuth(
    PROXY_AUTH_REQUEST_SECRET,
    {
      appId: "co.grida.assistant",
      clientId: "", // todo
      mode: ProxyAuthenticationMode.ws,
    },
    {
      autoOpen: true,
    }
  );

  // todo - build full url using method in base sdk
  open(__HOSTS.INTERNAL_SECURE_ACCOUNTS_SERVICE_HOST);
}
