import React, { useState } from "react";
import { Preview } from "../../components/preview";
import Button from "@material-ui/core/Button";
import CodeBox from "../../components/codebox";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

export default function ComponentViewScreen() {
  // 1. get selected layer
  // 2. check if selected layer is a component or an instance.
  // 3. find if data to display exists on a master component.
  // 4. display data if exists. else, display input.

  // TODO load image data from iframe message
  const [previewImage, setPreviewImage] = useState(undefined);

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
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <EditableComponentMetaFieldSingleValueInputDialog
        label="storybook url"
        title="Set Data"
        description="set url for storybook for this component"
        open={dopened}
        handleClose={handleClose}
      />
      <Button
        onClick={() => {
          open("http://localhost:6006/?path=/docs/example-header--logged-out");
        }}
      >
        storybook
      </Button>
      <Button
        onClick={() => {
          open("https://ant.design/components/progress/#examples");
        }}
      >
        docs
      </Button>
      <CodeBox language="tsx" code={testCode} />
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
