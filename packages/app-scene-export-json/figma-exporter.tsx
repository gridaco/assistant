import React, { useState } from "react";
import * as FigmaApi from "figma-js";
import { Button, LinearProgress, TextField, Tooltip } from "@material-ui/core";
import { useSingleSelection } from "plugin-app";
import { parseFileId } from "@design-sdk/figma-url";
import { PluginSdk } from "@plugin-sdk/app";
import { downloadFile } from "./export-utils";

const _maybetoken =
  process.env.FIGMA_PERSONAL_ACCESS_TOKEN ??
  process.env.NEXT_PUBLIC_FIGMA_PERSONAL_ACCESS_TOKEN;
function makeClient(token?: string): FigmaApi.ClientInterface {
  if (!token) {
    if (_maybetoken) {
    } else {
      throw "no personal access token provided";
    }
    token = _maybetoken;
  }

  return FigmaApi.Client({
    personalAccessToken: token,
  });
}

export async function fetchFile(
  id: string,
  opt?: {
    token?: string;
  }
) {
  const client = makeClient(opt?.token);
  const _fileRes = await client.file(id);
  const file = _fileRes.data;
  return file;
}

async function fetchNode(
  fileId: string,
  nodeIds: string[],
  opt?: {
    token?: string;
  }
) {
  const client = makeClient(opt?.token);
  const _nodesRes = await client.fileNodes(fileId, {
    ids: nodeIds,
  });
  return _nodesRes.data.nodes;
}

export function FigmaExporter() {
  const selection = useSingleSelection();
  const [personalToken, setPersonalToken] = useState(_maybetoken);
  const [computing, setComputing] = useState<boolean>(false);
  const [fileId, setFileId] = useState(undefined);
  const handleExportCurrentSelection = () => {
    setComputing(true);
    fetchNode(fileId, [selection.id], {
      token: personalToken,
    }).then((d) => {
      downloadFile(JSON.stringify(d, null, 4));
      setComputing(false);
    });
  };

  const handleExportCurrentFile = () => {
    setComputing(true);
    fetchFile(fileId, {
      token: personalToken,
    }).then((d) => {
      downloadFile(JSON.stringify(d, null, 4));
      setComputing(false);
    });
  };

  const handleFileUrlUpdate = (e) => {
    const input = e.target.value;
    try {
      const id = parseFileId(input);
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
          <TextField
            label="personal access token"
            fullWidth
            type="password"
            defaultValue={personalToken}
            onChange={(e) => {
              setPersonalToken(e.target.value);
            }}
          />
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
