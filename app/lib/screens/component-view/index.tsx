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
import { Typography } from "@material-ui/core";
import { ASSISTANT_PLUGIN_NAMESPACE } from "../../constants";

interface VisualComponentManifest {
  name: string;
  descripton: string;
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

  // load test code
  // PluginSdk.fetchMetadata()
  const testCode = `
import { Progress } from 'antd';

ReactDOM.render(
  <>
    <Progress type="circle" percent={75} />
    <Progress type="circle" percent={70} status="exception" />
    <Progress type="circle" percent={100} />
  </>,
  mountNode,
);
`;

  const [dopened, setdOpen] = React.useState(false);

  const handleClickOpen = () => {
    setdOpen(true);
  };

  const handleClose = () => {
    setdOpen(false);
  };

  return (
    <>
      <Preview data={previewImage} name={"replace me"}></Preview>
      <p>component view placeholder</p>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Typography>name: {data?.name ?? "Not registered"}</Typography>
      <Typography>
        description: {data?.descripton ?? "No description"}
      </Typography>
      <EditableComponentMetaFieldSingleValueInputDialog
        label="storybook url"
        title="Set Data"
        description="set url for storybook for this component"
        open={dopened}
        handleClose={handleClose}
      />
      <Button
        disabled={data?.storybook == undefined}
        onClick={() => {
          open(`http://localhost:6006/?path=/${data?.storybook ?? ""}`);
        }}
      >
        storybook
      </Button>
      <Button
        disabled={data?.docsUrl == undefined}
        onClick={() => {
          data?.docsUrl && open(data.docsUrl);
        }}
      >
        docs
      </Button>
      <CodeBox
        language="tsx"
        code={data?.codeSnippet ?? "//no code snippet provided"}
      />
    </>
  );
}

function EditableComponentMetaFieldSingleValueInputDialog(props: {
  title: string;
  description: string;
  label: string;
  open: boolean;
  handleClose: () => void;
}) {
  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.description}</DialogContentText>
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
