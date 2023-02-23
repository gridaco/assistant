import React from "react";
import { PluginSdk } from "@plugin-sdk/app";
import { isAuthenticated } from "@assistant-fp/auth";
import { useHistory } from "react-router-dom";
import {
  ActionAfterFilekeySetButton,
  TOpenButton,
} from "./action-after-filekey-set-button";

/**
 * Open in editor button to open the selection on the grida web editor : currently https://code.grida.co/files/:filekey/:id
 */
export function OpenInEditorButton(props: {
  disabled?: boolean;
  scene?: { id: string };
  framework?: string;
  app?: any;
  button: TOpenButton;
}) {
  const history = useHistory();

  const onBeforeNext = async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      PluginSdk.notify("Let's Sign in first");
      history.push("/signin");
      return false;
    }
    return true;
  };

  const onNext = (filekey: string) => {
    // if authenticated and the filekey for this file is provided, we can procceed to next step finally. ;)
    // ..
    open(
      buildOpenUrlForEditor({
        filekey: filekey,
        id: props?.scene?.id,
        framework: props?.framework,
      })
    );
    // ..
  };

  return (
    <>
      <ActionAfterFilekeySetButton
        {...props}
        onNext={onNext}
        beforeNext={onBeforeNext}
      />
    </>
  );
}

function buildOpenUrlForEditor({
  filekey,
  id,
  framework,
}: {
  filekey: string;
  id?: string;
  framework?: string;
}) {
  // local: http://localhost:6626/files/~
  // staging: https://staging-branch-code.grida.co/files/~
  // production: https://code.grida.co/files/~
  // &mode=isolate

  // query params - do not provide optional query param if not provided.
  // - filekey (path)
  // - node (optional)
  // - framework (optional)
  // - mode (optional)

  const queryParams = {};

  if (id) {
    queryParams["node"] = id;
    queryParams["mode"] = "isolate";
  }

  if (framework) {
    queryParams["framework"] = framework;
  }

  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");

  return `https://code.grida.co/files/${filekey}?${queryString}`;
}
