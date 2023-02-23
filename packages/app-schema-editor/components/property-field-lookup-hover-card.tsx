import React from "react";
import styled from "@emotion/styled";
import { HoverView } from "@code-ui/hover";
import { Preview } from "@ui/previewer";

export function PropertyFieldDocuemntationHoverCard(props: {
  layer: string;
  hierarchy?: string[];
}) {
  return (
    <HoverView
      contents={[
        <Wrapper>
          <PreviewWrap>
            <Preview type="static" of={props.layer} />
          </PreviewWrap>
          <Contents>
            {props.layer}
            <br />
            <GrayContent>frame/inner-wrap/</GrayContent>cover <br />
            <br />
            fills[0].src <br />
            <br />
            <br />
            current: <br />
            https://unsplash.com/331SS42.png
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

const PreviewWrap = styled.div`
  width: 80px;
  height: 80px;
  display: inline-block;
  background-color: wheat;
  margin-right: 6px;

  // TEMP!! WILL BE CHANGE

  div {
    height: fit-content !important;
  }

  img {
    // PreviewWrap's height - Wrapper padding 8*2  - preview padding 16
    height: calc(64px - 16px) !important;
  }
`;

const Contents = styled.div`
  color: #fff;
  font-weight: normal;
  font-size: 12px;
  line-height: 90%;
  /* or 11px */

  letter-spacing: -0.015em;

  color: #ffffff;
`;

const GrayContent = styled.b`
  color: #646464;
  font-weight: normal;
`;
