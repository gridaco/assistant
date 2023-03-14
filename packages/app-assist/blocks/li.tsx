import React from "react";
import styled from "@emotion/styled";

export function ResponseActionableListItem(props: any) {
  // const text = props.children.join("\n");

  return (
    <ActionableListItem
      // onClick={() => {
      //   alert(text);
      //   // TODO:
      //   // props.onClick();
      // }}
      {...props}
      ordered={props.ordered?.toString()}
    />
  );
}

const ActionableListItem = styled.li`
  list-style: none;
  margin: 8px;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  }
`;
