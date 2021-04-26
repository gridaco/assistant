import React, { useState } from "react";
import * as FigmaApi from "figma-js";
import { Button, LinearProgress, TextField, Tooltip } from "@material-ui/core";
import { useSingleSelection } from "../../../utils/plugin-hooks";
import { parseFileIdFromUrl_Figma } from "./figma-api-utils";
import { PluginSdk } from "../../../utils/plugin-provider/plugin-app-sdk";
import { downloadFile } from "./export-utils";

function makeClient(token?: string): FigmaApi.ClientInterface {
  if (!token) {
    const maybePersonalAccessToken = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
    if (maybePersonalAccessToken) {
    } else {
      throw "no personal access token provided";
    }
    token = maybePersonalAccessToken;
  }

  return FigmaApi.Client({
    personalAccessToken: token,
  });
}

export async function fetchFile(id: string) {
  const client = makeClient();
  const _fileRes = await client.file(id);
  const file = _fileRes.data;
  return file;
}

async function fetchNode(fileId: string, ...nodeIds: string[]) {
  const client = makeClient();
  const _nodesRes = await client.fileNodes(fileId, {
    ids: nodeIds,
  });

  const nodes = _nodesRes.data.nodes;
  //   nodes[0].components[''].key
}

export function FigmaExporter() {
  const selection = useSingleSelection();
  const [computing, setComputing] = useState<boolean>(false);
  const [fileId, setFileId] = useState(undefined);
  const handleExportCurrentSelection = () => {
    fetchNode(fileId, selection.id).then((d) => {
      downloadFile(JSON.stringify(d, null, 4));
    });
  };

  const handleExportCurrentFile = () => {
    fetchFile(fileId).then((d) => {
      downloadFile(JSON.stringify(d, null, 4));
    });
  };

  const handleFileUrlUpdate = (e) => {
    const input = e.target.value;
    try {
      const id = parseFileIdFromUrl_Figma(input);
      setFileId(id);
    } catch (_) {
      PluginSdk.notify("url is invalid");
    }
  };

  return (
    <>
      <h4>Figma exporter</h4>
      <p>
        requirements: this feature is for bridged contributors, enabling them to
        export figma data for design to code development. You'll need to provide
        your own "FIGMA_PERSONAL_ACCESS_TOKEN" in figma/.env currently, figma
        plugin sdk does not allow us to retrieve file id, so you'll have to
        explicitly provide us the current figma file's id which is from file
        share link. copy-pase the whole url, we will automatically extract file
        id from it.
      </p>
      {computing ? (
        <>
          <LinearProgress />
        </>
      ) : (
        <>
          <TextField label="personal access token" disabled fullWidth />
          <TextField
            required
            disabled={fileId !== undefined}
            label="figma file share url"
            fullWidth
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                handleFileUrlUpdate(ev);
                ev.preventDefault();
              }
            }}
          />

          {fileId && (
            <>
              <Button
                disabled={selection == undefined}
                onClick={handleExportCurrentSelection}
              >
                export current selection
              </Button>
              <Button onClick={handleExportCurrentFile}>
                export current file
              </Button>
              <Button disabled>export current page</Button>
            </>
          )}
        </>
      )}
    </>
  );
}
