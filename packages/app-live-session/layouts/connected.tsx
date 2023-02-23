import React, { useEffect, useState } from "react";
import { PluginSdk } from "@plugin-sdk/app";
import { hide_navigation } from "app/lib/main/global-state-atoms";
import { useSetRecoilState } from "recoil";
import { motion } from "framer-motion";
import { InteractiveIndicator } from "../components";
import styled from "@emotion/styled";

const animation_size = 12;

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
      // additional size safety - sometimes the saved size is invalid and smaller than last layout's size.
      // keep this value synced with `figma-core/code-thread/resize-screen.ts`
      const MIN_WIDTH = 320;
      const MIN_HEIGHT = 568;
      const w = Math.max(MIN_WIDTH, size.width);
      const h = Math.max(MIN_HEIGHT, size.height);
      PluginSdk.resizeHost({
        width: w,
        height: h,
      });
      // enable back resizing knob
      // ----

      // show the navigation again
      set_hide_navigation_state(false);
    };
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignSelf: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <InteractiveIndicator size={animation_size} />
        <p style={{ color: "#ACACAC", fontSize: animation_size }}>connected</p>
      </div>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          background: "rgba(0, 0, 0, 0.4)",
          alignSelf: "stretch",
          opacity: 0,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        whileHover={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3 },
        }}
      >
        <HoverStateView onClose={onClose} />
      </motion.div>
    </div>
  );
}

const HoverStateView = ({ onClose }: { onClose: () => void }) => {
  return <BackToMenuButton onClick={onClose}>Back to menu</BackToMenuButton>;
};

const BackToMenuButton = styled.button`
  color: white;
  border-radius: 4px;
  background: black;
  border: none;
  height: 24px;
  min-width: 100px;
  :hover {
    background: #2f2f2f;
  }
`;

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
