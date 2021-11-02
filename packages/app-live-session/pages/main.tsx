import React, { useState, useEffect } from "react";
import { SelectionType, useSelection } from "plugin-app";
import { AssistantLiveSession } from "../session-api";
import {
  ConnectedStateMinimized,
  FilekeySetupRequiredLayout,
  loadFilekey,
  OnboardingLayout,
  SigninRequiredLayout,
  StartLayout,
} from "../layouts";
import { isAuthenticated } from "@assistant-fp/auth";
import { needToShowOnboarding, setOnboardingShown } from "../storage";

const FILE_KEY_NON_SET_SPECIAL_KEY = "non-set";

export function LiveSessionPage() {
  const [authenticated, setAuthenticated] = useState<boolean>(null);
  const [filekey, setFilekey] = useState<string>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [session, setSession] = useState<AssistantLiveSession | null>(null);
  const selection = useSelection();
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    needToShowOnboarding()
  );
  useEffect(() => {
    isAuthenticated().then((v) => {
      setAuthenticated(v);
    });

    // load filekey
    loadFilekey().then((v) => {
      console.log("filekey loaded", v);
      if (v) {
        setFilekey(v);
      } else {
        setFilekey(FILE_KEY_NON_SET_SPECIAL_KEY);
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
            filekey: filekey,
            node: selection.id,
          });
        }
      }
    }
  }, [selection, focused, session]);

  if (showOnboarding) {
    return (
      <OnboardingLayout
        onPrimaryActionclick={() => {
          setOnboardingShown(); // save data
          setShowOnboarding(false);
        }}
      />
    );
  }

  if (authenticated === false) {
    return (
      <SigninRequiredLayout
        onSignin={() => {
          setAuthenticated(true);
        }}
      />
    );
  }

  if (filekey === FILE_KEY_NON_SET_SPECIAL_KEY) {
    return <FilekeySetupRequiredLayout onKeySetup={setFilekey} />;
  }

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
          {authenticated && filekey ? (
            <StartLayout
              onStartClick={() => {
                connect();
              }}
            />
          ) : (
            // Don't display anything. this state won't last long.
            <></>
          )}
        </>
      )}
    </>
  );
}
