import React from "react";
import { FigmaFileChecksum } from "@platform-dedicated/figma-checksum";
import { Dialog } from "@material-ui/core";
import { PluginSdk } from "@plugin-sdk/app";
import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";

export function FilekeySetupRequiredLayout({
  onKeySetup,
}: {
  onKeySetup: (key: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const startChecksumProcess = () => {
    setOpen(true);
  };

  return (
    <>
      <button onClick={startChecksumProcess}>file cheksum</button>
      {
        <Dialog open={open} fullScreen>
          <FigmaFileChecksum
            mode="only-url-scheme"
            onVerify={(valid, filekey) => {
              if (valid) {
                // save filekey
                saveFilekey(filekey)
                  .then(() => {
                    onKeySetup(filekey);
                  })
                  .finally(() => {
                    // close dialog
                    setOpen(false);
                  });
              } else {
                // this can't happen on `"only-url-scheme"`
                // show error
                // close dialog
                setOpen(false);
              }
            }}
            onClose={() => {
              setOpen(false);
            }}
          />
        </Dialog>
      }
    </>
  );
}

export const saveFilekey = async (filekey: string) => {
  return PluginSdk.updateMetadata({
    type: "node-meta-update-request",
    id: "0:0", // 0:0 stands for root node
    key: "filekey",
    value: filekey,
    namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
  });
};

export const loadFilekey = async (): Promise<string> => {
  return await PluginSdk.fetchRootMetadata("filekey");
};
