import styled from "@emotion/styled";
import React from "react";
import { Column, Row } from "@ui/core";
import { SecondaryWorkmodeChoice } from "./secondary-workmode-choice";

export function SecondaryWorkmodeMenu<T extends string>(props: {
  menus: {
    id: T;
    name: string;
    disabled?: boolean;
  }[];
  onSelect: (id: T) => void;
}) {
  return (
    <Wrapper>
      <Column style={{ marginTop: "20px" }}>
        <Row style={{ marginBottom: "4px" }}>
          {props.menus.map((menu, index) => {
            if (index < 3) {
              return (
                <SecondaryWorkmodeChoice
                  key={menu.id}
                  name={menu.name}
                  disabled={menu.disabled}
                  onClick={() => {
                    props.onSelect(menu.id);
                  }}
                />
              );
            }
          })}
        </Row>
        <Row style={{ marginBottom: "16px" }}>
          {props.menus.map((menu, index) => {
            if (index >= 3) {
              return (
                <SecondaryWorkmodeChoice
                  key={menu.id}
                  name={menu.name}
                  disabled={menu.disabled}
                  onClick={() => {
                    props.onSelect(menu.id);
                  }}
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
  background: white;
`;
