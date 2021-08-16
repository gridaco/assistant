import styled from "@emotion/styled";
import React from "react";
import { Column, Row } from "../style/global-style";
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
      <Column>
        <Row style={{ marginBottom: "4px" }}>
          {props.menus.map((menu, index) => {
            if (index < 3) {
              return (
                <SecondaryWorkmodeChoice
                  key={menu.id}
                  name={menu.name}
                  disabled={menu.disabled}
                  onClick={props.onSelect}
                />
              );
            }
          })}
        </Row>
        <Row>
          {props.menus.map((menu, index) => {
            if (index >= 3) {
              return (
                <SecondaryWorkmodeChoice
                  key={menu.id}
                  name={menu.name}
                  disabled={menu.disabled}
                  onClick={props.onSelect}
                />
              );
            }
          })}
        </Row>
      </Column>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
