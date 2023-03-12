import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import * as snippet from "@segment/snippet";
import * as gtag from "../lib/gtag";

function WebApp({ Component, pageProps }: AppProps) {
  const loadSegment = () => {
    const options = {
      apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    };
    if (process.env.NEXT_PUBLIC_NODE_ENV) {
      return snippet.max(options);
    } else {
      return snippet.min(options);
    }
  };

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

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: loadSegment() }}
        id="segment-snippet"
      />
      <Component {...pageProps} />;
    </>
  );
}
export default WebApp;
