import React from "react";
import { useHistory } from "react-router-dom";
import { WorkMode, WorkScreen } from "../../navigation";
import { SecondaryWorkmodeMenu } from "./secondary-workmode-menu";

export function SecondaryMenuDropdown() {
  const history = useHistory();
  const menu = [
    {
      id: WorkScreen.signin,
      name: WorkScreen.signin,
      stage: "production",
      onSelect: () => {
        history.push("/signin");
      },
    },
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
      onSelect: () => {},
    },
    {
      id: WorkMode.library,
      name: WorkMode.library,
      stage: "development",
      onSelect: () => {},
    },
    {
      id: WorkMode.settings,
      name: WorkMode.settings,
      stage: "development",
      onSelect: () => {},
    },
    {
      id: WorkMode.about,
      name: WorkMode.about,
      stage: "production",
      onSelect: () => {
        history.push("/about");
      },
    },
  ].filter((m) => {
    if (process.env.NODE_ENV == "production") {
      return m.stage === "production";
    }
    return true; /** if not production, return all available menus */
  });
  return (
    <SecondaryWorkmodeMenu<WorkMode | WorkScreen>
      menus={menu}
      onSelect={(id) => {
        menu.find((m) => m.id === id)?.onSelect();
      }}
    />
  );
}
