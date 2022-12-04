import React, { useEffect, useState } from "react";
import { Preview } from "@ui/previewer";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import { PluginSdk } from "@plugin-sdk/app";
import { Divider, IconButton, Typography } from "@material-ui/core";
import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";
import { Edit, Settings } from "@material-ui/icons";
import { ComponentSchemaEditor } from "./schema-editor";
import { useSingleSelection, useMainComponentMeta } from "plugin-app";

interface VisualComponentManifest {
  name: string;
  description: string;
  storybook: string;
  docsUrl: string;
  gitUrl: string;
  codeSnippet: string;
}

export function ComponentViewScreen() {
  const selection = useSingleSelection();
  // const _data = useMainComponentMeta(selection.id);
  const [data, setData] = useState<VisualComponentManifest>(undefined);

  if (selection) {
    // 2. check if selected layer is a component or an instance.
    // TODO
    // 3. find if data to display exists on a master component.
  }

  // 4. display data if exists. else, display input.
  // TODO load image data from iframe message
  const [previewImage, setPreviewImage] = useState(undefined);

  function updateData(key: string, value: string) {
    const newData = {
      ...data,
      [key]: value,
    };
    setData(newData);

    PluginSdk.updateMainComponentMetadata({
      type: "node-meta-update-request",
      id: selection.id,
      namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
      key: "component-meta-data",
      value: newData,
    });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Preview type="static" auto />

      {/* {selection ? (
        <form key={JSON.stringify(data)}>
          <p>component view placeholder</p>
          <EditableComponentMetaFieldSingleValueDisplay
            name={"name"}
            value={data?.name}
            handleSave={(c) => {
              updateData("name", c);
            }}
          />
          <EditableComponentMetaFieldSingleValueDisplay
            name={"description"}
            value={data?.description}
            handleSave={(c) => {
              updateData("description", c);
            }}
          />
          <EditableComponentMetaFieldSingleValueDisplay
            name={"storybook"}
            button
            value={data?.storybook}
            handleSave={(c) => {
              updateData("storybook", c);
            }}
          />
          <EditableComponentMetaFieldSingleValueDisplay
            name={"documentation"}
            button
            value={data?.docsUrl}
            handleSave={(c) => {
              updateData("docsUrl", c);
            }}
          />

          <ComponentCodebox
            code={data?.codeSnippet}
            onCodeChange={(c) => {
              updateData("codeSnippet", c);
            }}
          />
        </form>
      ) : (
        <></>
      )} */}
      <div
        style={{
          flex: 1,
        }}
      >
        <ComponentSchemaEditor />
      </div>
    </div>
  );
}

function EditableComponentMetaFieldSingleValueDisplay(props: {
  name: string;
  value: string;
  button?: boolean;
  handleSave: (value: string) => void;
}) {
  const [dopen, setdOpen] = useState(false);
  const [value, setValue] = useState(props.value);
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
          disabled={value == undefined}
          onClick={() => {
            value && open(value);
          }}
        >
          open
        </Button>
      ) : (
        <Typography variant="body2">{value ?? `No ${props.name}`}</Typography>
      )}

      <Divider style={{ marginTop: 12 }} />

      <EditableComponentMetaFieldSingleValueInputDialog
        title={`Update "${props.name}"`}
        label={`New "${props.name}"`}
        open={dopen}
        initialValue={value}
        handleSave={(c) => {
          setValue(c);
          props.handleSave(c);
        }}
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
  initialValue: string;
  handleSave: (value: string) => void;
  handleClose: () => void;
}) {
  let content;
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
            defaultValue={props.initialValue}
            margin="dense"
            id="name"
            label={props.label}
            fullWidth
            onChange={(e) => {
              content = e.target.value;
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              props.handleSave(content);
              props.handleClose();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
