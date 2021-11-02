import React, { useEffect } from "react";
import { PluginSdk } from "@plugin-sdk/app";
import { hide_navigation } from "app/lib/main/global-state-atoms";
import { useSetRecoilState } from "recoil";

export function ConnectedStateMinimized({ onClose }: { onClose: () => void }) {
  const set_hide_navigation_state = useSetRecoilState(hide_navigation);

  useEffect(() => {
    // save the last host size
    saveSize();

    // minimize the window, disable the resizing knob
    PluginSdk.resizeHost({
      width: 212,
      height: 100,
    });
    // disable resizing knob
    // ----

    // hide the navigation
    set_hide_navigation_state(true);

    return () => {
      // restore size
      const size = loadSize() ?? { width: 300, height: 500 };
      PluginSdk.resizeHost({
        width: size.width,
        height: size.height,
      });
      // enable back resizing knob
      // ----

      // show the navigation again
      set_hide_navigation_state(false);
    };
  }, []);

  return <button onClick={onClose}>close</button>;
}

const saveSize = () => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  window.sessionStorage.setItem(
    "last-known-size",
    JSON.stringify({ width, height })
  );
};

const loadSize = () => {
  const size = window.sessionStorage.getItem("last-known-size");
  if (size) {
    const { width, height } = JSON.parse(size);
    return { width, height };
  }
};
