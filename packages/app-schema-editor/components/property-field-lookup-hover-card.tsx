import React from "react";
import styled from "@emotion/styled";
import { HoverView } from "@code-ui/hover";

export function PropertyFieldDocuemntationHoverCard() {
  return (
    <HoverView
      contents={[
        <Wrapper>
          <Image />
          <Contents>
            frame/inner-wrap/cover <br />
            fills[0].src <br />
            <br />
            current: https://unsplash.com/331SS42.png
          </Contents>
        </Wrapper>,
      ]}
    ></HoverView>
  );
  //
}

const Wrapper = styled.div`
  display: flex;
  padding: 8px;
`;

const Image = styled.div`
  width: 80px;
  height: 80px;
  background-color: wheat;
  margin-right: 6px;
`;

const Contents = styled.div`
  color: #fff;
`;
