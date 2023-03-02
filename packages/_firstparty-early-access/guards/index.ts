import { useEarlyAccess } from "@assistant-fp/early-access";
import { useHistory } from "react-router-dom";
import { early_access_required_message } from "../k";

export function requiresEarlyAccess<T extends Function>(f: T): T {
  const history = useHistory();
  const ea = useEarlyAccess();

  if (!ea) {
    return ((...args) => {
      alert(early_access_required_message);
      history.push("/upgrade");
    }) as any as T;
  } else {
    return f;
  }
}
