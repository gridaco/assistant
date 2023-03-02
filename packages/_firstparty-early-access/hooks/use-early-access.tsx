import React, { useEffect, useState } from "react";
import store from "../store";

export function useEarlyAccess() {
  const [accesskey, setAccessKey] = useState<string | null>(null);
  useEffect(() => {
    store.get().then((d) => {
      if (d) {
        setAccessKey(d);
      }
    });
  }, []);

  return accesskey;
}
