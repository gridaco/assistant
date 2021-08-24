import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";

function WebApp({ Component, pageProps }: AppProps) {
  // region GA
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  // endregion GA

  return <Component {...pageProps} />;
}
export default WebApp;
