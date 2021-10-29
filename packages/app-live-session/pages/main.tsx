import { useSelection } from "plugin-app";
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
    session.emmitSelect();
  }

  return (
    <>
      <button onClick={startChecksumProcess}>file cheksum</button>
      <button onClick={connect}>connect</button>
    </>
  );
}
