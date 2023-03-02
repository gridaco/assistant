import React from "react";
import styled from "@emotion/styled";
import { PluginSdk } from "@plugin-sdk/app";
import { RouteBackButton } from "app/lib/components/navigation/route-back-button";
import { useHistory } from "react-router";

export function ToolboxHome() {
  const history = useHistory();
  return (
    <>
      <div style={{ margin: 16 }}>
        <RouteBackButton />
      </div>
      <Layout>
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
        <ClearPluginSDKItem />
      </Layout>
    </>
  );
}

function ClearPluginSDKItem() {
  const [key, setKey] = React.useState("");
  return (
    <div className="tool">
      <input
        id="key"
        placeholder="Plugin SDK Store"
        onChange={(e) => setKey(e.target.value)}
      />
      <button
        onClick={() => {
          PluginSdk.setItem(key, null);
          alert(`Cleared ${key} from store`);
        }}
        type="submit"
      >
        Clear Item
      </button>
    </div>
  );
}

const Layout = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;

  .tool {
    flex: 1;
    margin: 16px 0;
    display: flex;
    gap: 4px;
    flex-direction: row;
  }

  input {
    flex: 1;
  }

  button {
    cursor: pointer;
    border-radius: 4px;
    padding: 4px 8px;
    border: none;
    outline: none;
    background: black;
    color: white;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 1;
    }
  }
`;
