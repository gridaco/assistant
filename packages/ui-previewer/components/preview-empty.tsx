import React from "react";
import styled from "@emotion/styled";

interface PreviewEmptyProps {
  type: "static" | "responsive";
}

export function handle_wrap_bg_color(type: string, hasBg: boolean): string {
  if (!hasBg) {
    return "transparent";
  }
  switch (type) {
    case "static":
      return "#F1F1F1";
    case "responsive":
      return "#fff";
  }
}

export function PreviewEmpty(props: PreviewEmptyProps) {
  return (
    <RootWrapperPreviewStaticEmpty>
      <InnerWrap>
        <ArtworkEmptystateRectAndCursorArtwork
          src="https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/c9e8/a3c5/d8dbfe0d870988f5f8999399cb0eede7"
          alt="image of ArtworkEmptystateRectAndCursorArtwork"
        ></ArtworkEmptystateRectAndCursorArtwork>
        <Notice>
          {props.type === "static" ? "Nothing is selected" : "No Selection"}
        </Notice>
      </InnerWrap>
    </RootWrapperPreviewStaticEmpty>
  );
}

const RootWrapperPreviewStaticEmpty = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex: none;
  height: 100%;
  gap: 0;
  box-sizing: border-box;
`;

const InnerWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 8px;
  width: 220px;
  height: 85px;
  box-sizing: border-box;
`;

const ArtworkEmptystateRectAndCursorArtwork = styled.img`
  object-fit: cover;
`;

const Notice = styled.span`
  color: #adaeb2;
  text-overflow: ellipsis;
  font-size: 18px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: center;
  width: 220px;
`;
