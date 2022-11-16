import { RouteBackButton } from "app/lib/components/navigation/route-back-button";
import React from "react";
import { useNavigate } from "react-router";
export function ToolboxHome() {
  const navigate = useNavigate();
  return (
    <>
      <RouteBackButton />
      <button
        onClick={() => {
          navigate("/toolbox/font-replacer");
        }}
      >
        Font replacer
      </button>
      <br />
      <button
        onClick={() => {
          navigate("/toolbox/meta-editor");
        }}
      >
        Meta editor
      </button>
      <br />
      <button
        onClick={() => {
          navigate("/toolbox/batch-meta-editor");
        }}
      >
        Batch Meta editor
      </button>
      <br />
      <button
        onClick={() => {
          navigate("/toolbox/code-syntax-highlight");
        }}
      >
        Code syntax highlight
      </button>
    </>
  );
}
