import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { BlueButtonStyle } from "@ui/core/button-style";
import { PluginSdk } from "@plugin-sdk/app";
import type { IReflectNodeReference } from "@design-sdk/figma-node";
import { isAuthenticated } from "@assistant-fp/auth";
import { useHistory } from "react-router-dom";
import { Dialog } from "@material-ui/core";
import {
  FigmaFileChecksum,
  loadFilekey,
  saveFilekey,
} from "@platform-dedicated/figma-checksum";
/**
 * Open in editor button to open the selection on the grida web editor : currently https://code.grida.co/files/:filekey/:id
 */
export function OpenInEditorButton(props: {
  disabled?: boolean;
  scene?: IReflectNodeReference;
  framework?: string;
  app?: any;
}) {
  const history = useHistory();
  const [filekey, setFilekey] = useState<string>(null);
  const [openFilekeysetPrompt, setOpenFilekeysetPrompt] = useState(false);

  useEffect(() => {
    loadFilekey().then(setFilekey);
  }, []);

  const isFilekeySet = filekey !== null;

  const onNextClick = async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      PluginSdk.notify("Let's Sign in first");
      history.push("/signin");
      return;
    }

    if (!isFilekeySet) {
      PluginSdk.notify("Let's setup the filekey first");
      setOpenFilekeysetPrompt(true);
      return;
    }

    // if authenticated and the filekey for this file is provided, we can procceed to next step finally. ;)

    // ..
    open(
      buildOpenUrlForEditor({
        filekey: filekey,
        id: props.scene.id,
        framework: props.framework,
      })
    );
    // ..
  };

  return (
    <>
      <Dialog open={openFilekeysetPrompt} fullScreen>
        <FigmaFileChecksum
          mode="only-url-scheme"
          onVerify={(valid, filekey) => {
            if (valid) {
              // save filekey
              saveFilekey(filekey)
                .then(() => {
                  setFilekey(filekey);
                })
                .finally(() => {
                  // close dialog
                  setOpenFilekeysetPrompt(false);
                });
            } else {
              setOpenFilekeysetPrompt(false);
            }
          }}
          onClose={() => {
            setOpenFilekeysetPrompt(false);
            onNextClick();
          }}
        />
      </Dialog>
      <OpenButton disabled={props.disabled} onClick={onNextClick}>
        Open
      </OpenButton>
    </>
  );
}

function buildOpenUrlForEditor({
  filekey,
  id,
  framework,
}: {
  filekey: string;
  id: string;
  framework: string;
}) {
  // https://staging-branch-code.grida.co/files/~
  // https://code.grida.co/files/~
  return `https://staging-branch-code.grida.co/files/${filekey}?node=${id}&framework=${framework}`;
}

const OpenButton = styled.button`
  ${BlueButtonStyle}
  min-width: 60%;
`;
