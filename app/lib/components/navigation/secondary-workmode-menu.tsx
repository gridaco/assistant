import styled from "@emotion/styled";
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
    <Wrapper>
      {props.menus.map((menu, index) => {
        return (
          <>
            <SecondaryWorkmodeChoice
              key={menu.id}
              name={menu.name}
              disabled={menu.disabled}
              onClick={props.onSelect}
            />
          </>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
