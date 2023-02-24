import React, { useState, useEffect } from "react";
import { SelectionType, useSelection } from "plugin-app";
import { AssistantLiveSession } from "../session-api";
import {
  ConnectedStateMinimized,
  FilekeySetupRequiredLayout,
  OnboardingLayout,
  SigninRequiredLayout,
  StartLayout,
} from "../layouts";
import { isAuthenticated, getUserProfile } from "@assistant-fp/auth";
import { needToShowOnboarding, setOnboardingShown } from "../storage";
import LinearProgress from "@material-ui/core/LinearProgress";
import { RevealWhenVisible } from "app/lib/components/animated";
import { loadFilekey } from "@platform-dedicated/figma-checksum";

const FILE_KEY_NON_SET_SPECIAL_KEY = "non-set";

export function LiveSessionPage() {
  const [authenticated, setAuthenticated] = useState<boolean>(null);
  const [uid, setUid] = useState<string>(null);
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
      getUserProfile()
        .then((p) => {
          const uid = p.id;
          setUid(uid);
        })
        .catch(() => {
          // connection problem or token expired
          setAuthenticated(false);
        });
    });

    // load filekey
    loadFilekey().then((v) => {
      if (v) {
        setFilekey(v);
      } else {
        setFilekey(FILE_KEY_NON_SET_SPECIAL_KEY);
      }
    });
  }, []);

  useEffect(() => {
    if (!session && filekey && authenticated && uid) {
      setSession(
        new AssistantLiveSession({
          uid: uid,
          filekey: filekey,
        })
      );
    }
  }, [filekey, authenticated, uid]);

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
          session.select({
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
          {session ? (
            <RevealWhenVisible>
              <StartLayout
                onStartClick={() => {
                  connect();
                }}
              />
            </RevealWhenVisible>
          ) : (
            // Don't display anything. this state won't last long.
            <>
              <LinearProgress variant="indeterminate" />
            </>
          )}
        </>
      )}
    </>
  );
}
