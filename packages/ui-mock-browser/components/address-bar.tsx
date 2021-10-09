import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { RefreshButton } from "./refresh-button";
import { MoreHoriz } from "./more-horiz";

interface AddressBarProps {
  address: string;
  icon?: ReactNode;
  onRefreshClick: () => void;
}

export function AddressBar(props: AddressBarProps) {
  return (
    <Wrapper>
      <Frame168>
        <RefreshButton onClick={props.onRefreshClick} />
        <MoreHoriz />
      </Frame168>
      <Frame167>
        {props.icon}
        <Address>{props.address}</Address>
      </Frame167>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(216, 215, 216, 1);
  border-radius: 6px;
  position: relative;
`;

const Frame168 = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 7px;
  position: absolute;
  top: calc(50% - 8px);
  right: 10px;
`;

const Frame167 = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: start;
  gap: 6px;
  box-sizing: border-box;
  position: absolute;
  left: calc(50% - 36px);
  top: calc(50% - 7px);
`;

const BrowserTabsIndicationPlaceholder = styled.img`
  object-fit: cover;
`;

const Address = styled.span`
  color: rgba(0, 0, 0, 1);
  text-overflow: ellipsis;
  font-size: 12px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  line-height: 100%;
  text-align: center;
`;
