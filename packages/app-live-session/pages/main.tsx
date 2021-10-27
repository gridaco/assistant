import React from "react";
import { useHistory } from "react-router";
export function LiveSessionPage() {
  const history = useHistory();

  const startChecksumProcess = () => {
    //
    history.push("/checksum");
  };

  return <button onClick={startChecksumProcess}>file cheksum</button>;
}
