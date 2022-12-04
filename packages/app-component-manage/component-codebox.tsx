import React from "react";
import { CodeBox, CodeboxEditDialog } from "@ui/codebox";
import Settings from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton/IconButton";

export function ComponentCodebox(props: {
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
