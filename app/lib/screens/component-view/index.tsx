import React, { useEffect, useState } from "react";
import { Preview } from "../../components/preview";
import Button from "@material-ui/core/Button";
import CodeBox from "../../components/codebox";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import { PluginSdk } from "../../utils/plugin-provider/plugin-app-sdk";
import { Divider, IconButton, Typography } from "@material-ui/core";
import { ASSISTANT_PLUGIN_NAMESPACE } from "../../constants";
import { Edit, Settings } from "@material-ui/icons";
import { CodeboxEditDialog } from "../../components/codebox-edit-dialog";

interface VisualComponentManifest {
  name: string;
  description: string;
  storybook: string;
  docsUrl: string;
  gitUrl: string;
  codeSnippet: string;
}

export default function ComponentViewScreen() {
  const [data, setData] = useState<VisualComponentManifest>(undefined);
  // 1. get selected layer
  const [selectednode, setselectednode] = useState<string>(undefined);
  useEffect(() => {
    window.addEventListener("message", (ev) => {
      const message = ev.data.pluginMessage;
      if (message?.type == "selectionchange") {
        const node = message.data;
        const nodeId = node.id;
        setselectednode(nodeId);
        console.log("ComponentViewScreen's target node id", nodeId);

        // 3. find if data to display exists on a master component.
        PluginSdk.fetchMainComponentMetadata({
          id: nodeId,
          namespace: ASSISTANT_PLUGIN_NAMESPACE,
          key: "component-meta-data",
        }).then((d) => {
          setData(d);
        });
      }
    });
  }, []);
  // 2. check if selected layer is a component or an instance.
  // TODO

  // 4. display data if exists. else, display input.

  // TODO load image data from iframe message
  const [previewImage, setPreviewImage] = useState(undefined);

  return (
    <>
      <Preview data={previewImage} name={"replace me"}></Preview>
      <p>component view placeholder</p>
      <EditableComponentMetaFieldSingleValueDisplay
        name={"name"}
        value={data?.name ?? "Not registered"}
        handleSave={() => {}}
      />
      <EditableComponentMetaFieldSingleValueDisplay
        name={"description"}
        value={data?.description ?? "Not registered"}
        handleSave={() => {}}
      />
      <EditableComponentMetaFieldSingleValueDisplay
        name={"storybook"}
        button
        value={data?.storybook}
        handleSave={() => {}}
      />

      <EditableComponentMetaFieldSingleValueDisplay
        name={"documentation"}
        button
        value={data?.docsUrl}
        handleSave={() => {}}
      />

      <ComponentCodebox
        code={data?.codeSnippet}
        onCodeChange={(c) => {
          setData({
            ...data,
            codeSnippet: c,
          });

          PluginSdk.updateMetadata({
            id: selectednode,
            namespace: ASSISTANT_PLUGIN_NAMESPACE,
            key: "component-meta-data",
            value: data,
          });
        }}
      />
    </>
  );
}

function EditableComponentMetaFieldSingleValueDisplay(props: {
  name: string;
  value: string;
  button?: boolean;
  handleSave: (value: string) => void;
}) {
  const [dopen, setdOpen] = useState(false);
  return (
    <div>
      <div>
        <Typography variant="subtitle1" display="inline">
          {props.name}
        </Typography>
        <IconButton
          onClick={() => {
            setdOpen(true);
          }}
        >
          <Edit />
        </IconButton>
      </div>
      {props.button ? (
        <Button
          disabled={props.value == undefined}
          onClick={() => {
            props.value && open(props.value);
          }}
        >
          open
        </Button>
      ) : (
        <Typography variant="body2">
          {props.value ?? `No ${props.name}`}
        </Typography>
      )}

      <Divider style={{ marginTop: 12 }} />

      <EditableComponentMetaFieldSingleValueInputDialog
        title={`Update "${props.name}"`}
        label={`New "${props.name}"`}
        open={dopen}
        handleClose={() => {
          setdOpen(false);
        }}
      />
    </div>
  );
}

function EditableComponentMetaFieldSingleValueInputDialog(props: {
  title: string;
  description?: string;
  label: string;
  open: boolean;
  handleClose: () => void;
}) {
  return (
    <>
      <Dialog
        fullWidth
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          {props.description && (
            <DialogContentText>{props.description}</DialogContentText>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={props.label}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={props.handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ComponentCodebox(props: {
  onCodeChange: (code: string) => void;
  code: string;
}) {
  const [dopened, setdOpen] = React.useState(false);
  const [code, setCode] = React.useState(props.code);

  const handleClose = () => {
    setdOpen(false);
  };

  const handleEditCodeClick = () => {
    setdOpen(true);
  };
  return (
    <div>
      <CodeboxEditDialog
        initialValue={code}
        handleSave={(c) => {
          setCode(c);
          props.onCodeChange(c);
        }}
        label="code"
        title="override code"
        description="override the component code"
        open={dopened}
        handleClose={handleClose}
      />
      <CodeBox
        codeActions={[
          <IconButton onClick={handleEditCodeClick}>
            <Settings />
          </IconButton>,
        ]}
        language="tsx"
        code={code ?? "//no code snippet provided"}
      />
    </div>
  );
}
