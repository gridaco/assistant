import React from "react";
import styled from "@emotion/styled";
import { RefreshButton } from "./refresh-button";
import { MoreHoriz } from "./more-horiz";

export function AddressBar() {
  return (
    <Wrapper>
      <Frame168>
        <RefreshButton />
        <MoreHoriz />
      </Frame168>
      <Frame167>
        <BrowserTabsIndicationPlaceholder
          src="https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/76df/255d/0979e7ab815d6ca528f8d9dcd1781acf"
          alt="icon"
        ></BrowserTabsIndicationPlaceholder>
        <Address>Loading..</Address>
      </Frame167>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
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
  box-sizing: border-box;
  position: absolute;
  top: calc((calc((50% + 0px)) - 8px));
  right: 10px;
  width: 37px;
  height: 16px;
`;

const Frame167 = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: start;
  gap: 6px;
  box-sizing: border-box;
  position: absolute;
  left: calc((calc((50% + 0px)) - 36px));
  top: calc((calc((50% + 0px)) - 7px));
  width: 71px;
  height: 14px;
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
