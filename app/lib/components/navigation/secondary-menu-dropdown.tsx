import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return {
    id: WorkScreen.signin,
    name: WorkScreen.signin,
    stage: "production",
    onSelect: () => {
      navigate("/signin");
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
  const navigate = useNavigate();
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
        navigate("/toolbox/home");
      },
    },
    {
      id: WorkMode.settings,
      name: WorkMode.settings,
      stage: "development",
      onSelect: () => {},
    },
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
        navigate("/about");
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
