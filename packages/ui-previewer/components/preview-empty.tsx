import React from "react";
import styled from "@emotion/styled";

export function PreviewEmpty() {
  return (
    <RootWrapperPreviewStaticEmpty>
      <InnerWrap>
        <ArtworkEmptystateRectAndCursorArtwork
          src={"/assets/images/empty-state-icon.png"}
          alt="image of empty state icon"
        ></ArtworkEmptystateRectAndCursorArtwork>
        <Notice>Nothing is selected</Notice>
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
  pointer-events: none;
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
  margin-left: 14px; // visual adjustment
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
