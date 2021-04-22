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
import { PluginSdk } from "@bridged.xyz/plugin-sdk-react";
import { Divider, IconButton, Typography } from "@material-ui/core";
import { ASSISTANT_PLUGIN_NAMESPACE } from "@bridged.xyz/plugin-sdk-react/events";
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
          console.log(`component-meta-data is`, d);
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

  function updateData(key: string, value: string) {
    const newData = {
      ...data,
      [key]: value,
    };
    setData(newData);

    PluginSdk.updateMainComponentMetadata({
      id: selectednode,
      namespace: ASSISTANT_PLUGIN_NAMESPACE,
      key: "component-meta-data",
      value: newData,
    });
  }

  return (
    <div>
      <Preview auto />
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
