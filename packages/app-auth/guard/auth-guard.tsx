import React, { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import { SigninScreen } from "../signin/signin-screen";
import { useAssistantAuthState } from "../hooks";

export function AuthGuard({
  children,
  required,
}: React.PropsWithChildren<{
  required?: boolean;
}>) {
  const authenticated = useAssistantAuthState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    switch (authenticated) {
      case null:
        break;
      case false:
        setOpen(true);
        break;
      case true:
        break;
    }
  }, [authenticated]);

  return (
    <>
      {children}
      {required && (
        <Dialog open={open} fullScreen>
          <SigninScreen
            onSignin={() => {
              setOpen(false);
            }}
          />
        </Dialog>
      )}
    </>
  );
}
