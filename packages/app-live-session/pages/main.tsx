import React, { useState, useEffect } from "react";
import { SelectionType, useSelection } from "plugin-app";
import { AssistantLiveSession } from "../session-api";
import {
  ConnectedStateMinimized,
  FilekeySetupRequiredLayout,
  loadFilekey,
} from "../layouts";
import { isAuthenticated } from "@assistant-fp/auth";

export function LiveSessionPage() {
  const [authenticated, setAuthenticated] = useState<boolean>(null);
  const [filekey, setFilekey] = useState<string>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [session, setSession] = useState<AssistantLiveSession | null>(null);
  const selection = useSelection();

  useEffect(() => {
    isAuthenticated().then((v) => {
      setAuthenticated(v);
    });

    // load filekey
    loadFilekey().then((v) => {
      console.log("filekey", v);
      if (v) {
        setFilekey(v);
      }
    });
  }, []);

  useEffect(() => {
    if (!session && filekey) {
      setSession(
        new AssistantLiveSession({
          uid: "", // TODO:
          filekey: filekey,
        })
      );
    }
  }, [filekey, authenticated]);

  const connect = () => {
    session.enter();

    session.entered
      ? setFocused(true)
      : session.onEnter(() => {
          setFocused(true);
        });
  };

  useEffect(() => {
    if (session && session.entered && selection) {
      switch (selection.type) {
        case SelectionType.single: {
          session.emmitSelect({
            event: "select",
            selectionType: selection.type,
            filekey: filekey, // TODO:
            node: selection.id,
          });
        }
      }
    }
  }, [selection, focused, session]);

  return (
    <>
      {focused ? (
        <ConnectedStateMinimized
          onClose={() => {
            setFocused(false);
          }}
        />
      ) : (
        <>
          {!filekey && <FilekeySetupRequiredLayout onKeySetup={setFilekey} />}
          {!session?.entered && <button onClick={connect}>connect</button>}
        </>
      )}
    </>
  );
}
