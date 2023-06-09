import { useState, useEffect } from "react";
import { AuthStorage, k } from "@assistant-fp/auth";

export function useAssistantAuthState() {
  const [state, setState] = useState<boolean>(null);

  const validate = (token: string) => {
    // ping
    // TODO: send auth ping
    if (token) {
      setState(true);
    } else {
      setState(false);
    }
  };

  useEffect(() => {
    // check initial state
    AuthStorage.get().then(validate);

    const listener = (e: StorageEvent) => {
      if (e.key === k.ASSISTANT_GRIDA_AUTHENTICATION_CREDENTIAL_KEY) {
        validate(e.newValue);
      }
    };

    // listen for storage events
    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, []);

  return state;
}
