import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";

export function CodeboxEditDialog(props: {
  title: string;
  description: string;
  label: string;
  open: boolean;
  initialValue: string;
  handleClose: () => void;
  handleSave: (value: string) => void;
}) {
  let value = props.initialValue;
  return (
    <>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.description}</DialogContentText>
          <TextField
            autoFocus
            id="name"
            label={props.label}
            fullWidth
            multiline
            defaultValue={props.initialValue}
            onChange={(e) => {
              value = e.target.value;
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              props.handleSave(value);
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
