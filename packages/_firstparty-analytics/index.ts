import { assistant as analytics } from "@analytics.bridged.xyz/internal";

export function initialize() {
  if (process.env.NODE_ENV == "production") {
    // init & hit page view
    // we yet do not track client id, every session is anonymous.
    // const client_id = nanoid();
    // with proxy
    analytics.initWithProxy(
      process.env.BRIDGED_FIRST_PARTY_ANALYTICS_PROXY_SERVICE_TOTP_SECRET ??
        process.env
          .NEXT_PUBLIC_BRIDGED_FIRST_PARTY_ANALYTICS_PROXY_SERVICE_TOTP_SECRET
    );

    // Emmit login event to mock user. (since user authentication is optional to initially use assistant.)
    analytics.event({
      name: "login",
      params: {
        method: "anonymous",
      },
    });

    // TODO - chagne with current page
    analytics.event_page_view("code");
  } else {
    console.log(
      "[ASSITANT] using development build. ignoring analytics feature."
    );
  }
}
