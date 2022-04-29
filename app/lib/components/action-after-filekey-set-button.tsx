import React, { useState, useEffect } from "react";
import { PluginSdk } from "@plugin-sdk/app";
import { Dialog } from "@material-ui/core";
import {
  FigmaFileChecksum,
  loadFilekey,
  saveFilekey,
} from "@platform-dedicated/figma-checksum";
/**
 * A button that performs action after the filekey set process.
 */
export function ActionAfterFilekeySetButton(props: {
  disabled?: boolean;
  scene?: { id: string };
  framework?: string;
  app?: any;
  button: TOpenButton;
  beforeNext?: () => Promise<boolean>;
  onNext: (filekey: string) => void;
}) {
  const [filekey, setFilekey] = useState<string>(null);
  const [openFilekeysetPrompt, setOpenFilekeysetPrompt] = useState(false);

  useEffect(() => {
    loadFilekey().then(setFilekey);
  }, []);

  const isFilekeySet = filekey !== null;

  const onNextClick = async () => {
    if (props.beforeNext && !(await props.beforeNext())) {
      // only perform before logic if provided.
      return;
    }

    if (!isFilekeySet) {
      PluginSdk.notify("Let's setup the filekey first");
      setOpenFilekeysetPrompt(true);
      return;
    }

    props.onNext(filekey);
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
      {React.cloneElement(props.button, {
        disabled: props.disabled,
        onClick: onNextClick,
      })}
    </>
  );
}

export type TOpenButton = React.ReactElement<{
  disabled?: boolean;
  onClick: () => void;
}>;
