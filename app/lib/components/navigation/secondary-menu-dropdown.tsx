import React from "react";
import { useHistory } from "react-router-dom";
import { WorkMode, WorkScreen } from "../../routing";
import { SecondaryWorkmodeMenu } from "./secondary-workmode-menu";

type Stage = "production" | "development" | string;
interface Menu {
  id: WorkMode | WorkScreen | string;
  name: string;
  stage: Stage;
  onSelect: () => void;
}

export function signinOrLibraryMenu(): Menu {
  const history = useHistory();
  return {
    id: WorkScreen.signin,
    name: WorkScreen.signin,
    stage: "production",
    onSelect: () => {
      history.push("/signin");
    },
  };

  //
  // TODO: return library menu when signed in.
  return {
    id: WorkMode.library,
    name: WorkMode.library,
    stage: "development",
    onSelect: () => {},
  };
}

export function SecondaryMenuDropdown() {
  const history = useHistory();
  const menu: Menu[] = [
    signinOrLibraryMenu(),
    {
      id: WorkMode.asset,
      name: WorkMode.asset,
      stage: "development",
      onSelect: () => {},
    },
    {
      id: WorkMode.manage,
      name: WorkMode.manage,
      stage: "development",
      onSelect: () => {},
    },
    {
      id: WorkMode.tools,
      name: WorkMode.tools,
      stage: "development",
      onSelect: () => {
        history.push("/toolbox/home");
      },
    },
    // {
    //   id: WorkMode.settings,
    //   name: WorkMode.settings,
    //   stage: "development",
    //   onSelect: () => {},
    // },
    {
      id: "feedback-toggle",
      name: "Feedback",
      stage: "production",
      onSelect: () => {
        open("https://github.com/gridaco/assistant/issues/new/choose");
      },
    },
    {
      id: WorkMode.about,
      name: WorkMode.about,
      stage: "production",
      onSelect: () => {
        history.push("/about");
      },
    },
    {
      id: "upgrade",
      name: "Upgrade",
      stage: "production",
      onSelect: () => {
        history.push("/upgrade");
      },
    },
  ].filter((m) => {
    if (process.env.NODE_ENV == "production") {
      return m.stage === "production";
    }
    return true; /** if not production, return all available menus */
  });

  return (
    <SecondaryWorkmodeMenu<WorkMode | WorkScreen | string>
      menus={menu}
      onSelect={(id) => {
        menu.find((m) => m.id === id)?.onSelect();
      }}
    />
  );
}
