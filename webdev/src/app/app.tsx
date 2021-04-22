import React from "react";
import { EmbedApp } from "embed-app";
import { MockWorkspace } from "mock-workspace";

export function App() {
  return (
    <>
      <MockWorkspace />
      <EmbedApp />
    </>
  );
}
