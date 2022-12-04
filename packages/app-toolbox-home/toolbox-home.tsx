import { RouteBackButton } from "app/lib/components/navigation/route-back-button";
import React from "react";
import { useHistory } from "react-router";
export function ToolboxHome() {
  const history = useHistory();
  return (
    <>
      <RouteBackButton />
      <button
        onClick={() => {
          history.push("/toolbox/font-replacer");
        }}
      >
        Font replacer
      </button>
      <br />
      <button
        onClick={() => {
          history.push("/toolbox/meta-editor");
        }}
      >
        Meta editor
      </button>
      <br />
      <button
        onClick={() => {
          history.push("/toolbox/batch-meta-editor");
        }}
      >
        Batch Meta editor
      </button>
      <br />
      <button
        onClick={() => {
          history.push("/toolbox/code-syntax-highlight");
        }}
      >
        Code syntax highlight
      </button>
    </>
  );
}
