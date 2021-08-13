import React from "react";
import { SecondaryWorkmodeChoice } from "./secondary-workmode-choice";
export function SecondaryWorkmodeMenu(props: {
  menus: {
    id: string;
    name: string;
    disabled?: boolean;
  }[];
  onSelect: () => void;
}) {
  return (
    <>
      {props.menus.map((menu) => {
        return (
          <SecondaryWorkmodeChoice
            key={menu.id}
            name={menu.name}
            disabled={menu.disabled}
            onClick={props.onSelect}
          />
        );
      })}
    </>
  );
}
