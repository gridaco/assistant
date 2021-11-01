import React, { useState } from "react";
import { SelectionType, useSelection } from "plugin-app";
import { useHistory } from "react-router";
import { AssistantLiveSession } from "../session-api";
import { ConnectedStateMinimized } from "../layouts";

const session = new AssistantLiveSession({
  uid: "",
  filekey: "",
});

export function LiveSessionPage() {
  const [connected, setConnected] = useState<boolean>(false);
  const history = useHistory();
  const selection = useSelection();

  const startChecksumProcess = () => {
    //
    history.push("/checksum");
  };

  const connect = () => {
    session.enter();
    session.onEnter(() => {
      setConnected(true);
    });
    // trigger last selection
    // move to connected page
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
      {connected ? (
        <ConnectedStateMinimized />
      ) : (
        <>
          <button onClick={startChecksumProcess}>file cheksum</button>
          <button onClick={connect}>connect</button>
        </>
      )}
    </>
  );
}
