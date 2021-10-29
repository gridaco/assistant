import { SelectionType, useSelection } from "plugin-app";
import React from "react";
import { useHistory } from "react-router";
import { AssistantLiveSession } from "../session-api";

const session = new AssistantLiveSession({
  uid: "",
  filekey: "",
});

export function LiveSessionPage() {
  const history = useHistory();
  const selection = useSelection();

  const startChecksumProcess = () => {
    //
    history.push("/checksum");
  };

  const connect = () => {
    session.enter();
    // trigger last selection
  };

  if (session.entered && selection) {
    switch (selection.type) {
      case SelectionType.single: {
        session.emmitSelect({
          event: "select",
          selectionType: selection.type,
          filekey: "", // TODO:
          node: selection.id,
        });
      }
    }
  }

  return (
    <>
      <button onClick={startChecksumProcess}>file cheksum</button>
      <button onClick={connect}>connect</button>
    </>
  );
}
